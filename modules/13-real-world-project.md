# Module 13: Real-World Project

[← Previous Module](12-troubleshooting.md) | [🏠 Home](../README.md) | [Next Module →](14-ci-cd.md)

---

## Module Overview

It's time to put everything you've learned into practice! In this module, you'll build a complete REST API project from scratch, applying NPM concepts, best practices, and professional workflows.

**Learning Objectives:**
- Set up a professional Node.js project
- Implement proper dependency management
- Create useful NPM scripts
- Apply security best practices
- Use proper project structure
- Prepare project for deployment
- Document your project properly

---

## 13.1 Project Overview

### What We're Building

**Task Management API** - A RESTful API for managing tasks and users.

**Features:**
- User authentication (JWT)
- CRUD operations for tasks
- Task filtering and searching
- Input validation
- Error handling
- Database integration (MongoDB)
- API documentation

**Tech Stack:**
- Node.js & Express
- MongoDB & Mongoose
- JWT for authentication
- Jest for testing
- ESLint for linting
- Environment variables

**Why This Project?**

This project demonstrates:
- Real-world NPM usage
- Proper dependency management
- Professional project structure
- Security best practices
- Testing implementation
- CI/CD preparation

---

## 13.2 Project Setup

### Step 1: Initialize Project

**Create project directory:**
```bash
# Create and navigate to project
mkdir task-api
cd task-api

# Initialize Git
git init

# Initialize NPM
npm init
```

**Answer prompts:**
```
package name: task-api
version: 1.0.0
description: RESTful API for task management
entry point: src/server.js
test command: jest
git repository: (your repo URL)
keywords: api, rest, tasks, express
author: Your Name
license: MIT
```

### Step 2: Create Project Structure

**Create directory structure:**
```bash
mkdir -p src/{controllers,models,routes,middleware,utils}
mkdir -p test/{unit,integration}
mkdir config
touch src/server.js src/app.js
touch .env.example .gitignore .npmrc README.md
```

**Final structure:**
```
task-api/
├── config/
│   └── db.js
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── task.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── task.routes.js
│   ├── utils/
│   │   └── logger.js
│   ├── app.js
│   └── server.js
├── test/
│   ├── unit/
│   └── integration/
├── .env
├── .env.example
├── .gitignore
├── .npmrc
├── package.json
└── README.md
```

### Step 3: Configure .gitignore

**.gitignore:**
```
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*

# Coverage
coverage/
.nyc_output/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Build
dist/
build/
```

### Step 4: Configure .npmrc

**.npmrc:**
```
save-exact=true
engine-strict=true
```

### Step 5: Create .env.example

**.env.example:**
```
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/taskapi

# Authentication
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=debug
```

---

## 13.3 Installing Dependencies

### Production Dependencies

**Install core dependencies:**
```bash
# Core framework
npm install express

# Database
npm install mongoose

# Authentication
npm install jsonwebtoken bcryptjs

# Validation
npm install joi

# Environment variables
npm install dotenv

# Utilities
npm install cors helmet morgan
```

**Verify package.json:**
```json
{
  "dependencies": {
    "express": "4.18.2",
    "mongoose": "7.5.0",
    "jsonwebtoken": "9.0.2",
    "bcryptjs": "2.4.3",
    "joi": "17.10.0",
    "dotenv": "16.3.1",
    "cors": "2.8.5",
    "helmet": "7.0.0",
    "morgan": "1.10.0"
  }
}
```

### Development Dependencies

**Install dev tools:**
```bash
# Testing
npm install --save-dev jest supertest

# Code quality
npm install --save-dev eslint prettier

# Development server
npm install --save-dev nodemon

# MongoDB memory server for testing
npm install --save-dev mongodb-memory-server
```

**Verify devDependencies:**
```json
{
  "devDependencies": {
    "jest": "29.6.4",
    "supertest": "6.3.3",
    "eslint": "8.49.0",
    "prettier": "3.0.3",
    "nodemon": "3.0.1",
    "mongodb-memory-server": "8.15.1"
  }
}
```

---

## 13.4 Configuring NPM Scripts

### Essential Scripts

**Add to package.json:**
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "test:unit": "jest test/unit",
    "test:integration": "jest test/integration",
    "lint": "eslint src",
    "lint:fix": "eslint src --fix",
    "format": "prettier --write \"src/**/*.js\"",
    "format:check": "prettier --check \"src/**/*.js\"",
    "prepare": "node -e \"try { require('husky').install() } catch (e) {}\""
  }
}
```

### Script Explanations

**start:** Production server
```bash
npm start
```

**dev:** Development with auto-restart
```bash
npm run dev
```

**test:** Run all tests with coverage
```bash
npm test
```

**lint:** Check code quality
```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

**format:** Code formatting
```bash
npm run format
npm run format:check  # Check without modifying
```

