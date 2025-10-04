import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      {/* Contenu principal */}
      <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 pt-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center drop-shadow-lg">
          Bienvenue sur DaQuizz
        </h1>
        <p className="text-lg md:text-xl mb-12 text-center drop-shadow-md">
          Tu veux du challenge ? Choisis ton quiz et essaye de battre ton propre
          record !
        </p>

        <div className="flex flex-col gap-6">
          <button
            onClick={() => navigate("/quiz-classique")}
            className="bg-white text-yellow-600 font-semibold px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-yellow-100 hover:scale-105 transition transform"
          >
            Quiz Classique
          </button>

          <button
            onClick={() => navigate("/quiz-programmation")}
            className="bg-white text-orange-500 font-semibold px-8 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-orange-100 hover:scale-105 transition transform"
          >
            Quiz Spécial Programmation
          </button>
        </div>
      </div>
    </>
  );
}
