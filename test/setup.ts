import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { handlers } from "../app/mocks/handlers";

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

// Mock fetch globally
global.fetch = vi.fn();

// Mock environment variables that might be needed for tests
process.env.OPENAI_API_KEY = "test-api-key";