---

## 13.5 Implementing the Application

### Database Configuration

**config/db.js:**
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### User Model

**src/models/User.js:**
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Task Model

**src/models/Task.js:**
```javascript
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
taskSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);
```

### Authentication Middleware

**src/middleware/auth.middleware.js:**
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

module.exports = { protect };
```

### Validation Middleware

**src/middleware/validate.middleware.js:**
```javascript
const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    next();
  };
};

// Validation schemas
const schemas = {
  register: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  createTask: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    status: Joi.string().valid('todo', 'in-progress', 'done'),
    priority: Joi.string().valid('low', 'medium', 'high'),
    dueDate: Joi.date(),
  }),

  updateTask: Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    status: Joi.string().valid('todo', 'in-progress', 'done'),
    priority: Joi.string().valid('low', 'medium', 'high'),
    dueDate: Joi.date(),
  }),
};

module.exports = { validate, schemas };
```

### Error Handling Middleware

**src/middleware/error.middleware.js:**
```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
```

### Auth Controller

**src/controllers/auth.controller.js:**
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
```

### Task Controller

**src/controllers/task.controller.js:**
```javascript
const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;
    
    // Build query
    const query = { user: req.user.id };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.title = { $regex: search, $options: 'i' };

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check ownership
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task',
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check ownership
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check ownership
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
```

### Routes

**src/routes/auth.routes.js:**
```javascript
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validate.middleware');

router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);
router.get('/me', protect, getMe);

module.exports = router;
```

**src/routes/task.routes.js:**
```javascript
const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validate.middleware');

router
  .route('/')
  .get(protect, getTasks)
  .post(protect, validate(schemas.createTask), createTask);

router
  .route('/:id')
  .get(protect, getTask)
  .put(protect, validate(schemas.updateTask), updateTask)
  .delete(protect, deleteTask);

module.exports = router;
```

### Express App

**src/app.js:**
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/error.middleware');

// Route files
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
```

### Server

**src/server.js:**
```javascript
require('dotenv').config();
const app = require('./app');
const connectDB = require('../config/db');

// Connect to database
connectDB();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
```

---

## 13.6 Testing

### Unit Tests

**test/unit/task.controller.test.js:**
```javascript
const Task = require('../../src/models/Task');
const { createTask, getTasks } = require('../../src/controllers/task.controller');

// Mock Mongoose
jest.mock('../../src/models/Task');

describe('Task Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 'user123' },
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      req.body = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const mockTask = {
        _id: 'task123',
        title: 'Test Task',
        user: 'user123',
      };

      Task.create.mockResolvedValue(mockTask);

      await createTask(req, res, next);

      expect(Task.create).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        user: 'user123',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        task: mockTask,
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      Task.create.mockRejectedValue(error);

      await createTask(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getTasks', () => {
    it('should get all tasks for user', async () => {
      const mockTasks = [
        { _id: 'task1', title: 'Task 1', user: 'user123' },
        { _id: 'task2', title: 'Task 2', user: 'user123' },
      ];

      Task.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockTasks),
      });

      await getTasks(req, res, next);

      expect(Task.find).toHaveBeenCalledWith({ user: 'user123' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        tasks: mockTasks,
      });
    });
  });
});
```

### Integration Tests

**test/integration/auth.test.js:**
```javascript
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('should not register user with existing email', async () => {
      await User.create({
        name: 'Existing User',
        email: 'test@example.com',
        password: 'password123',
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation error');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('should not login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
```

### Jest Configuration

**jest.config.js:**
```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
  ],
  testMatch: [
    '**/test/**/*.test.js',
  ],
  verbose: true,
};
```

---

## 13.7 Code Quality

### ESLint Configuration

**.eslintrc.js:**
```javascript
module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
  },
};
```

### Prettier Configuration

**.prettierrc:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

---

## 13.8 Documentation

### README.md

**README.md:**
```markdown
# Task Management API

RESTful API for managing tasks and users built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- CRUD operations for tasks
- Task filtering and searching
- Input validation
- Error handling
- MongoDB integration
- Comprehensive testing

## Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 5.0
- npm >= 9.0.0

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/task-api.git
cd task-api
```

2. Install dependencies
```bash
npm install
```

3. Create .env file
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

5. Run the application
```bash
# Development
npm run dev

# Production
npm start
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run all tests with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Tasks

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <token>

# Query parameters (optional)
?status=todo
?priority=high
?search=project
```

#### Get Single Task
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the API development",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2024-12-31"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "done"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

## Environment Variables

```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskapi
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
LOG_LEVEL=debug
```

## Testing

Run tests with coverage:
```bash
npm test
```

View coverage report:
```bash
open coverage/lcov-report/index.html
```

## Project Structure

```
task-api/
├── config/
│   └── db.js                 # Database configuration
├── src/
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Custom middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
├── test/
│   ├── unit/                # Unit tests
│   └── integration/         # Integration tests
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
├── package.json            # NPM dependencies
└── README.md               # Documentation
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Helmet for security headers
- CORS enabled
- Input validation with Joi
- MongoDB injection prevention

