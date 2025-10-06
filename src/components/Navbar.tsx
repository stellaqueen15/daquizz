import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser } = useUser();

  return (
    <nav className="fixed mt-4 top-0 left-1/2 transform -translate-x-1/2 w-[370px] flex justify-between items-center h-13 bg-white text-amber-800 px-6 rounded-2xl shadow-md font-medium z-50">
      <button
        className="cursor-pointer hover:text-amber-700"
        onClick={() => navigate("/")}
      >
        Accueil
      </button>
      <button
        className="cursor-pointer hover:text-amber-700"
        onClick={() => navigate("/classement")}
      >
        Classement
      </button>
      {(() => {
        if (currentUser)
          return (
            <button
              className="bg-gradient-to-br from-yellow-300 to-orange-400  p-2 rounded-xl shadow-sm cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              {currentUser.username}
            </button>
          );
        return (
          <button
            className="bg-gradient-to-br from-yellow-300 to-orange-400  p-2 rounded-xl shadow-sm cursor-pointer"
            onClick={() => navigate("/connexion")}
          >
            Se connecter
          </button>
        );
      })()}
    </nav>
  );
}
