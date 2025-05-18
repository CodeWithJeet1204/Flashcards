import { useNavigate } from "react-router-dom";
import { Card } from "../../algorithms/spacedRepetition";
import DeckGenerator from "./DeckGenerator";

/**
 * DeckGeneratorPage handles routing logic for when a deck is generated.
 * It delegates the actual deck creation UI/logic to <DeckGenerator />.
 */
export default function DeckGeneratorPage() {
  const navigate = useNavigate();

  // Called when user successfully generates a deck
  const handleSave = (deck: Card[]) => {
    localStorage.setItem("cards", JSON.stringify(deck)); // Save to local storage
    navigate("/singleplayer/session");                    // Start review session
  };

  // Renders the deck generator and provides callbacks
  return (
    <DeckGenerator
      onSave={handleSave}
      onCancel={() => navigate("/singleplayer")}
    />
  );
}