## License

MIT

## Author

Your Name - [your@email.com](mailto:your@email.com)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
```

---

## 13.9 Running the Project

### Step 1: Setup Environment

**Create .env file:**
```bash
cp .env.example .env
```

**Edit .env:**
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskapi
JWT_SECRET=my-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
LOG_LEVEL=debug
```

### Step 2: Start MongoDB

**Local MongoDB:**
```bash
# Start MongoDB service
mongod

# Or on macOS with Homebrew
brew services start mongodb-community
```

**Or use MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskapi
```

### Step 3: Install Dependencies

```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

### Step 4: Run Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm test
open coverage/lcov-report/index.html
```

### Step 5: Start Development Server

```bash
# Start with nodemon
npm run dev

# Server should start on http://localhost:3000
```

### Step 6: Test API Endpoints

**Register a user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Create a task (use token from login):**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Complete NPM Course",
    "description": "Finish all modules",
    "priority": "high"
  }'
```

**Get all tasks:**
```bash
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 13.10 Project Enhancements

### Optional Improvements

**1. Add API Documentation:**
```bash
# Install Swagger
npm install swagger-jsdoc swagger-ui-express

# Add Swagger documentation to routes
```

**2. Add Rate Limiting:**
```bash
# Install rate limiter
npm install express-rate-limit

# Implement in middleware
```

**3. Add Logging:**
```bash
# Install Winston
npm install winston

# Create logger utility
```

**4. Add Database Seeding:**
```javascript
// scripts/seed.js
const seedData = async () => {
  // Add sample users and tasks
};
```

**5. Add API Versioning:**
```javascript
// v1 routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
```

---

##  Hands-On Exercises

>Go to the [exercises](/exercises/13-real-world-project-exer.md) for this section for the full instructions on how to complete each exercise.

### Exercise 13.1: Complete the Setup

**Objective:** Set up the complete project from scratch.

### Exercise 13.2: Add New Feature

**Objective:** Extend the API with a new feature.

### Exercise 13.3: Improve Error Handling

**Objective:** Enhance error messages and handling.

### Exercise 13.4: Add More Tests

**Objective:** Increase test coverage.

### Exercise 13.5: Optimize Performance

**Objective:** Improve API performance.

---

## Project Checklist

### Before Running
- ☐ All dependencies installed
- ☐ .env file created and configured
- ☐ MongoDB running
- ☐ Correct Node version (18+)

### Code Quality
- ☐ All tests passing
- ☐ Linting passes
- ☐ Code formatted
- ☐ No console errors

### Functionality
- ☐ User registration works
- ☐ User login works
- ☐ Task CRUD operations work
- ☐ Authentication middleware works
- ☐ Validation works
- ☐ Error handling works

### Documentation
- ☐ README.md complete
- ☐ API endpoints documented
- ☐ Environment variables documented
- ☐ Setup instructions clear

### Security
- ☐ Passwords hashed
- ☐ JWT tokens working
- ☐ Input validation in place
- ☐ Error messages don't leak info
- ☐ CORS configured

---

## Summary

In this module, you:

✅ Built a complete REST API from scratch  
✅ Applied proper NPM project structure  
✅ Implemented authentication with JWT  
✅ Created comprehensive tests  
✅ Followed security best practices  
✅ Used professional NPM scripts  
✅ Documented your project properly  
✅ Applied everything learned in the course  

### Key Takeaways

- **Project structure matters** - Organize code logically
- **Test everything** - Unit and integration tests
- **Security first** - Hash passwords, validate input
- **Document well** - README and API docs
- **Use NPM scripts** - Automate common tasks
- **Environment variables** - Never hardcode secrets
- **Error handling** - Graceful error responses
- **Code quality** - Linting and formatting

---

## Next Steps

Congratulations on building a complete project! Now you're ready to learn how to integrate NPM into CI/CD pipelines and automate your deployment process.

**Continue to:** [Module 14: CI/CD with NPM →](14-ci-cd.md)

---

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io - JSON Web Tokens](https://jwt.io/)
- [Jest Documentation](https://jestjs.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [REST API Best Practices](https://restfulapi.net/)

---

## Discussion

Have questions about the project? Join the discussion:
- [GitHub Discussions](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/discussions)
- Found an error? [Open an issue](https://github.com/Leonardo-Garzon-1995/npm-mastery-course/issues)

---

[← Previous Module](12-troubleshooting.md) | [🏠 Home](../README.md) | [Next Module →](14-ci-cd.md)