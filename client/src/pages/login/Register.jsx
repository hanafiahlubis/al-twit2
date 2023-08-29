import { Link } from "react-router-dom";
import { api2 } from "../../utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Rubric from "../../components/Rubric";

export default function Register() {
  const [register, setRegister] = useState({});
  const naviget = useNavigate();
  return (
    <div className="flex-col sm:flex-row  flex items-center gap-4 h-screen justify-evenly w-full bg-[#AEC3AE]">
      <Rubric />
      <form
        className="w-[80%] sm:w-[46%] lg:w-[34%] flex flex-col gap-6 bg-[#94A684] p-12 rounded-lg "
        onSubmit={(e) => {
          e.preventDefault();
          console.log(register);
          api2("/login/daftar", "POST", register).then((pesan) => {
            alert(pesan);
            setRegister({});
            naviget("/login");
          });
        }}
      >
        <h3 className="text-3xl text-center">Register</h3>
        <label className="flex flex-col">
          Email
          <input
            type="email"
            required
            autoFocus
            className="border border-black"
            value={register.email ?? ""}
            onChange={(e) =>
              setRegister({ ...register, email: e.target.value })
            }
          />
        </label>
        <label className="flex flex-col">
          Password
          <input
            type="password"
            required
            className="border border-black"
            value={register.password ?? ""}
            onChange={(e) =>
              setRegister({ ...register, password: e.target.value })
            }
          />
        </label>
        <label className="flex flex-col">
          Full Name
          <input
            type="text"
            required
            className="border border-black"
            value={register.full_name ?? ""}
            onChange={(e) =>
              setRegister({ ...register, full_name: e.target.value })
            }
          />
        </label>
        <label className="flex flex-col">
          Username
          <input
            type="text"
            required
            className="border border-black"
            value={register.username ?? ""}
            onChange={(e) =>
              setRegister({ ...register, username: e.target.value })
            }
          />
        </label>
        <button
          type="submit"
          className="hover:bg-[#E4E4D0] hover:w-28 hover:rounded-2xl m-auto"
        >
          SUBMIT
        </button>
        <div className="flex justify-between w-full">
          <Link
            to="/login"
            className="hover:bg-[#E4E4D0]  hover:rounded-2xl m-auto text-center w-[40%]"
          >
            Login
          </Link>
          <Link
            to="/forgout"
            className="hover:bg-[#E4E4D0]  w-[40%] hover:rounded-2xl m-auto text-center"
          >
            Forgot
          </Link>
        </div>
      </form>
    </div>
  );
}
