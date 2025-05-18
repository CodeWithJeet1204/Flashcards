import { BrowserRouter, Routes, Route } from "react-router-dom";

// Home & Core
import HomePage from "./pages/HomePage";
import FavoriteCards from "./pages/FavoriteCards";

// Singleplayer Mode
import SelectDeck from "./components/deck/SelectDeck";
import Singleplayer from "./pages/SinglePlayer";
import DeckGeneratorPage from "./components/deck/DeckGeneratorPage";

// Multiplayer Challenge
import ChallengeLobby from "./components/challenge/ChallengeLobby";
import ChallengeGame from "./components/challenge/ChallengeGame";
import ChallengeResults from "./components/challenge/ChallengeResults";
import ParallaxBackground from "./components/common/ParallaxBackground";
import DarkModeToggle from "./components/common/DarkModeToggle";
import SettingsToggle from "./components/common/SettingsToggle";

export default function App() {
  return (
    <>
      <ParallaxBackground />

      <BrowserRouter>
        <Routes>
          {/* 🏠 Home */}
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoriteCards />} />

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
    </>
  );
}
