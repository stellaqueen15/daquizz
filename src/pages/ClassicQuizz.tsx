import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ClassicQuiz() {
  const navigate = useNavigate();

  // Exemple de question mockée pour l'affichage
  const question = {
    text: "Quelle est la capitale de la France ?",
    options: ["Paris", "Berlin", "Madrid", "Rome"],
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 flex flex-col items-center px-4 pt-24">
        {/* Titre du quiz */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white drop-shadow-lg">
          Quiz Classique
        </h1>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xl w-full mb-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
            {question.text}
          </h2>

          {/* Options */}
          <div className="flex flex-col gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold px-6 py-3 rounded-xl shadow-md transition transform hover:scale-105"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation / boutons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white text-yellow-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-yellow-100 hover:scale-105 transition transform"
          >
            Retour
          </button>
          <button className="bg-white text-orange-500 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-orange-100 hover:scale-105 transition transform">
            Suivant
          </button>
        </div>
      </div>
    </>
  );
}
