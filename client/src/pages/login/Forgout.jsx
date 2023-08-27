import { Link } from "react-router-dom";
import { api2 } from "../../utils";
import { useState } from "react";
import Rubric from "../../components/Rubric";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Forgout() {
  const [forgout, setForgout] = useState({});
  const [openPassword, setOpenPassword] = useState(false);
  const temp = useRef(0);
  const naviget = useNavigate();
  return (
    <div className="flex items-center gap-4 h-screen justify-evenly w-full">
      <Rubric />
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (temp.current === 1) {
            api2("/login/forgout", "PUT", forgout).then((pesan) => {
              alert(pesan);
              setOpenPassword(!openPassword);
              temp.current = 0;
              setForgout({});
              naviget("/login");
            });
          } else if (temp.current === 0) {
            api2("/login/check", "POST", forgout).then((pesan) => {
              alert(pesan);
              setOpenPassword(!openPassword);
              temp.current++;
            });
          }
        }}
      >
        <h3 className="text-3xl text-center">Forgot</h3>

        {!openPassword ? (
          <label className="flex flex-col">
            Email
            <input
              type="email"
              required
              className="border border-black"
              value={forgout.email ?? ""}
              onChange={(e) =>
                setForgout({ ...forgout, email: e.target.value })
              }
            />
          </label>
        ) : (
          <label className="flex flex-col">
            NEW Password
            <input
              type="password"
              required
              className="border border-black"
              value={forgout.password ?? ""}
              onChange={(e) =>
                setForgout({ ...forgout, password: e.target.value })
              }
            />
          </label>
        )}
        <button>SUBMIT</button>
        <div className="flex justify-between">
          <Link to="/login">Login</Link>
          <Link to="/forgout">Lupa Pasword</Link>
        </div>
      </form>
    </div>
  );
}
