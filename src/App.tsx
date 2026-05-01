import "./App.css";
import type { Board } from "./game/types";
import { GameBoard } from "./components/GameBoard";

type AppProps = Readonly<{
  board: Board;
}>;

function App({ board }: AppProps) {
  return (
    <main className="app-root">
      <section className="game-shell" aria-label="2048 game container">
        <header className="game-header">
          <p className="game-kicker">React 2048</p>
          <h1 className="game-title">2048</h1>
          <p className="game-subtitle">
            Swipe logic next. Board foundation first.
          </p>
        </header>
        <GameBoard board={board} />
      </section>
    </main>
  );
}

export default App;
