import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../../supabaseClient";
import { useUser } from "../context/UserContext";

type Question = {
  id: number;
  question_text: string;
  type: string;
};

type Answer = {
  id: number;
  id_question: number;
  xp: number;
  is_correct: boolean;
  answer_text: string;
};

export default function ClassicQuiz() {
  const { currentUser } = useUser();
  const [question, setQuestion] = useState<Question>();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [goodAnswer, setGoodAnswer] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    const fetchQuestion = async () => {
      const { data, error } = await supabase.from("questions").select("*");

      if (error) {
        console.error("Erreur fetch questions:", error);
        return;
      }

      if (data && data.length > 0) {
        const randomQuestion = data[Math.floor(Math.random() * data.length)];
        setQuestion(randomQuestion as Question);
      }
    };

    fetchQuestion();
    setGoodAnswer(false);
    setGameOver(false);
    setTimeLeft(20);
  }, [goodAnswer]);

  useEffect(() => {
    if (!question) return;
    const fetchAnswers = async () => {
      if (!question?.id) return; // rien faire si question n'existe pas encore

      const { data, error } = await supabase
        .from("answers")
        .select("*")
        .eq("id_question", question.id);

      if (error) {
        console.error("Erreur fetch answers:", error);
      } else {
        setAnswers(data as Answer[]);
      }
    };

    fetchAnswers();
  }, [question]); // on affiche les réponses en fonction de la question qui est affiché

  const handleAnswer = async (i: number) => {
    if (currentUser) {
      const { error } = await supabase.rpc("increment_score", {
        user_id: currentUser?.id,
        xp: answers[i].xp,
      });

      if (error) {
        console.error("Erreur update score:", error);
        return;
      }

      if (answers[i].is_correct == true) {
        setGoodAnswer(true);
      } else {
        setGameOver(true);
      }
    }
  };

  useEffect(() => {
    if (timeLeft <= 0 || gameOver == true) {
      setGameOver(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // On oublie pas de nettoyer à la fin !
  }, [timeLeft, gameOver]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 flex flex-col items-center px-4 pt-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white drop-shadow-lg">
          Quiz Classique
        </h1>

        {(() => {
          if (!currentUser)
            return (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 bg-gray-100 rounded-lg shadow-md">
                <p className="text-lg font-semibold mb-4 text-gray-800">
                  Vous devez vous connecter pour jouer au quiz.
                </p>
                <a
                  href="/connexion"
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Se connecter
                </a>
              </div>
            );
          return (
            <>
              <div className="flex items-center justify-center mb-6">
                <div className="bg-white shadow-md rounded-xl px-4 py-2 flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-lg font-semibold text-gray-800">
                    Temps restant :{" "}
                    <span className="text-blue-500">{timeLeft}s</span>
                  </p>
                </div>
              </div>

              {/* Question */}
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xl w-full mb-6">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
                  {question?.question_text}
                </h2>

                {/* Options */}
                <div className="flex flex-col gap-4">
                  {answers.map((answer, index) => (
                    <button
                      onClick={() => handleAnswer(index)}
                      key={index}
                      disabled={gameOver}
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold cursor-pointer px-6 py-3 rounded-xl shadow-md transition transform hover:scale-105"
                    >
                      {answer.answer_text}
                    </button>
                  ))}
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </>
  );
}
