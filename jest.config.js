import { pathsToModuleNameMapper } from "ts-jest";
import type { Config } from "jest";
import { compilerOptions } from "./tsconfig.test.json";

const jestConfig: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ["<rootDir>"],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(
    compilerOptions.paths,
    { prefix: '<rootDir>/' }
  ),
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.ts',
    '<rootDir>/tests/integration/setup.ts'
  ],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }]
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/db/migrations/**',
    '!src/db/seed.ts',
    '!src/index.ts',
    '!src/types/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  testTimeout: 10000,
};

export default jestConfig;
