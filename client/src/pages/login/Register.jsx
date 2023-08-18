import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className=" flex w-full h-screen  items-center justify-center">
      <form className="flex flex-col w-1/2">
        <h3 className="text-3xl text-center">Register</h3>
        <label className="flex flex-col">
          Email
          <input type="email" required className="border border-black" />
        </label>
        <label className="flex flex-col">
          Password
          <input type="password" required className="border border-black" />
        </label>
        <label className="flex flex-col">
          Name
          <input type="text" required className="border border-black" />
        </label>
        <label className="flex flex-col">
          Date Brith
          <input type="date" required className="border border-black" />
        </label>
        {/* <label>
      Profil
      <input type="date" />
    </label> */}
        <button>SUBMIT</button>
        <div className="flex justify-between">
          <Link to="/register">Login</Link>
          <Link to="/forgout">Lupa Pasword</Link>
        </div>
      </form>
    </div>
  );
}
