import DeckGenerator from "../components/DeckGenerator";
import { useNavigate } from "react-router-dom";
import { Card } from "../algorithms/spacedRepetition";

export default function DeckGeneratorPage() {
  const navigate = useNavigate();

  const handleSave = (deck: Card[]) => {
    localStorage.setItem("cards", JSON.stringify(deck));
    navigate("/singleplayer/session");
  };

  return <DeckGenerator onSave={handleSave} onCancel={() => navigate("/singleplayer")} />;
}
