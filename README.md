# SkillSync - Knowledge Sharing Platform

![SkillSync Logo](https://img.shields.io/badge/SkillSync-Knowledge%20Sharing-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Node.js](https://img.shields.io/badge/node.js-v14+-green?style=flat-square)
![React](https://img.shields.io/badge/react-v18+-blue?style=flat-square)

SkillSync is a modern, AI-powered knowledge-sharing platform designed to help teams collaborate effectively, share SOPs, best practices, and experiences while reducing the need for Knowledge Transfer (KT) sessions.

## 🚀 Features

### Core Functionality
- **Knowledge Sharing**: Share SOPs, best practices, and experiences with categorization and tagging
- **Query-Based Support**: Ask questions and get answers from team members
- **Smart Search**: NLP-powered search functionality for finding relevant knowledge
- **Community Collaboration**: Project-based communities for team collaboration
- **Responsive Design**: Modern, mobile-friendly interface

### Key Benefits
- ✅ **Reduce KT Sessions**: AI model reduces need for Knowledge Transfer sessions
- ✅ **Increase Efficiency**: Employees can quickly find solutions
- ✅ **Improve Knowledge Sharing**: Centralized knowledge base and Q&A system

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP requests
- **Lucide React** - Modern icon library
- **CSS3** - Custom styling with responsive design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Natural** - NLP library for intelligent search
- **UUID** - Unique identifier generation
- **CORS** - Cross-origin resource sharing

### AI/NLP Features
- **Text Processing**: Tokenization and stemming
- **Relevance Scoring**: Content matching with semantic understanding
- **Smart Search**: Context-aware search results

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager


### 2. Install Dependencies
```bash
# Install all dependencies (frontend + backend)
npm run install-all
```
### 3. Environment Setup
```bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit the .env files with your configuration
```
### 4. Start the Application
```bash
# Start both frontend and backend concurrently
npm run dev
```

**Or run separately:**
```bash
# Terminal 1 - Backend (Port 5000)
npm run server

# Terminal 2 - Frontend (Port 3000)
npm run client
```

## 📁 Project Structure

```
skillsync/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.js          # Main app component
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── server.js           # Express server with API routes
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## 🎯 Key Components

### Frontend Components
- **Dashboard**: Overview with stats and recent activity
- **Knowledge Base**: Browse, search, and create knowledge items
- **Q&A Support**: Ask questions and provide answers
- **Community**: Project-based collaboration spaces
- **Modals**: Create knowledge, ask questions, answer queries

### Backend Features
- **RESTful API**: Complete CRUD operations
- **NLP Search**: Intelligent content matching
- **Mock Database**: In-memory data storage
- **CORS Support**: Cross-origin requests handled

## 🔧 API Endpoints

### Knowledge Management
- `GET /api/knowledge` - Get all knowledge items
- `POST /api/knowledge` - Create new knowledge
- `POST /api/knowledge/:id/like` - Like knowledge item

### Q&A System
- `GET /api/queries` - Get all queries
- `POST /api/queries` - Create new query
- `POST /api/queries/:id/answer` - Answer a query

### Community Features
- `GET /api/communities` - Get all communities
- `GET /api/communities/:project` - Get community by project

### Utility Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/projects` - Get all projects

## 🎨 User Interface

### Design Principles
- **Clean & Modern**: Minimalist design with clear typography
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Intuitive**: Easy navigation with clear visual hierarchy
- **Accessible**: High contrast colors and proper ARIA labels

### Key UI Features
- **Interactive Cards**: Hover effects and smooth transitions
- **Smart Filtering**: Real-time search and category filtering
- **Modal Forms**: User-friendly forms for content creation
- **Visual Feedback**: Loading states, success messages, and error handling

## 🤖 AI/NLP Features

### Smart Search
- **Tokenization**: Break down search queries into meaningful terms
- **Stemming**: Reduce words to their root forms for better matching
- **Relevance Scoring**: Calculate content relevance based on term matching
- **Context Awareness**: Understand search intent beyond exact matches

### Content Processing
- **Tag Analysis**: Process and match content tags
- **Title Matching**: Prioritize title relevance in search results
- **Content Scanning**: Full-text search across knowledge items

## 🚀 Getting Started

1. **Explore the Dashboard**: Start with an overview of your knowledge base
2. **Browse Knowledge**: Discover existing SOPs, best practices, and experiences
3. **Search Smart**: Use the intelligent search to find specific information
4. **Ask Questions**: Get help from team members through the Q&A system
5. **Join Communities**: Collaborate with project-specific teams
6. **Share Knowledge**: Contribute your own expertise to help others

## 📝 Usage Examples

### Creating Knowledge
1. Click "Share Knowledge" button
2. Fill in title, content, category, and project
3. Add relevant tags for better discoverability
4. Submit to share with your team

### Asking Questions
1. Navigate to Q&A Support
2. Click "Ask Question"
3. Select relevant project and describe your question
4. Team members can provide answers

### Finding Information
1. Use the search bar in the header
2. Apply filters by category, project, or type
3. Switch between grid and list views
4. Like helpful content to increase its visibility


**Built with ❤️ for better knowledge sharing and team collaboration**
