# Hands-On Exercises

[← Previous Exercise](12-troubleshooting-exer.md) | [🏠 Home](../README.md) | [Back to module 13](/modules/13-real-world-project.md) | [Next Exercise →](14-ci-cd-exer.md)

## Exercise 13.1: Complete the Setup

**Objective:** Set up the complete project from scratch.

**Steps:**
1. Create project directory and initialize
2. Install all dependencies
3. Create directory structure
4. Copy all code files
5. Create .env file
6. Start MongoDB
7. Run the application
8. Test with curl or Postman

**Expected Outcome:** Working API that you built yourself.

## Exercise 13.2: Add New Feature

**Objective:** Extend the API with a new feature.

**Task:** Add task categories

**Requirements:**
1. Add `category` field to Task model
2. Update validation schema
3. Add route to get tasks by category
4. Write tests for new feature
5. Update documentation

**Example:**
```javascript
// In Task model
category: {
  type: String,
  enum: ['work', 'personal', 'shopping', 'other'],
  default: 'other'
}
```

**Expected Outcome:** Working category feature with tests.

## Exercise 13.3: Improve Error Handling

**Objective:** Enhance error messages and handling.

**Tasks:**
1. Create custom error classes
2. Improve error messages
3. Add error logging
4. Add request ID tracking
5. Test error scenarios

**Expected Outcome:** Better error handling and debugging.

## Exercise 13.4: Add More Tests

**Objective:** Increase test coverage.

**Requirements:**
1. Add tests for all task operations
2. Test error cases
3. Test authentication edge cases
4. Achieve >80% coverage
5. Add E2E test for complete workflow

**Expected Outcome:** Comprehensive test suite.

## Exercise 13.5: Optimize Performance

**Objective:** Improve API performance.

**Tasks:**
1. Add database indexes
2. Implement pagination
3. Add caching (Redis)
4. Optimize queries
5. Measure performance improvements

**Expected Outcome:** Faster API responses.

---

# Common Pitfalls

## Pitfall 1: Not Setting Up Environment Variables

**Problem:**
```javascript
// App crashes because process.env.JWT_SECRET is undefined
```

**Solution:**
```bash
# Always copy .env.example to .env
cp .env.example .env
# Edit with your values
```

## Pitfall 2: MongoDB Connection Issues

**Problem:**
```
MongooseError: Cannot connect to MongoDB
```

**Solution:**
```bash
# Verify MongoDB is running
mongod --version

# Check connection string
echo $MONGODB_URI

# Test connection
mongo mongodb://localhost:27017/taskapi
```

## Pitfall 3: Authentication Token Issues

**Problem:**
```
Error: Not authorized to access this route
```

**Solution:**
```bash
# Ensure token is included in headers
# Format: Authorization: Bearer <token>

# Check JWT_SECRET matches in .env
```

## Pitfall 4: Validation Errors

**Problem:**
```
Validation error: "password" is required
```

**Solution:**
```javascript
// Ensure all required fields are sent
{
  "name": "John",
  "email": "john@example.com",
  "password": "password123"  // Don't forget this!
}
```

## Pitfall 5: Test Database Pollution

**Problem:**
```
Tests fail because of leftover data
```

**Solution:**
```javascript
// Clear database after each test
afterEach(async () => {
  await User.deleteMany({});
  await Task.deleteMany({});
});
```
