import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useParams } from "react-router-dom";
import { api, checkz } from "../../utils.js";
import { useState } from "react";
import Header from "../../components/Header";
import { BsCalendarDate } from "react-icons/bs";
import { AiFillLike } from "react-icons/ai";
import { TfiCommentsSmiley } from "react-icons/tfi";
import { FiShare2 } from "react-icons/fi";
import { DataContext } from "../../App";
import { useContext } from "react";
import { useRef } from "react";

export default function Profil() {
  const id = useParams("id");
  const [data, setData] = useState([]);
  const user = useOutletContext()[0];
  const [openPost, setOpenPost] = useState(true);
  const [openLike, setOpenLike] = useState(false);
  const { postings, setPostings } = useContext(DataContext);
  console.log(postings);
  const [like, setLike] = useState({ user: user?.id });
  const [checks, setChecks] = useState([]);
  const [count, setCount] = useState([]);
  const [openComentar, setOpenComentar] = useState(false);
  const [off, setOff] = useState(true);
  const [countComentar, setCountComentar] = useState([]);
  let temp = useRef();
  useEffect(() => {
    api(`/profil/${id.id}`).then((res) => {
      setData(res);
      console.log(res);
    });
    api(`/posting/${id.id}`).then((data) => {
      setPostings(data.data);
      setCountComentar(data.comentar);
      setCount(data.like);
      setChecks(data.check);
      console.log(postings);
    });
  }, [id.id]);

  if (user) {
    return (
      <>
        <Header />
        <main className="flex overflow-y-auto w-full p-8 gap-4 flex-col">
          <div className="flex flex-col gap-2 h-max">
            <span>
              <h1 className="text-lg font-bold">{data?.bio?.full_name}</h1>
              <h1>{data?.bio?.email}</h1>
            </span>
            <span className="flex gap-2 items-center">
              <BsCalendarDate />
              {"Joined " + data?.bio?.join_date}
            </span>
            <div className="flex gap-8">
              <h1>
                <span className="font-bold">{data?.following}</span> Following
              </h1>
              <h1>
                <span className="font-bold">{data?.followers}</span> followers
              </h1>
            </div>
          </div>
          <div className="flex w-full justify-around">
            <button
              className={`${openPost ? "bg-slate-200" : ""}`}
              onClick={async () => {
                setOpenPost(!openPost);
                setOpenLike(false);
                const data = await api(`/posting/${id.id}`);
                setPostings(data.data);
                setCountComentar(data.comentar);
                setCount(data.like);
                setChecks(data.check);
                console.log(data);
              }}
            >
              Posts
            </button>
            <button
              className={`${openLike ? "bg-slate-200 " : ""}`}
              onClick={async () => {
                console.log(user.id);
                console.log(id.id);
                const data = await api(`/posting/${user.id}/${id.id}`);
                console.log(data);
                setPostings(data.data);
                setCountComentar(data.comentar);
                setCount(data.like);
                setChecks(data.check);

                setOpenLike(!openLike);
                setOpenPost(false);
              }}
            >
              Likes
            </button>
          </div>

          {openPost && postings.length > 0 ? (
            postings?.map((posting) => (
              <button
                // to={`/profil/${posting.id_user}`}
                key={posting.id}
                className="flex  w-full p-8 gap-4 flex-col "
              >
                <div className="flex">
                  {" "}
                  <span className="flex items-center w-full justify-evenly  gap-2">
                    <h3 className="text-2xl font-bold">{posting.full_name}</h3>
                    <p className="text-sm ">{posting.email}</p>
                  </span>
                </div>
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
                      temp.current = {
                        ...like,
                        post: posting.id,
                        user: user.id,
                      };
                      setLike(temp.current);

                      const kondisi = checks.find(
                        (c) => c.id_post === posting.id && c.id_user === user.id
                      );
                      kondisi
                        ? api(`/like/${user.id}/${posting.id}`, "DELETE")
                        : api("/like", "POST", temp.current);
                      api("/like/check").then((e) => {
                        setChecks(e);
                      });
                      api("/like").then((e) => {
                        setCount(e);
                      });
                      setOff((prevOff) => !prevOff);
                    }}
                  >
                    <AiFillLike
                      size={20}
                      className={`${
                        checkz(checks, posting.id, user.id)
                          ? "text-red-600 "
                          : ""
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
            ))
          ) : (
            <h1>{openPost && "xxxx"}</h1>
          )}

          {openLike &&
            postings?.map((posting) => (
              <button
                // to={`/profil/${posting.id_user}`}
                key={posting.id}
                className="flex  w-full p-8 gap-4 flex-col "
              >
                {console.log(posting)}
                <span className="flex items-center w-full justify-evenly">
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
                      temp.current = {
                        ...like,
                        post: posting.id,
                        user: user.id,
                      };
                      setLike(temp.current);
                      console.log(temp.current);
                      const kondisi = checks.find(
                        (c) => c.id_post === posting.id && c.id_user === user.id
                      );
                      kondisi
                        ? api(`/like/${user.id}/${posting.id}`, "DELETE")
                        : api("/like", "POST", temp.current);
                      api("/like/check").then((e) => {
                        setChecks(e);
                      });
                      api("/like").then((e) => {
                        setCount(e);
                      });
                      setOff((prevOff) => !prevOff);
                    }}
                  >
                    <AiFillLike
                      size={20}
                      className={`${
                        checkz(checks, posting.id, user.id)
                          ? "text-red-600 "
                          : ""
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
        </main>
      </>
    );
  } else {
    return <Navigate to="/login" />;
  }
}
