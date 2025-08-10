const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const natural = require('natural');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const jwt = require('jsonwebtoken'); // Commented out for now
// const bcrypt = require('bcrypt'); // Commented out for now

// Load environment variables
require('dotenv').config();

// Fix SSL certificate issues in corporate environments
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow documents, images, and videos
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|mp4|avi|mov|wmv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Initialize NLP tokenizer
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// Mock Database
let knowledge = [
  {
    id: '1',
    title: 'React Component Best Practices',
    content: 'Always use functional components with hooks. Keep components small and focused on a single responsibility. Use proper naming conventions and PropTypes for type checking.',
    category: 'Frontend Development',
    tags: ['React', 'JavaScript', 'Best Practices'],
    author: 'John Doe',
    project: 'Web Development',
    createdAt: new Date('2024-01-15'),
    likes: 15,
    type: 'best-practice',
    attachments: []
  },
  {
    id: '2',
    title: 'Database Connection SOP',
    content: 'Step 1: Ensure VPN connection is active. Step 2: Use environment variables for credentials. Step 3: Implement connection pooling. Step 4: Always close connections after use.',
    category: 'Backend Development',
    tags: ['Database', 'SOP', 'Security'],
    author: 'Jane Smith',
    project: 'Backend Services',
    createdAt: new Date('2024-01-10'),
    likes: 23,
    type: 'sop',
    attachments: []
  },
  {
    id: '3',
    title: 'Client Onboarding Process',
    content: 'Our team successfully onboarded Client X by creating a comprehensive documentation system and regular check-in meetings. Key learnings: Early stakeholder engagement is crucial.',
    category: 'Project Management',
    tags: ['Client Management', 'Onboarding', 'Experience'],
    author: 'Mike Johnson',
    project: 'Client X',
    createdAt: new Date('2024-01-20'),
    likes: 8,
    type: 'experience',
    attachments: []
  }
];

let queries = [
  {
    id: '1',
    question: 'How do I handle authentication in React?',
    answer: 'You can use Context API with useState for simple auth state management, or libraries like Auth0 for more complex scenarios.',
    author: 'Sarah Wilson',
    answeredBy: 'Alex Brown',
    project: 'Web Development',
    createdAt: new Date('2024-01-18'),
    status: 'answered',
    aiAnswer: null
  },
  {
    id: '2',
    question: 'What is the best way to optimize database queries?',
    answer: null,
    author: 'Tom Davis',
    answeredBy: null,
    project: 'Backend Services',
    createdAt: new Date('2024-01-22'),
    status: 'pending',
    aiAnswer: null
  }
];

let communities = [
  {
    id: '1',
    name: 'Web Development Team',
    project: 'Web Development',
    members: ['John Doe', 'Sarah Wilson', 'Alex Brown'],
    description: 'Frontend and full-stack development discussions',
    createdAt: new Date('2024-01-01'),
    isActive: true
  },
  {
    id: '2',
    name: 'Backend Services',
    project: 'Backend Services',
    members: ['Jane Smith', 'Tom Davis'],
    description: 'Backend architecture and database discussions',
    createdAt: new Date('2024-01-01'),
    isActive: true
  },
  {
    id: '3',
    name: 'Client X Project',
    project: 'Client X',
    members: ['Mike Johnson', 'Lisa Chen'],
    description: 'Client-specific project collaboration',
    createdAt: new Date('2024-01-01'),
    isActive: true
  }
];

// User Database
let users = [];

// Initialize simple admin user
const initializeTestUsers = () => {
  // Create admin user - simple and direct
  users.push({
    id: '1',
    username: 'admin',
    email: 'admin@skillsync.com',
    password: 'admin',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    createdAt: new Date().toISOString(),
    isActive: true
  });
  console.log('👤 Admin user ready - Username: admin, Password: admin');
};

// Initialize test users on startup
initializeTestUsers();

// Simple Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Simple token check
  if (token === 'admin-token-123') {
    req.user = {
      id: '1',
      username: 'admin',
      email: 'admin@skillsync.com',
      role: 'admin'
    };
    next();
  } else {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Optional Authentication Middleware
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token === 'admin-token-123') {
    req.user = {
      id: '1',
      username: 'admin',
      email: 'admin@skillsync.com',
      role: 'admin'
    };
  }
  next();
};

// AI Integration Setup
let openai = null;
if (process.env.OPENAI_API_KEY) {
  const { OpenAI } = require('openai');
  
  // Configure OpenAI with custom fetch for corporate environments
  const https = require('https');
  const fetch = require('node-fetch');
  
  const agent = new https.Agent({
    rejectUnauthorized: false // Bypass SSL certificate verification
  });
  
  const customFetch = (url, options = {}) => {
    return fetch(url, {
      ...options,
      agent: url.startsWith('https:') ? agent : undefined
    });
  };
  
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    fetch: customFetch
  });
}

