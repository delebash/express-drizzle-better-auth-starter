import { Todo, InsertTodo, UpdateTodo } from "@db/schema/todo.schema";
import { v4 as uuidv4 } from "uuid";

// Mock data
export const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Test Todo 1",
    description: "Test Description 1",
    completed: false,
    userId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Test Todo 2",
    description: "Test Description 2",
    completed: true,
    userId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Test Todo 3",
    description: "Test Description 3",
    completed: false,
    userId: "user2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock TodoRepository
export const mockTodoRepository = {
  create: jest.fn(async (todo: InsertTodo): Promise<Todo> => {
    const newTodo: Todo = {
      id: uuidv4(),
      ...todo,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newTodo;
  }),

  findAllByUserId: jest.fn(async (userId: string): Promise<Todo[]> => {
    return mockTodos.filter((todo) => todo.userId === userId);
  }),

  findById: jest.fn(async (id: string): Promise<Todo | undefined> => {
    return mockTodos.find((todo) => todo.id === id);
  }),

  update: jest.fn(
    async (id: string, data: UpdateTodo): Promise<Todo | undefined> => {
      const todoIndex = mockTodos.findIndex((todo) => todo.id === id);
      if (todoIndex === -1) return undefined;

      const updatedTodo = {
        ...mockTodos[todoIndex],
        ...data,
        updatedAt: new Date(),
      };

      return updatedTodo;
    }
  ),

  delete: jest.fn(async (id: string): Promise<boolean> => {
    const todoExists = mockTodos.some((todo) => todo.id === id);
    return todoExists;
  }),

  toggleComplete: jest.fn(async (id: string): Promise<Todo | undefined> => {
    const todo = mockTodos.find((todo) => todo.id === id);
    if (!todo) return undefined;

    return {
      ...todo,
      completed: !todo.completed,
      updatedAt: new Date(),
    };
  }),
};

// Mock auth middleware
export const mockAuthMiddleware = () => {
  return jest.fn((req, res, next) => {
    req.user = { id: "user1", email: "test@example.com" };
    next();
  });
};
