import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

export const useUserAuth = () => {
  const { user, loading, clearUser } = useContext(UserContext);
  const naviagte = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) {
      clearUser();
      naviagte("/login");
    }
  }, [user, loading, clearUser, naviagte]);
};
