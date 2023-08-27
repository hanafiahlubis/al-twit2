import { Link } from "react-router-dom";
import { api2 } from "../../utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [register, setRegister] = useState({});
  const naviget = useNavigate();
  return (
    <div className=" flex w-full h-screen  items-center justify-center">
      <form
        className="flex flex-col w-1/2"
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
        <button type="submit">SUBMIT</button>
        <div className="flex justify-between">
          <Link to="/login">Login</Link>
          <Link to="/forgout">Lupa Pasword</Link>
        </div>
      </form>
    </div>
  );
}
