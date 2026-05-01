import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createEmptyBoard } from "./game/board";

const board = createEmptyBoard();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App board={board} />
  </StrictMode>,
);
