import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// Suppress ReactQuill findDOMNode deprecation warning
const originalError = console.error;
console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('findDOMNode is deprecated')
  ) {
    return;
  }
  originalError.call(console, ...args);
};

createRoot(document.getElementById("root")!).render(<App />);
  