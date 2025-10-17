import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../../supabaseClient";

export default function Inscription() {
  const navigate = useNavigate();
  const { setCurrentUser } = useUser();
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async () => {
    if (!pseudo.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("Tous les champs sont obligatoires !");
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { pseudo } },
    });

    if (signUpError) {
      setErrorMsg(signUpError.message);
      return;
    }

    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();

    if (getUserError || !user) {
      console.error(
        "Impossible de récupérer le user après signUp",
        getUserError
      );
      setErrorMsg("Erreur lors de la récupération du profil utilisateur.");
      return;
    }

    const { error: upsertError } = await supabase.from("users").upsert({
      id: user.id,
      pseudo,
      score: 0,
    });

    if (upsertError) {
      console.error("Erreur insertion user:", upsertError);
      setErrorMsg("Erreur lors de la création du profil utilisateur.");
      return;
    }

    setCurrentUser({
      id: user.id,
      pseudo,
      score: 0,
    });

    navigate("/profile");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center  px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-sm w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Bienvenue !</h2>
          <p className="text-center text-gray-500 mb-6">
            Tu souhaites jouer au quiz ? Inscris-toi !
          </p>
          <input
            type="text"
            placeholder="Ton pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          />
          <input
            type="email"
            placeholder="Ton email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          />
          <input
            type="password"
            placeholder="Ton mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          />
          <button
            onClick={handleRegister}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold cursor-pointer py-3 rounded-xl transition-colors"
          >
            S'inscrire
          </button>
          <p className="text-red-500 mt-3">{errorMsg}</p>
          <p className="text-center text-gray-400 text-sm mt-4">
            Amuse-toi bien !
          </p>
          <p
            className="text-center text-gray-400 cursor-pointer text-sm mt-4"
            onClick={() => navigate("/connexion")}
          >
            Déjà un compte ? Connecte toi !
          </p>
        </div>
      </div>
    </>
  );
}
