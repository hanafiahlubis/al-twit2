import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import Rubric from "../../components/Rubric";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { api } from "../../utils.js";
export default function Login() {
  const [login, setLogin] = useState({});
  const navigate = useNavigate();
  const [user, setUser] = useOutletContext();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );
      const userInfo = await response.json();
      console.log(userInfo);
    },
    // flow: 'implicit', // implicit is the default
  });

  if (user) {
    return <Navigate to="/" />;
  } else {
    return (
      <div className="flex items-center gap-4 h-screen justify-evenly w-full">
        <Rubric />
        <form
          className="flex flex-col gap-6"
          onSubmit={async (e) => {
            e.preventDefault();
            const response = await fetch(`http://localhost:3000/api/login`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(login),
            });
            if (response.ok) {
              setUser(await api.get("/login/me"));
              navigate("/");

              // localStorage
              // const auth = await response.json();
              // localStorage.setItem("token", auth.token);
              // setUser(auth.user);
              // navigate("/");
            } else {
              const message = await response.text();
              alert(message);
            }
          }}
        >
          <h3 className="text-3xl  text-center">Login</h3>
          <label className="flex flex-col">
            Email
            <input
              type="email"
              required
              autoFocus
              className="border border-black"
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
            />
          </label>
          <label className="flex flex-col">
            Password
            <input
              type="password"
              required
              className="border border-black"
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
            />
          </label>
          <button>SUBMIT</button>
          <div className="flex justify-between">
            <Link to="/forgout">Lupa Pasword</Link>
            <Link to="/register">Register</Link>
          </div>

          <button onClick={() => googleLogin()}>Login dengan Google</button>
        </form>
      </div>
    );
  }
}
