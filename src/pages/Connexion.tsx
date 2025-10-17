import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../../supabaseClient";

export default function Connexion() {
  const navigate = useNavigate();
  const { setCurrentUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleConnexion = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Tous les champs sont obligatoires !");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    const user = data.user || data.session?.user;
    if (!user) {
      setErrorMsg("Impossible de récupérer l'utilisateur après connexion.");
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .select("pseudo, score")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Erreur profil:", profileError);
      setErrorMsg("Impossible de charger le profil utilisateur.");
      return;
    }

    if (profileData) {
      setCurrentUser({
        id: user.id,
        pseudo: profileData.pseudo,
        score: profileData.score,
      });
    }

    navigate("/profile");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center  px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-sm w-full">
          <h2 className="text-2xl font-bold text-center mb-6">
            Re bienvenue !
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Une envie te prends de tester tes capacités en développement ?
            Connecte toi !
          </p>
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
            onClick={handleConnexion}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold cursor-pointer py-3 rounded-xl transition-colors"
          >
            Se connecter
          </button>
          <p className="text-red-500 mt-3">{errorMsg}</p>
          <p className="text-center text-gray-400 text-sm mt-4">
            Amuse-toi bien !
          </p>
          <p
            className="text-center text-gray-400 cursor-pointer text-sm mt-4"
            onClick={() => navigate("/inscription")}
          >
            Pas encore de compte ? Inscris-toi !
          </p>
        </div>
      </div>
    </>
  );
}
