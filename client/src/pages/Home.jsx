import { useEffect } from "react";
import Header from "../components/Header";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function Home() {
  const [user] = useOutletContext();
  console.log(user);
  const [postings, setPostings] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/posting/all")
      .then((respose) => respose.json())
      .then((data) => {
        setPostings(data);
        console.log(data);
      });
  }, []);
  //
  return (
    <>
      {user ? (
        <>
          <Header />
          <main className="flex overflow-y-auto w-full p-8 gap-4 flex-col">
            {postings.map((posting) => {
              return (
                <div key={posting.id}>
                  <p className="text-justify">{posting.caption}</p>
                  <img
                    className="m-auto"
                    src={posting.img}
                    alt="Posting Error"
                  />
                  <hr className="border border-black" />
                </div>
              );
            })}
          </main>
        </>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
}
