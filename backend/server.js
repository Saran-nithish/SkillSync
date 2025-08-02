const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const natural = require('natural');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    type: 'best-practice'
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
    type: 'sop'
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
    type: 'experience'
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
    status: 'answered'
  },
  {
    id: '2',
    question: 'What is the best way to optimize database queries?',
    answer: null,
    author: 'Tom Davis',
    answeredBy: null,
    project: 'Backend Services',
    createdAt: new Date('2024-01-22'),
    status: 'pending'
  }
];

let communities = [
  {
    id: '1',
    name: 'Web Development Team',
    project: 'Web Development',
    members: ['John Doe', 'Sarah Wilson', 'Alex Brown'],
    description: 'Frontend and full-stack development discussions'
  },
  {
    id: '2',
    name: 'Backend Services',
    project: 'Backend Services',
    members: ['Jane Smith', 'Tom Davis'],
    description: 'Backend architecture and database discussions'
  },
  {
    id: '3',
    name: 'Client X Project',
    project: 'Client X',
    members: ['Mike Johnson', 'Lisa Chen'],
    description: 'Client-specific project collaboration'
  }
];

// Helper function for NLP-based search
function calculateRelevance(content, searchTerms) {
  const contentTokens = tokenizer.tokenize(content.toLowerCase());
  const searchTokens = searchTerms.map(term => stemmer.stem(term.toLowerCase()));
  
  let relevanceScore = 0;
  searchTokens.forEach(searchToken => {
    contentTokens.forEach(contentToken => {
      const stemmedContentToken = stemmer.stem(contentToken);
      if (stemmedContentToken === searchToken) {
        relevanceScore += 1;
      } else if (stemmedContentToken.includes(searchToken) || searchToken.includes(stemmedContentToken)) {
        relevanceScore += 0.5;
      }
    });
  });
  
  return relevanceScore / searchTokens.length;
}

// Routes

// Get all knowledge
app.get('/api/knowledge', (req, res) => {
  const { category, project, search } = req.query;
  let filteredKnowledge = [...knowledge];

  if (category) {
    filteredKnowledge = filteredKnowledge.filter(k => k.category === category);
  }

  if (project) {
    filteredKnowledge = filteredKnowledge.filter(k => k.project === project);
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
  const { title, content, category, tags, author, project, type } = req.body;
  
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
    likes: 0
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
app.post('/api/queries', (req, res) => {
  const { question, author, project } = req.body;
  
  const newQuery = {
    id: uuidv4(),
    question,
    answer: null,
    author,
    answeredBy: null,
    project,
    createdAt: new Date(),
    status: 'pending'
  };

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

app.listen(PORT, () => {
  console.log(`🚀 SkillSync server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS origin: ${CORS_ORIGIN}`);
}); 