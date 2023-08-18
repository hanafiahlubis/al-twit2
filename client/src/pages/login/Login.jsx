import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
// import { google } from "googleapis";

// const YOUR_CLIENT_ID =
//   "697977968992-hoklnd9077ntc7bbordionb6e90si9pu.apps.googleusercontent.com";
// const YOUR_CLIENT_SECRET = "123";
// const YOUR_REDIRECT_URL = "localhost:5173/auth-callback";

// const oauth2Client = new google.auth.OAuth2(
//   YOUR_CLIENT_ID,
//   YOUR_CLIENT_SECRET,
//   YOUR_REDIRECT_URL
// );

// // generate a url that asks permissions for Blogger and Google Calendar scopes
// const scopes = ["https://www.googleapis.com/auth/email"];

// const url = oauth2Client.generateAuthUrl({
//   // 'online' (default) or 'offline' (gets refresh_token)
//   access_type: "offline",

//   // If you only need one scope you can pass it as a string
//   scope: scopes,
// });

export default function Login() {
  const navigate = useNavigate();
  const setUser = useOutletContext()[1];
  return (
    <div className="flex items-center gap-4 h-screen justify-evenly  ';                                                                                                                     ">
      <h1 className="text-6xl">Al-Twit</h1>
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          setUser({ id: 1, name: "Ali", email: "" });
          navigate("/");
        }}
      >
        <h3 className="text-3xl  text-center">Login</h3>
        <label className="flex flex-col">
          Email
          <input type="text" required className="border border-black" />
        </label>
        <label className="flex flex-col">
          Password
          <input type="password" required className="border border-black" />
        </label>
        <button>SUBMIT</button>
        <div className="flex justify-between">
          <Link to="/forgout">Lupa Pasword</Link>
          <Link to="/register">Register</Link>
        </div>
        <a href="#">google</a>
      </form>
    </div>
  );
}
