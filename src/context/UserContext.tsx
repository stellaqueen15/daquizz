import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// Définir le type User
type User = {
  id: string;
  username: string;
};

// Définir le type du contexte
type UserContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

// Créer le contexte avec des valeurs par défaut
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider pour englober ton app
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook pratique pour utiliser le contexte
// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
