# Hands-On Exercises

[← Previous Exercise](01-fundamentals-exer.md) | [🏠 Home](../README.md) | [Back to module 02](/modules/02-package-json.md) | [Next Exercise →](03-installing-packages-exer.md)

## Exercise 2.1: Create a Basic Package.json

**Objective:** Create a package.json file with proper configuration.

**Steps:**
1. Create a new directory: `mkdir my-first-package`
2. Navigate into it: `cd my-first-package`
3. Initialize with prompts: `npm init`
4. Fill in the following:
   - name: `my-first-package`
   - version: `1.0.0`
   - description: `Learning NPM package.json`
   - entry point: `index.js`
   - author: Your name
   - license: `MIT`

**Expected Outcome:** A well-structured package.json file.

**Bonus:** Try `npm init -y` in a new directory and compare the results.

## Exercise 2.2: Customize Package.json

**Objective:** Manually edit and understand package.json fields.

**Starting package.json:**
```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

**Tasks:**
1. Add a meaningful description
2. Add 3-5 keywords
3. Add author information (with email)
4. Change license to MIT
5. Add a repository field pointing to a GitHub repo (real or hypothetical)
6. Add a homepage field
7. Add these scripts:
   - `start`: runs `node index.js`
   - `dev`: runs `nodemon index.js`

**Expected Result:**
```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A project for learning package.json",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["learning", "npm", "package", "tutorial"],
  "author": "Your Name <your@email.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/my-project.git"
  },
  "homepage": "https://github.com/yourusername/my-project#readme"
}
```

## Exercise 2.3: Dependencies Practice

**Objective:** Understand different dependency types.

**Steps:**
1. Create a new project with `npm init -y`
2. Install Express as a regular dependency: `npm install express`
3. Install Nodemon as a dev dependency: `npm install --save-dev nodemon`
4. Open package.json and examine the dependencies section

**Questions:**
- Where did Express appear in package.json?
- Where did Nodemon appear?
- What's the difference between these two sections?
- What do the version numbers with `^` mean?

**Expected package.json:**
```json
{
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

## Exercise 2.4: Complete Package Configuration

**Objective:** Create a production-ready package.json for a REST API.

**Requirements:**
- Name: `express-api-demo`
- Version: `0.1.0` (pre-release)
- Description: A sample REST API built with Express
- Author: Your name and email
- License: MIT
- Scripts:
  - `start`: runs `node server.js`
  - `dev`: runs `nodemon server.js`
  - `test`: runs `jest`
- Dependencies:
  - express
  - dotenv
- DevDependencies:
  - nodemon
  - jest
- Engine requirements: Node >=14.0.0
- Keywords: express, api, rest, node

**Create the package.json manually or use npm init and then modify it.**

---

# Common Pitfalls

## Pitfall 1: Invalid Package Name

**Problem:**
```json
{
  "name": "My Package"    // ❌ Contains space and capital letters
}
```

**Solution:**
```json
{
  "name": "my-package"    // ✅ Lowercase with hyphen
}
```

## Pitfall 2: Missing Main File

**Problem:**
```json
{
  "main": "index.js"    // But index.js doesn't exist!
}
```

**Solution:** Ensure the main file exists or update the field:
```json
{
  "main": "server.js"    // File that actually exists
}
```

## Pitfall 3: Wrong Dependency Type

**Problem:**
```json
{
  "dependencies": {
    "jest": "^29.5.0"    // ❌ Testing tool in dependencies
  }
}
```

**Solution:**
```json
{
  "devDependencies": {
    "jest": "^29.5.0"    // ✅ Testing tool in devDependencies
  }
}
```

**Rule of thumb:**
- **dependencies**: Needed in production
- **devDependencies**: Only needed for development/testing

## Pitfall 4: Not Specifying Engines

**Problem:** Users install your package with incompatible Node versions.

**Solution:**
```json
{
  "engines": {
    "node": ">=14.0.0"
  }
}
```

## Pitfall 5: Publishing Private Code

**Problem:** Accidentally publishing internal company code to public NPM.

**Solution:**
```json
{
  "private": true    // Prevents npm publish
}
```

---
