import { describe, it, expect, vi } from "vitest";

// Mock react-dom/client để không thật sự mount DOM thật
vi.mock("react-dom/client", () => {
  return {
    createRoot: vi.fn(() => ({
      render: vi.fn(),
    })),
  };
});

// Import sau khi mock để main.jsx dùng mock version
import "../main.jsx";

import * as ReactDOM from "react-dom/client";

describe("main.jsx entry point", () => {
  it("gọi createRoot và render App mà không lỗi", () => {
    expect(ReactDOM.createRoot).toHaveBeenCalledTimes(1);

    const rootInstance = ReactDOM.createRoot.mock.results[0].value;

    expect(rootInstance.render).toHaveBeenCalledTimes(1);
  });
});