// Helper function for enhanced NLP-based search
function calculateRelevance(content, searchTerms) {
  const contentTokens = tokenizer.tokenize(content.toLowerCase());
  const searchTokens = searchTerms.map(term => stemmer.stem(term.toLowerCase()));
  
  let relevanceScore = 0;
  let exactMatches = 0;
  let partialMatches = 0;
  
  searchTokens.forEach(searchToken => {
    contentTokens.forEach(contentToken => {
      const stemmedContentToken = stemmer.stem(contentToken);
      if (stemmedContentToken === searchToken) {
        relevanceScore += 2; // Higher weight for exact matches
        exactMatches++;
      } else if (stemmedContentToken.includes(searchToken) || searchToken.includes(stemmedContentToken)) {
        relevanceScore += 1; // Lower weight for partial matches
        partialMatches++;
      }
    });
  });
  
  // Boost score based on match density
  const matchDensity = (exactMatches * 2 + partialMatches) / contentTokens.length;
  relevanceScore *= (1 + matchDensity);
  
  return relevanceScore / searchTokens.length;
}

// AI-powered answer generation
async function generateAIAnswer(question, knowledgeContext = [], includeOnlineSearch = false) {
  if (!openai) {
    return null;
  }

  try {
    let contextText = '';
    let systemMessage = "You are a helpful assistant that provides technical guidance. Provide practical, actionable answers.";

    if (knowledgeContext && knowledgeContext.length > 0) {
      contextText = knowledgeContext
        .slice(0, 5) // Limit context to top 5 relevant items
        .map(k => `Title: ${k.title}\nContent: ${k.content}\nCategory: ${k.category}\nTags: ${k.tags.join(', ')}\n`)
        .join('\n---\n');
      
      systemMessage = "You are a helpful assistant that provides technical guidance based on a team's knowledge base. Provide practical, actionable answers.";
    }

    let prompt = '';
    
    if (contextText) {
      prompt = `Based on the following knowledge base context, provide a helpful and accurate answer to the question. If the context doesn't contain enough information, provide general guidance and suggest what additional information might be needed.

Context from Knowledge Base:
${contextText}

Question: ${question}

Please provide a clear, practical answer:`;
    } else if (includeOnlineSearch) {
      prompt = `Please provide a comprehensive and helpful answer to the following question. Use your knowledge to give practical, actionable guidance:

Question: ${question}

Please provide a clear, detailed answer with examples where appropriate:`;
    } else {
      prompt = `Please provide a helpful answer to the following question:

Question: ${question}

Please provide a clear, practical answer:`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: includeOnlineSearch ? 800 : 500,
      temperature: 0.7,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating AI answer:', error);
    return null;
  }
}

// Routes

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Validate required fields
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = users.find(user => 
      user.username === username || user.email === email
    );
    
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // For now, store password in plain text for testing (NOT for production)
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: password, // Plain text for testing
      firstName,
      lastName,
      role: 'user',
      createdAt: new Date().toISOString(),
      isActive: true
    };

    users.push(newUser);

    // Generate simple token (for testing - NOT for production)
    const token = Buffer.from(JSON.stringify({
      id: newUser.id, 
      username: newUser.username, 
      email: newUser.email,
      role: newUser.role 
    })).toString('base64');

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  // Simple check: username = admin, password = admin
  if (username === 'admin' && password === 'admin') {
    const user = {
      id: '1',
      username: 'admin',
      email: 'admin@skillsync.com',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User'
    };

    // Simple token
    const token = 'admin-token-123';

    res.json({
      message: 'Login successful',
      user: user,
      token: token
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  // In a real app, you might want to blacklist the token
  res.json({ message: 'Logout successful' });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Admin endpoint to list all users (for testing)
app.get('/api/admin/users', authenticateToken, (req, res) => {
  // Check if user is admin
  const currentUser = users.find(u => u.id === req.user.id);
  if (!currentUser || currentUser.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  // Return users without passwords
  const usersWithoutPasswords = users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  res.json({ users: usersWithoutPasswords });
});

// Enhanced search endpoint
app.get('/api/search', async (req, res) => {
  const { q, type = 'all' } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const searchTerms = tokenizer.tokenize(q.toLowerCase());
  let results = [];

  // Search knowledge base
  if (type === 'all' || type === 'knowledge') {
    const knowledgeResults = knowledge
      .map(k => ({
        ...k,
        relevance: calculateRelevance(`${k.title} ${k.content} ${k.tags.join(' ')}`, searchTerms),
        resultType: 'knowledge'
      }))
      .filter(k => k.relevance > 0);
    
    results = [...results, ...knowledgeResults];
  }

  // Search queries
  if (type === 'all' || type === 'queries') {
    const queryResults = queries
      .map(q => ({
        ...q,
        relevance: calculateRelevance(`${q.question} ${q.answer || ''}`, searchTerms),
        resultType: 'query'
      }))
      .filter(q => q.relevance > 0);
    
    results = [...results, ...queryResults];
  }

  // Sort by relevance
  results.sort((a, b) => b.relevance - a.relevance);

  res.json({
    query: q,
    totalResults: results.length,
    results: results.slice(0, 20) // Limit to top 20 results
  });
});

// AI-powered query answering
app.post('/api/queries/:id/ai-answer', async (req, res) => {
  const query = queries.find(q => q.id === req.params.id);
  
  if (!query) {
    return res.status(404).json({ error: 'Query not found' });
  }

  try {
    // Find relevant knowledge for context
    const searchTerms = tokenizer.tokenize(query.question.toLowerCase());
    const relevantKnowledge = knowledge
      .map(k => ({
        ...k,
        relevance: calculateRelevance(`${k.title} ${k.content} ${k.tags.join(' ')}`, searchTerms)
      }))
      .filter(k => k.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance);

    const aiAnswer = await generateAIAnswer(query.question, relevantKnowledge);
    
    if (aiAnswer) {
      query.aiAnswer = aiAnswer;
      query.aiAnsweredAt = new Date();
    }

    res.json(query);
  } catch (error) {
    console.error('Error generating AI answer:', error);
    res.status(500).json({ error: 'Failed to generate AI answer' });
  }
});

// Ask AI chat endpoint
app.post('/api/ask-ai', async (req, res) => {
  const { question, searchMode = 'both' } = req.body;
  
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    let knowledgeResults = [];
    let aiResponse = '';
    let sources = [];

    // Search knowledge base if requested
    if (searchMode === 'knowledge' || searchMode === 'both') {
      const searchTerms = tokenizer.tokenize(question.toLowerCase());
      knowledgeResults = knowledge
        .map(k => ({
          ...k,
          relevance: calculateRelevance(`${k.title} ${k.content} ${k.tags.join(' ')}`, searchTerms)
        }))
        .filter(k => k.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance);

      sources = knowledgeResults.slice(0, 3).map(result => ({
        type: 'knowledge',
        title: result.title,
        snippet: result.content.substring(0, 150) + '...',
        category: result.category,
        relevance: result.relevance
      }));
    }

    // Generate AI response
    const includeOnlineSearch = searchMode === 'online' || (searchMode === 'both' && knowledgeResults.length === 0);
    aiResponse = await generateAIAnswer(question, knowledgeResults, includeOnlineSearch);

    if (!aiResponse) {
      aiResponse = 'I apologize, but I encountered an issue generating a response. Please try again or contact support.';
    }

    res.json({
      question,
      answer: aiResponse,
      sources,
      searchMode,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Error in Ask AI endpoint:', error);
    res.status(500).json({ error: 'Failed to process AI request' });
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileInfo = {
    id: uuidv4(),
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: req.file.path,
    uploadedAt: new Date()
  };

  res.json(fileInfo);
});

// Get all knowledge
app.get('/api/knowledge', (req, res) => {
  const { category, project, search, type } = req.query;
  let filteredKnowledge = [...knowledge];

  if (category) {
    filteredKnowledge = filteredKnowledge.filter(k => k.category === category);
  }

  if (project) {
    filteredKnowledge = filteredKnowledge.filter(k => k.project === project);
  }

  if (type) {
    filteredKnowledge = filteredKnowledge.filter(k => k.type === type);
  }

  if (search) {
    const searchTerms = tokenizer.tokenize(search.toLowerCase());
    filteredKnowledge = filteredKnowledge
      .map(k => ({
        ...k,
        relevance: calculateRelevance(`${k.title} ${k.content} ${k.tags.join(' ')}`, searchTerms)
      }))
      .filter(k => k.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance);
  } else {
    filteredKnowledge.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.json(filteredKnowledge);
});

// Create new knowledge
app.post('/api/knowledge', (req, res) => {
  const { title, content, category, tags, author, project, type, attachments } = req.body;
  
  const newKnowledge = {
    id: uuidv4(),
    title,
    content,
    category,
    tags: tags || [],
    author,
    project,
    type: type || 'knowledge',
    createdAt: new Date(),
    likes: 0,
    attachments: attachments || []
  };

  knowledge.push(newKnowledge);
  res.status(201).json(newKnowledge);
});

// Like knowledge
app.post('/api/knowledge/:id/like', (req, res) => {
  const knowledgeItem = knowledge.find(k => k.id === req.params.id);
  if (knowledgeItem) {
    knowledgeItem.likes += 1;
    res.json(knowledgeItem);
  } else {
    res.status(404).json({ error: 'Knowledge not found' });
  }
});

// Get all queries
app.get('/api/queries', (req, res) => {
  const { project, status } = req.query;
  let filteredQueries = [...queries];

  if (project) {
    filteredQueries = filteredQueries.filter(q => q.project === project);
  }

  if (status) {
    filteredQueries = filteredQueries.filter(q => q.status === status);
  }

  filteredQueries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(filteredQueries);
});

// Create new query
app.post('/api/queries', async (req, res) => {
  const { question, author, project, requestAIAnswer } = req.body;
  
  const newQuery = {
    id: uuidv4(),
    question,
    answer: null,
    author,
    answeredBy: null,
    project,
    createdAt: new Date(),
    status: 'pending',
    aiAnswer: null
  };

  // Generate AI answer if requested
  if (requestAIAnswer && openai) {
    try {
      const searchTerms = tokenizer.tokenize(question.toLowerCase());
      const relevantKnowledge = knowledge
        .map(k => ({
          ...k,
          relevance: calculateRelevance(`${k.title} ${k.content} ${k.tags.join(' ')}`, searchTerms)
        }))
        .filter(k => k.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance);

      const aiAnswer = await generateAIAnswer(question, relevantKnowledge);
      if (aiAnswer) {
        newQuery.aiAnswer = aiAnswer;
        newQuery.aiAnsweredAt = new Date();
      }
    } catch (error) {
      console.error('Error generating AI answer:', error);
    }
  }

  queries.push(newQuery);
  res.status(201).json(newQuery);
});

// Answer a query
app.post('/api/queries/:id/answer', (req, res) => {
  const { answer, answeredBy } = req.body;
  const query = queries.find(q => q.id === req.params.id);
  
  if (query) {
    query.answer = answer;
    query.answeredBy = answeredBy;
    query.status = 'answered';
    res.json(query);
  } else {
    res.status(404).json({ error: 'Query not found' });
  }
});

// Get communities
app.get('/api/communities', (req, res) => {
  res.json(communities);
});

// Create new community
app.post('/api/communities', (req, res) => {
  const { name, project, description, members } = req.body;
  
  const newCommunity = {
    id: uuidv4(),
    name,
    project,
    description,
    members: members || [],
    createdAt: new Date(),
    isActive: true
  };

  communities.push(newCommunity);
  res.status(201).json(newCommunity);
});

// Join community
app.post('/api/communities/:id/join', (req, res) => {
  const { memberName } = req.body;
  const community = communities.find(c => c.id === req.params.id);
  
  if (community) {
    if (!community.members.includes(memberName)) {
      community.members.push(memberName);
    }
    res.json(community);
  } else {
    res.status(404).json({ error: 'Community not found' });
  }
});

// Get community by project
app.get('/api/communities/:project', (req, res) => {
  const community = communities.find(c => c.project === req.params.project);
  if (community) {
    res.json(community);
  } else {
    res.status(404).json({ error: 'Community not found' });
  }
});

// Get categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(knowledge.map(k => k.category))];
  res.json(categories);
});

// Get projects
app.get('/api/projects', (req, res) => {
  const projects = [...new Set(knowledge.map(k => k.project))];
  res.json(projects);
});

// Get analytics/dashboard data
app.get('/api/analytics', (req, res) => {
  const totalKnowledge = knowledge.length;
  const totalQueries = queries.length;
  const answeredQueries = queries.filter(q => q.status === 'answered').length;
  const totalCommunities = communities.length;
  
  const categoryDistribution = knowledge.reduce((acc, k) => {
    acc[k.category] = (acc[k.category] || 0) + 1;
    return acc;
  }, {});

  const typeDistribution = knowledge.reduce((acc, k) => {
    acc[k.type] = (acc[k.type] || 0) + 1;
    return acc;
  }, {});

  const recentActivity = [
    ...knowledge.slice(-5).map(k => ({ ...k, activityType: 'knowledge' })),
    ...queries.slice(-5).map(q => ({ ...q, activityType: 'query' }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

  res.json({
    totalKnowledge,
    totalQueries,
    answeredQueries,
    totalCommunities,
    categoryDistribution,
    typeDistribution,
    recentActivity,
    answerRate: totalQueries > 0 ? Math.round((answeredQueries / totalQueries) * 100) : 0
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SkillSync server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS origin: ${CORS_ORIGIN}`);
  console.log(`🤖 AI Integration: ${openai ? 'Enabled' : 'Disabled (Set OPENAI_API_KEY to enable)'}`);
}); 