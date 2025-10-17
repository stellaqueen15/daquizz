import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { supabase } from "../../supabaseClient";

export default function Connexion() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUser();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erreur déconnexion:", error.message);
      return;
    }

    setCurrentUser(null);
    navigate("/");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-sm w-full">
          <h2 className="text-2xl font-bold text-center mb-6">
            Profil du joueur
          </h2>

          <div className="text-center mb-6">
            <p className="text-xl font-semibold text-gray-800">
              {currentUser?.pseudo}
            </p>
            <p className="text-gray-500">
              Score :{" "}
              <span className="font-bold text-blue-500">
                {currentUser?.score}
              </span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors mb-4"
          >
            Déconnecter
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Bonne chance pour améliorer ton score !
          </p>
        </div>
      </div>
    </>
  );
}
