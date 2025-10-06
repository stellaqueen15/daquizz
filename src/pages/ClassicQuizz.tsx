import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../../supabaseClient";

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
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question>();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [goodAnswer, setGoodAnswer] = useState(false);

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

  const handleAnswer = (i: number) => {
    if (answers[i].is_correct == true) {
      setGoodAnswer(true);
      console.log(goodAnswer);
      console.log("Tu as la bonne réponse!");
    } else {
      console.log("MAUVAISE RÉPONSE");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 flex flex-col items-center px-4 pt-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white drop-shadow-lg">
          Quiz Classique
        </h1>

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
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold cursor-pointer px-6 py-3 rounded-xl shadow-md transition transform hover:scale-105"
              >
                {answer.answer_text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
