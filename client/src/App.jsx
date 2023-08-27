import { useEffect } from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { api } from "./utils.js";
import { createContext } from "react";
export const DataContext = createContext();
export default function App() {
  const [user, setUser] = useState({});
  const [postings, setPostings] = useState([]);
  useEffect(() => {
    api("/me").then((me) => {
      console.log(user);
      if (!me) {
        setUser(null);
      } else {
        setUser(me);
        setPostings({ ...postings, user: user.id });
        console.log(postings);
      }
    });
  }, []);
  console.log(user);
  return (
    <>
      <DataContext.Provider value={{ postings, setPostings }}>
        <Outlet context={[user, setUser]} />
      </DataContext.Provider>
    </>
  );
}
