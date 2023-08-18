import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function App() {
  const [user, setUser] = useState({});
  return <Outlet context={[user, setUser]} />;
}
