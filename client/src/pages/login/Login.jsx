import { useNavigate, useOutletContext, Link, Navigate } from "react-router-dom";
import Rubric from "../../components/Rubric";
import { useState } from "react";
import { api } from "../../utils.js";
import { Modal, Input } from "antd"; // Import Modal and Input from Ant Design

export default function Login() {
  const [login, setLogin] = useState({});
  const navigate = useNavigate();
  const [user, setUser] = useOutletContext();

  if (user) return <Navigate to="/" />;
  const API_URL = import.meta.env.VITE_API_URL;

  const onFinish = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/api/login`, {
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
    } else {
      const message = await response.text();

      // Display a modal error instead of alert
      Modal.error({
        title: 'Login Failed',
        content: message || "Invalid credentials. Please try again.",
        style: {
          top: "10px"
        },
        okButtonProps: {
          style: {
            backgroundColor: "#94A684", // Color matching the theme
            borderColor: "#94A684",
            color: "#000",
          },
        },
      });
    }
  };

  return (
    <div className="flex-col sm:flex-row flex items-center gap-4 h-screen justify-evenly w-full bg-[#AEC3AE]">
      <Rubric />
      <div className="w-[80%] sm:w-[46%] lg:w-[34%] bg-[#94A684] p-12 rounded-lg">
        <h3 className="text-3xl text-center mb-6">Login</h3>
        <form onSubmit={onFinish} className="space-y-4">
          <div>
            <label className="block text-white mb-2" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              maxLength={30}
              placeholder="example@example.com"
              value={login.email ?? ""}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2" htmlFor="password">
              Password
            </label>
            <Input.Password
              id="password"
              maxLength={30}
              placeholder="Enter your password"
              value={login.password ?? ""}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              className="w-full"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-[#E4E4D0] text-black hover:bg-[#94A684] hover:shadow-lg transition-all duration-150 py-2 rounded-md"
            >
              Submit
            </button>
          </div>

          <div className="flex justify-between">
            <Link
              to="/forgout"
              className="bg-[#E4E4D0] px-4 py-1 rounded-md text-sm hover:bg-[#94A684] hover:shadow-lg transition duration-150"
            >
              Forgot
            </Link>
            <Link
              to="/register"
              className="bg-[#E4E4D0] px-4 py-1 rounded-md text-sm hover:bg-[#94A684] hover:shadow-lg transition duration-150"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
