import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.ts and .env files
  dir: "./",
});

const config: Config = {
  // Use jsdom to simulate a browser environment
  testEnvironment: "jsdom",

  // Setup files to run after the test framework is installed
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Module name mapper to handle path aliases (matching tsconfig paths)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // Test file patterns
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{ts,tsx}",
    "<rootDir>/src/**/*.{spec,test}.{ts,tsx}",
  ],

  // Coverage configuration
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/types/**",
    "!src/**/node_modules/**",
  ],
};

export default createJestConfig(config);
