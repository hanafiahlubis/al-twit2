import { useEffect } from "react";
import { Navigate, useOutletContext } from "react-router-dom";
import { api } from "../utils";
import { useState } from "react";

export default function Protected({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useOutletContext();

  useEffect(() => {
    api.get("/login/me").then(async (response) => {
      if (response.ok) {
        const user = await response.json();
        setUser(user);
      }
      setLoading(false);
    });
  }, [setUser]);

  return loading ? (
    <div className="m-auto">Memuat...</div>
  ) : user ? (
    children
  ) : (
    <Navigate to="/login" />
  );
}
