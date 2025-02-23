import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { getAsstOutput } from "./getAssistantOutput";

// Mock the entire openai module
vi.mock("./openai", () => {
  const mockCreate = vi.fn();
  return {
    openai: {
      beta: {
        threads: {
          runs: {
            create: mockCreate,
          },
        },
      },
    },
  };
});

// Import the mocked module
import { openai } from "./openai";

describe("getAsstOutput", () => {
  const mockThreadId = "thread-123";
  const mockAsstId = "asst-123";
  const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it("should successfully process streaming response", async () => {
    // Mock streaming response
    const mockStream = [
      {
        event: "thread.message.delta",
        data: {
          delta: {
            content: [
              {
                text: {
                  value: '{"key":',
                },
              },
            ],
          },
        },
      },
      {
        event: "thread.message.delta",
        data: {
          delta: {
            content: [
              {
                text: {
                  value: '"value"}',
                },
              },
            ],
          },
        },
      },
    ];

    // Create async iterator for mock stream
    const mockAsyncIterator = {
      async *[Symbol.asyncIterator]() {
        for (const chunk of mockStream) {
          yield chunk;
        }
      },
    };

    // Setup mock
    openai.beta.threads.runs.create = vi
      .fn()
      .mockResolvedValue(mockAsyncIterator);

    const result = await getAsstOutput({
      threadId: mockThreadId,
      asstId: mockAsstId,
    });

    expect(result).toEqual({ key: "value" });
    expect(openai.beta.threads.runs.create).toHaveBeenCalledWith(mockThreadId, {
      assistant_id: mockAsstId,
      stream: true,
    });
  });

  it("should handle errors gracefully", async () => {
    // Setup mock to throw error
    openai.beta.threads.runs.create = vi
      .fn()
      .mockRejectedValue(new Error("API Error"));

    const result = await getAsstOutput({
      threadId: mockThreadId,
      asstId: mockAsstId,
    });

    expect(result).toBe("");
    expect(openai.beta.threads.runs.create).toHaveBeenCalledWith(mockThreadId, {
      assistant_id: mockAsstId,
      stream: true,
    });
    expect(consoleSpy).toHaveBeenCalledWith("ERROR: ", expect.any(Error));
  });

  it("should handle invalid JSON response", async () => {
    // Mock streaming response with invalid JSON
    const mockStream = [
      {
        event: "thread.message.delta",
        data: {
          delta: {
            content: [
              {
                text: {
                  value: "invalid json",
                },
              },
            ],
          },
        },
      },
    ];

    const mockAsyncIterator = {
      async *[Symbol.asyncIterator]() {
        for (const chunk of mockStream) {
          yield chunk;
        }
      },
    };

    openai.beta.threads.runs.create = vi
      .fn()
      .mockResolvedValue(mockAsyncIterator);

    const result = await getAsstOutput({
      threadId: mockThreadId,
      asstId: mockAsstId,
    });

    expect(result).toBe("");
    expect(consoleSpy).toHaveBeenCalledWith("ERROR: ", expect.any(SyntaxError));
  });

  it("should handle empty stream response", async () => {
    // Mock empty stream
    const mockAsyncIterator = {
      async *[Symbol.asyncIterator]() {
        // Empty iterator
      },
    };

    openai.beta.threads.runs.create = vi
      .fn()
      .mockResolvedValue(mockAsyncIterator);

    const result = await getAsstOutput({
      threadId: mockThreadId,
      asstId: mockAsstId,
    });

    expect(result).toBe("");
    expect(consoleSpy).toHaveBeenCalledWith("ERROR: ", expect.any(SyntaxError));
  });
});
