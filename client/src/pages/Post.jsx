import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useParams } from "react-router-dom";
import { api, checkz } from "../utils.js";
import { useState } from "react";
import Header from "../components/Header";
import { AiFillLike } from "react-icons/ai";
import { TfiCommentsSmiley } from "react-icons/tfi";
import { FiShare2 } from "react-icons/fi";
import { AllStateContext, DataContext } from "../App";
import { useContext } from "react";
import { useRef } from "react";
import Postingan from "../components/Postingan.jsx";

export default function Post() {
  const id = useParams("id");
  const user = useOutletContext()[0];
  const {
    // openComentar,
    // setOpenComentar,
    // dataComentar,
    // setDataComentar,
    // countComentar,
    setCountComentar,
    // like,
    // setLike,
    // openRetweet,
    // setOpenRetweet,
    // dataRetweet,
    // setDataRetweet,
    // dataFollower,
    setDataFollower,
    // checks,
    setChecks,
    // count,
    setCount,
    // allFollower,
    // setAllFollower,
  } = useContext(AllStateContext);
  const [countentComentar, setCountentComentar] = useState([]);
  let temp = useRef();
  const { postings, setPostings } = useContext(DataContext);

  useEffect(() => {
    api.get(`/posting/by/${id.id}`).then((data) => {
      setPostings(data.data);
      setCountComentar(data.comentar);
      setCount(data.like);
      setChecks(data.check);
      setDataFollower(data.follower);

      setCountentComentar(data.contentComentar);
      console.log(data.contentComentar);
    });
  }, [id.id]);

  if (user) {
    return (
      <>
        <Header />

        {/* <main className="flex overflow-y-auto w-full p-8 gap-4 flex-col">
          {postings.map((posting) => (
            <button
              // to={`/profil/${posting.id_user}`}
              key={posting.id}
              className="flex  w-full p-8 gap-4 flex-col "
            >
              <span className="flex items-center w-full gap-2 ">
                <h3 className="text-2xl font-bold">{posting.full_name}</h3>
                <p className="text-sm ">{posting.email}</p>
              </span>
              <p className="text-justify">{posting.content}</p>
              <img
                className="m-auto"
                src={`${posting.mediaUrl}`}
                alt="Posting Error"
              />
              <hr className="border border-black" />
              <div className="flex justify-evenly items-center w-full">
                <button
                  disabled={!off}
                  className="flex items-center w-[3.5rem] justify-around "
                  onClick={() => {
                    console.log(posting.id);
                    setOff((prevOff) => !prevOff);
                    temp.current = { ...like, post: posting.id };
                    setLike(temp.current);
                    const kodinsi = checks.find(
                      (c) => c.id_post === posting.id && c.id_user === user.id
                    );
                    if (kodinsi) {
                      api.delete(`/like/${user.id}/${posting.id}`);
                    } else {
                      console.log(temp.current);
                      api.post("/like", temp.current);
                    }
                    api.get("/like/check").then((e) => {
                      setChecks(e);
                    });
                    api.get("/like").then((e) => {
                      setCount(e);
                    });
                    setOff((prevOff) => !prevOff);
                  }}
                >
                  <AiFillLike
                    size={20}
                    className={`${
                      checkz(checks, posting.id, user.id) ? "text-red-600 " : ""
                    } w-8`}
                  />
                  {count.map((e, index) =>
                    e.id_post === posting.id && e.banyak !== 0 ? (
                      <span key={index}>{e.banyak}</span>
                    ) : null
                  )}
                </button>
                <FiShare2 />
                <button
                  className="flex items-center w-8 justify-between"
                  onClick={() => {
                    setOpenComentar(!openComentar);
                  }}
                >
                  <TfiCommentsSmiley />
                  {countComentar.map((e, index) =>
                    e.id_pos === posting.id && e.banyak !== 0 ? (
                      <span key={index}>{e.banyak}</span>
                    ) : (
                      ""
                    )
                  )}
                </button>
              </div>
             
            </button>
          ))}
        </main> */}
        <Postingan />
        <div className="w-full">
          {countentComentar.map((e, i) => (
            <div key={i}>
              <span className="flex justify-between">
                <div className="flex gap-4">
                  <h3>{e.full_name}</h3>
                  <h3>{e.email}</h3>
                </div>
                <span> {e.id_user === user.id && <h1>xxxx</h1>} </span>
              </span>
              <h1 className="text-start">{e.content}</h1>
            </div>
          ))}
        </div>
      </>
    );
  } else {
    return <Navigate to="/login" />;
  }
}
