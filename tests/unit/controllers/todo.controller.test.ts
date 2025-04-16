import { Request, Response } from 'express';

// Define the AuthenticatedRequest type locally to avoid import issues
type AuthenticatedRequest = Request & {
  user?: { id: string; email?: string }
};

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

// Mock the repositories module
jest.mock('@db/repositories', () => ({
  todoRepository: todoRepositoryMock
}));

// Import after mocking
// Using relative path to avoid TypeScript errors in IDE
import { TodoController } from '../../../src/controllers/todo.controller';

describe('TodoController', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let responseObject: any = {};

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock response
    responseObject = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation(result => {
        responseObject = result;
        return mockResponse;
      }),
      send: jest.fn().mockReturnThis()
    };

    // Setup mock request with authenticated user
    mockRequest = {
      user: { id: 'user1' },
      params: {},
      body: {}
    };
  });

  describe('getAllTodos', () => {
    it('should return all todos for authenticated user', async () => {
      // Act
      await TodoController.getAllTodos(mockRequest as AuthenticatedRequest, mockResponse as Response);
      
      // Assert
      expect(todoRepositoryMock.findAllByUserId).toHaveBeenCalledWith('user1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
      expect(responseObject).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: '1', userId: 'user1' }),
        expect.objectContaining({ id: '2', userId: 'user1' })
      ]));
    });

    it('should return 401 if user is not authenticated', async () => {
      // Arrange
      mockRequest.user = undefined;
      
      // Act
      await TodoController.getAllTodos(mockRequest as AuthenticatedRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
  });

  describe('getTodoById', () => {
    it('should return a todo by id if it belongs to the user', async () => {
      // Arrange
      mockRequest.params = { id: '1' };
      
      // Act
      await TodoController.getTodoById(mockRequest as AuthenticatedRequest, mockResponse as Response);
      
      // Assert
      expect(todoRepositoryMock.findById).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual(expect.objectContaining({ id: '1', userId: 'user1' }));
    });

    it('should return 404 if todo is not found', async () => {
      // Arrange
      mockRequest.params = { id: 'nonexistent' };
      todoRepositoryMock.findById.mockResolvedValueOnce(undefined);
      
      // Act
      await TodoController.getTodoById(mockRequest as AuthenticatedRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Todo not found' });
    });

    it('should return 403 if todo belongs to another user', async () => {
      // Arrange
      mockRequest.params = { id: '3' }; // belongs to user2
      
      // Act
      await TodoController.getTodoById(mockRequest as AuthenticatedRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Forbidden' });
    });
  });

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      // Arrange
      mockRequest.body = { title: 'New Todo', description: 'New Description' };
      
      // Act
      await TodoController.createTodo(mockRequest as AuthenticatedRequest, mockResponse as Response);
      
      // Assert
      expect(todoRepositoryMock.create).toHaveBeenCalledWith({
        title: 'New Todo',
        description: 'New Description',
        userId: 'user1'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('updateTodo', () => {
    it('should update a todo if it belongs to the user', async () => {
      // Arrange
      mockRequest.params = { id: '1' };
      mockRequest.body = { title: 'Updated Title' };
      
      // Act
      await TodoController.updateTodo(mockRequest as AuthenticatedRequest, mockResponse as Response);
      
      // Assert
      expect(todoRepositoryMock.update).toHaveBeenCalledWith('1', { title: 'Updated Title' });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo if it belongs to the user', async () => {
      // Arrange
      mockRequest.params = { id: '1' };
      
      // Act
      await TodoController.deleteTodo(mockRequest as AuthenticatedRequest, mockResponse as Response);
      
      // Assert
      expect(todoRepositoryMock.delete).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });
  });

  describe('toggleTodoComplete', () => {
    it('should toggle the completion status of a todo', async () => {
      // Arrange
      mockRequest.params = { id: '1' };
      
      // Act
      await TodoController.toggleTodoComplete(mockRequest as AuthenticatedRequest, mockResponse as Response);
      
      // Assert
      expect(todoRepositoryMock.toggleComplete).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });
});
