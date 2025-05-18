import { BrowserRouter, Routes, Route } from "react-router-dom";

// Home & Core
import HomePage from "./pages/HomePage";

// Singleplayer Mode
import SelectDeck from "./components/SelectDeck";
import Singleplayer from "./pages/SinglePlayer";
import DeckGeneratorPage from "./components/DeckGeneratorPage";

// Multiplayer Challenge
import ChallengeLobby from "./components/ChallengeLobby";
import ChallengeGame from "./components/ChallengeGame";
import ChallengeResults from "./components/ChallengeResults";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🏠 Home */}
        <Route path="/" element={<HomePage />} />

        {/* 🧠 Singleplayer */}
        <Route path="/singleplayer" element={<SelectDeck />} />
        <Route path="/singleplayer/session" element={<Singleplayer />} />
        <Route path="/singleplayer/generator" element={<DeckGeneratorPage />} />

        {/* ⚔️ Multiplayer Challenge */}
        <Route path="/challenge/:id/lobby" element={<ChallengeLobby />} />
        <Route path="/challenge/:id/game" element={<ChallengeGame />} />
        <Route path="/challenge/:id/results" element={<ChallengeResults />} />
      </Routes>
    </BrowserRouter>
  );
}
