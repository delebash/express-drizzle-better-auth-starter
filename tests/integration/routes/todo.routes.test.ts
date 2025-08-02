import request from 'supertest';
import express from 'express';

// Create auth middleware mock
const mockAuthMiddleware = jest.fn((req, res, next) => {
  req.user = { id: 'user1', email: 'test@example.com' };
  next();
});

// Mock the auth middleware
jest.mock('@middleware/auth.js', () => ({
  verifyToken: mockAuthMiddleware
}));

// Create mock todos
const mockTodos = [
  {
    id: '1',
    title: 'Test Todo 1',
    description: 'Test Description 1',
    completed: false,
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Test Todo 2',
    description: 'Test Description 2',
    completed: true,
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Test Todo 3',
    description: 'Test Description 3',
    completed: false,
    userId: 'user2',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Create mock repository
const todoRepositoryMock = {
  findAllByUserId: jest.fn().mockImplementation(userId => {
    return Promise.resolve(mockTodos.filter(todo => todo.userId === userId));
  }),
  findById: jest.fn().mockImplementation(id => {
    return Promise.resolve(mockTodos.find(todo => todo.id === id));
  }),
  create: jest.fn().mockImplementation(todo => {
    const newTodo = {
      id: 'new-id',
      ...todo,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return Promise.resolve(newTodo);
  }),
  update: jest.fn().mockImplementation((id, data) => {
    const todo = mockTodos.find(t => t.id === id);
    if (!todo) return Promise.resolve(undefined);
    const updatedTodo = { ...todo, ...data, updatedAt: new Date() };
    return Promise.resolve(updatedTodo);
  }),
  delete: jest.fn().mockImplementation(id => {
    const exists = mockTodos.some(t => t.id === id);
    return Promise.resolve(exists);
  }),
  toggleComplete: jest.fn().mockImplementation(id => {
    const todo = mockTodos.find(t => t.id === id);
    if (!todo) return Promise.resolve(undefined);
    const updatedTodo = { ...todo, completed: !todo.completed, updatedAt: new Date() };
    return Promise.resolve(updatedTodo);
  })
};

// Mock the todoRepository
jest.mock('@db/repositories/index.js', () => ({
  todoRepository: todoRepositoryMock
}));

// Import after mocking
// Using relative path to avoid TypeScript errors in IDE
import todoRoutes from '@routes/todo.routes.js';

describe('Todo Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a new express app for each test
    app = express();
    app.use(express.json());
    app.use('/api/todos', todoRoutes);
  });

  describe('GET /api/todos', () => {
    it('should return all todos for the authenticated user', async () => {
      const response = await request(app).get('/api/todos');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2); // user1 has 2 todos
      expect(response.body[0].userId).toBe('user1');
    });
  });

  describe('GET /api/todos/:id', () => {
    it('should return a todo by id', async () => {
      const response = await request(app).get('/api/todos/1');
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe('1');
      expect(response.body.title).toBe('Test Todo 1');
    });

    it('should return 404 if todo is not found', async () => {
      todoRepositoryMock.findById.mockResolvedValueOnce(undefined);
      
      const response = await request(app).get('/api/todos/999');
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Todo not found');
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const todoData = {
        title: 'New Todo',
        description: 'New Description'
      };
      
      const response = await request(app)
        .post('/api/todos')
        .send(todoData);
      
      expect(response.status).toBe(201);
      expect(todoRepositoryMock.create).toHaveBeenCalledWith({
        title: 'New Todo',
        description: 'New Description',
        userId: 'user1'
      });
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('New Todo');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update a todo', async () => {
      const updateData = {
        title: 'Updated Todo',
        completed: true
      };
      
      const response = await request(app)
        .put('/api/todos/1')
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(todoRepositoryMock.update).toHaveBeenCalledWith('1', {
        title: 'Updated Todo',
        completed: true
      });
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      const response = await request(app).delete('/api/todos/1');
      
      expect(response.status).toBe(204);
      expect(todoRepositoryMock.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('PATCH /api/todos/:id/toggle', () => {
    it('should toggle todo completion status', async () => {
      const response = await request(app).patch('/api/todos/1/toggle');
      
      expect(response.status).toBe(200);
      expect(todoRepositoryMock.toggleComplete).toHaveBeenCalledWith('1');
    });
  });
});
