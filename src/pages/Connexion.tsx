import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../../supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";

type User = {
  id: string;
  username: string;
};

export default function Connexion() {
  const navigate = useNavigate();
  const [pseudo, setPseudo] = useState("");
  const { currentUser, setCurrentUser } = useUser();
  const [errorUsername, setErrorUsername] = useState("");

  const handleLogin = async () => {
    // Vérification de si le pseudo existe
    const result = await supabase
      .from("users")
      .select("*")
      .eq("username", pseudo);

    const { data: existingUser, error } = result as {
      data: User[] | null;
      error: PostgrestError | null;
    };

    if (error) {
      setErrorUsername("Erreur, veillez réessayer.");
      console.error(error);
      return;
    }

    // Créer nouvel utilisateur si le pseudo n'existe pas
    if (!existingUser || existingUser.length === 0) {
      const result = await supabase
        .from("users")
        .insert({ username: pseudo })
        .select();

      const { data: newUser, error: insertError } = result as {
        data: User[] | null;
        error: PostgrestError | null;
      };

      if (insertError) {
        setErrorUsername("Erreur, veillez réessayer.");
        console.error(insertError);
        return;
      }

      setCurrentUser(newUser![0]);
      navigate("/");
    } else {
      // Connecté l'utilisateur
      setCurrentUser(existingUser[0]);
      navigate("/");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center  px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-sm w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Bienvenue !</h2>
          <p className="text-center text-gray-500 mb-6">
            Entre ton pseudo pour commencer à jouer
          </p>
          <input
            type="text"
            placeholder="Ton pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Se connecter
          </button>
          <p>{errorUsername}</p>
          <p className="text-center text-gray-400 text-sm mt-4">
            Amuse-toi bien ! 🎮
          </p>
        </div>
      </div>
    </>
  );
}
