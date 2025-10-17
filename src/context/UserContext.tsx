import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import type { ReactNode } from "react";

type User = {
  id: string;
  pseudo: string;
  score: number;
};

type UserContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

// Créer le contexte avec des valeurs par défaut
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider pour englober ton app
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { data: profileData } = await supabase
          .from("users")
          .select("pseudo, score")
          .eq("id", data.user.id)
          .single();

        if (profileData) {
          setCurrentUser({
            id: data.user.id,
            pseudo: profileData.pseudo,
            score: profileData.score,
          });
        }
      }
    };

    getUser();

    // Pour écouter les changements de session (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from("users")
            .select("pseudo, score")
            .eq("id", session.user.id)
            .single();

          if (!profileError && profileData) {
            setCurrentUser({
              id: session.user.id,
              pseudo: profileData.pseudo,
              score: profileData.score,
            });
          } else {
            setCurrentUser({
              id: session.user.id,
              pseudo: session.user.user_metadata?.pseudo || "",
              score: 0,
            });
          }
        } else {
          setCurrentUser(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

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
