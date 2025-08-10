# SkillSync - Knowledge Sharing Platform

<div align="center">

![SkillSync Logo](https://img.shields.io/badge/SkillSync-Knowledge%20Sharing-blue?style=for-the-badge)

A comprehensive team knowledge sharing and collaboration platform with AI-powered features, modern UI/UX, and intelligent search capabilities.

[![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.0%2B-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)

</div>

## 🚀 Features

### 📚 Knowledge Management
- **Smart Knowledge Base**: Create, organize, and share articles, SOPs, and best practices
- **Multi-step Knowledge Creation**: Guided wizard for creating comprehensive knowledge articles
- **File Upload Support**: Upload SOPs, documents, images, and videos (up to 50MB)
- **Advanced Tagging**: Organize content with intelligent tagging system
- **Category Management**: Structured categorization for easy discovery

### Core Functionality
- **Knowledge Sharing**: Share SOPs, best practices, and experiences with categorization and tagging
- **Query-Based Support**: Ask questions and get answers from team members
- **Prompt AI for Answers**: Ask the built-in AI and get instant answers based on previously uploaded videos, SOPs, and documentation
- **Smart Search**: NLP-powered search functionality for finding relevant knowledge
- **Community Collaboration**: Project-based communities for team collaboration
- **Responsive Design**: Modern, mobile-friendly interface

### 🤖 AI-Powered Features
- **Ask AI**: Intelligent Q&A system powered by OpenAI GPT
- **Smart Search**: NLP-powered search with relevance scoring and highlighting
- **Template Suggestions**: AI-generated quick-start templates for common queries
- **Content Recommendations**: Intelligent content discovery based on user behavior

### 💬 Q&A Support
- **Community Q&A**: Ask questions and get answers from team members
- **AI-Assisted Answers**: Get AI-generated responses when human answers aren't available
- **Question Templates**: Pre-built templates for different types of questions
- **Answer Validation**: Community-driven answer quality assurance

### 👥 Community Features
- **Team Communities**: Create and join project-based communities
- **Member Management**: Add/remove members with role-based permissions
- **Activity Feeds**: Track community engagement and contributions
- **Discussion Threads**: Threaded conversations within communities

### 🎨 Modern UI/UX
- **Apple-Inspired Design**: Clean, minimalist interface with modern aesthetics
- **Dark/Light Mode**: Automatic theme switching with user preferences
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation support

### 🔐 Authentication & Security
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-Based Access**: User roles and permissions management
- **Guest Access**: Public content viewing for non-authenticated users
- **Session Management**: Secure session handling with automatic logout

### 📊 Analytics & Insights
- **Usage Analytics**: Track knowledge sharing metrics and user engagement
- **Search Analytics**: Monitor popular searches and content discovery patterns
- **Performance Metrics**: Real-time system performance monitoring
- **User Activity**: Individual and team contribution tracking

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0**: Modern React with hooks and functional components
- **React Router DOM**: Client-side routing and navigation
- **Lucide React**: Beautiful, customizable icon library
- **CSS Variables**: Dynamic theming and responsive design
- **Axios**: HTTP client for API communication

### Backend
- **Node.js 16+**: JavaScript runtime environment
- **Express.js 4.18.2**: Web application framework
- **Natural NLP**: Natural language processing for search
- **Multer**: File upload handling
- **OpenAI API**: AI-powered features integration
- **UUID**: Unique identifier generation

### Development Tools
- **Concurrently**: Run multiple npm scripts simultaneously
- **Nodemon**: Automatic server restart during development
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Git**: For version control
- **OpenAI API Key**: (Optional) For AI features

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/skillsync.git
cd skillsync
```

### 2. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run setup

# Or install separately
npm run install-backend
npm run install-frontend
```

### 3. Environment Configuration

#### Backend Configuration
```bash
cd backend
cp env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

#### Frontend Configuration
```bash
cd frontend
cp env.example .env
```

Edit the `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=SkillSync
REACT_APP_ENABLE_AI_FEATURES=true
```

### 4. Start Development

```bash
# Start both frontend and backend
npm run dev

# Or start separately
npm run dev-backend    # Backend on http://localhost:5000
npm run dev-frontend   # Frontend on http://localhost:3000
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Demo Login**: Use `admin` / `admin` for testing

## 📁 Project Structure

```
skillsync/
├── backend/                    # Backend API server
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   ├── env.example            # Environment variables template
│   └── uploads/               # File upload directory
├── frontend/                   # React frontend application
│   ├── public/                # Static assets
│   ├── src/                   # Source code
│   │   ├── components/        # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React contexts (Auth, Theme, etc.)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API services
│   │   └── App.js            # Main App component
│   ├── package.json          # Frontend dependencies
│   └── env.example           # Environment variables template
├── package.json              # Root package.json with scripts
└── README.md                 # This file
```

## 🔧 Configuration

### Backend Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `5000` | No |
| `NODE_ENV` | Environment | `development` | No |
| `CORS_ORIGIN` | Frontend URL | `http://localhost:3000` | No |
| `OPENAI_API_KEY` | OpenAI API key | - | No |
| `JWT_SECRET` | JWT signing key | - | Yes (Production) |

### Frontend Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api` | Yes |
| `REACT_APP_APP_NAME` | Application name | `SkillSync` | No |
| `REACT_APP_ENABLE_AI_FEATURES` | Enable AI features | `true` | No |

## 📊 API Documentation

### Authentication Endpoints

```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me
GET  /api/auth/verify
```

### Knowledge Base Endpoints

```http
GET    /api/knowledge
POST   /api/knowledge
PUT    /api/knowledge/:id
DELETE /api/knowledge/:id
POST   /api/knowledge/:id/like
```

### Q&A Endpoints

```http
GET    /api/queries
POST   /api/queries
POST   /api/queries/:id/answer
POST   /api/queries/:id/ai-answer
```

### Search Endpoints

```http
GET    /api/search?q=query&type=all|knowledge|queries
```

### File Upload Endpoints

```http
POST   /api/upload
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process using port 5000
npx kill-port 5000

# Or use different port
PORT=5001 npm run dev-backend
```

#### CORS Issues
- Ensure `CORS_ORIGIN` in backend `.env` matches frontend URL
- Check that both servers are running on correct ports

#### File Upload Issues
- Check file size limits (default: 50MB)
- Ensure `uploads/` directory exists and is writable
- Verify file types are allowed in server configuration

#### AI Features Not Working
- Verify `OPENAI_API_KEY` is set correctly
- Check OpenAI API quota and billing
- Ensure `NODE_TLS_REJECT_UNAUTHORIZED=0` for corporate networks

### Debugging

Enable debug logging:
```bash
# Backend
DEBUG=* npm run dev-backend

# Check browser console for frontend errors
# Check server logs for backend errors
```
## 👥 Team

- **Development Team**: SkillSync Contributors
- **Project Lead**: [Your Name]
- **UI/UX Design**: Modern Apple-inspired design principles
- **Backend Architecture**: RESTful API with NLP integration

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [OpenAI](https://openai.com/) - AI capabilities
- [Lucide](https://lucide.dev/) - Icon library
- [Natural](https://github.com/NaturalNode/natural) - NLP processing

## 📞 Support

For support, email support@skillsync.com or create an issue on GitHub.

---

<div align="center">

**Made with ❤️ by the SkillSync Team**

[Website](https://skillsync.com) • [Documentation](https://docs.skillsync.com) • [Support](mailto:support@skillsync.com)

</div>
