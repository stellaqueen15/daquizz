import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Home from "./pages/Home";
import QuizClassique from "./pages/ClassicQuizz";
import Leadboard from "./pages/Leadboard";
import Connexion from "./pages/Connexion";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz-classique" element={<QuizClassique />} />
          <Route path="/classement" element={<Leadboard />} />
          <Route path="/connexion" element={<Connexion />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
