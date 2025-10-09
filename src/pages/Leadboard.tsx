import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<
    { username: string; score: number }[]
  >([]);

  useEffect(() => {
    const fetchLeadboard = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("username, score")
        .order("score", { ascending: false });

      if (error) {
        console.error("Erreur fetch answers:", error);
      }

      if (data) {
        setLeaderboard(data);
      }
    };

    fetchLeadboard();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-32">
      {/* Navbar */}
      <Navbar />

      {/* Titre */}
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white drop-shadow-lg">
        Classement
      </h1>

      {/* Tableau des scores */}
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4 text-gray-800">#</th>
              <th className="py-2 px-4 text-gray-800">Nom</th>
              <th className="py-2 px-4 text-gray-800">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-yellow-50" : "bg-yellow-100"
                }`}
              >
                <td className="py-2 px-4 font-semibold">{index + 1}</td>
                <td className="py-2 px-4">{player.username}</td>
                <td className="py-2 px-4 font-bold">{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
