import { Link, useNavigate } from "react-router-dom";
import { api2 } from "../../utils";
import { useState } from "react";
import Rubric from "../../components/Rubric";
import { Modal, Input } from "antd"; // Import Input from Ant Design

export default function Register() {
  const [register, setRegister] = useState({});
  const [emailError, setEmailError] = useState(null); // Store email error message
  const navigate = useNavigate();

  const onFinish = async (e) => {
    e.preventDefault(); // Mencegah form melakukan submit secara default

    const response = await api2("/login/daftar", "POST", register);
    console.log(response.status);

    if (response.status === 201) {
      setRegister({});
      navigate("/login");
    } else if (response.status === 401) {
      setEmailError(response.message || "Email sudah terdaftar!");
    } else {
      Modal.error({
        title: "Error",
        content: response.message || "Terjadi kesalahan. Silakan coba lagi.",
        okButtonProps: {
          style: {
            backgroundColor: "#94A684",
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
        <h3 className="text-3xl text-center mb-6">Register</h3>
        <form onSubmit={onFinish} className="space-y-4">
          <div>
            <label className="block text-white mb-2" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={register.email ?? ""}
              onChange={(e) => {
                setEmailError(null); // Clear backend error when user changes input
                setRegister({ ...register, email: e.target.value });
              }}
              placeholder="Enter your email"
              className="w-full"
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </div>

          <div>
            <label className="block text-white mb-2" htmlFor="password">
              Password
            </label>
            <Input.Password
              id="password"
              value={register.password ?? ""}
              onChange={(e) => setRegister({ ...register, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-white mb-2" htmlFor="full_name">
              Full Name
            </label>
            <Input
              id="full_name"
              value={register.full_name ?? ""}
              onChange={(e) => setRegister({ ...register, full_name: e.target.value })}
              placeholder="Enter your full name"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-white mb-2" htmlFor="username">
              Username
            </label>
            <Input
              id="username"
              value={register.username ?? ""}
              onChange={(e) => setRegister({ ...register, username: e.target.value })}
              placeholder="Enter your username"
              className="w-full"
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
              to="/login"
              className="bg-[#E4E4D0] px-4 py-1 rounded-md text-sm hover:bg-[#94A684] hover:shadow-lg transition duration-150"
            >
              Login
            </Link>
            <Link
              to="/forgout"
              className="bg-[#E4E4D0] px-4 py-1 rounded-md text-sm hover:bg-[#94A684] hover:shadow-lg transition duration-150"
            >
              Forgot
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
