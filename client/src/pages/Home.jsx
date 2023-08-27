import { useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import Header from "../components/Header";
import { DataContext } from "../App";
import { useState } from "react";
import { useRef } from "react";
import { AiFillLike } from "react-icons/ai";
import { TfiCommentsSmiley } from "react-icons/tfi";
import { FiShare2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { api, checkz } from "../utils.js";
// import { NavLink } from "react-router-dom";

export default function Home() {
  const user = useOutletContext()[0];
  const { postings, setPostings } = useContext(DataContext);
  const [like, setLike] = useState({ user: user?.id });
  const [checks, setChecks] = useState([]);
  const [count, setCount] = useState([]);
  const [openComentar, setOpenComentar] = useState(false);
  const [openRetweet, setOpenRetweet] = useState(false);
  const [off, setOff] = useState(true);
  const [dataComentar, setDataComentar] = useState({});
  const [countComentar, setCountComentar] = useState([]);
  const [countRedweed, setCountRedweed] = useState([]);
  let temp = useRef();

  useEffect(() => {
    api("/posting").then((data) => {
      setPostings(data.data);
      setCountRedweed(data.redweed);
    });
    api("/like/check").then((e) => {
      setChecks(e);
    });
    api("/like/").then((e) => {
      setCount(e);
    });
    api("/comentar").then((e) => {
      setCountComentar(e);
    });
  }, [user]);

  if (user) {
    return (
      <>
        {openComentar && (
          <div className="block w-screen  sm:w-full  fixed h-screen left-0 top-0 z-50  overflow-y-hidden">
            <form
              className="absolute bg-white flex flex-col gap-4 p-8 rounded-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-[512px] shadow-xl  shadow-black"
              onSubmit={async (e) => {
                e.preventDefault();
                console.log(dataComentar);
                api("/comentar", "POST", dataComentar);

                setCountComentar(await api("/comentar"));
                setDataComentar({});
                setOpenComentar(!openComentar);
              }}
            >
              <span className="flex items-center w-full gap-2 ">
                <h3 className="text-2xl font-bold">{dataComentar.name}</h3>
                <p className="text-sm ">{dataComentar.email}</p>
              </span>
              <h3>{dataComentar.content}</h3>
              <textarea
                cols="25"
                rows="7"
                autoFocus
                required
                placeholder="Post Your Reply"
                className="resize-none focus:outline-none outline-double"
                maxLength={153}
                onChange={(e) => {
                  setDataComentar({
                    ...dataComentar,
                    commentar: e.target.value,
                  });
                }}
              ></textarea>
              <button>SUBMIT</button>
              <button
                type="button"
                onClick={() => setOpenComentar(!openComentar)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
        {openRetweet && (
          <div className="block w-screen  sm:w-full  fixed h-screen left-0 top-0 z-50  overflow-y-hidden">
            <form
              className="absolute bg-white flex flex-col gap-4 p-8 rounded-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-[512px] shadow-xl  shadow-black"
              onSubmit={async (e) => {
                e.preventDefault();
                console.log(dataComentar);
                api("/retweed", "POST", dataComentar);

                setCountComentar(await api("/comentar"));
                setDataComentar({});
                setOpenRetweet(!openRetweet);
              }}
            >
              <h1 className="text-2xl text-center font-bold">Retweet</h1>
              <textarea
                cols="25"
                rows="7"
                autoFocus
                required
                placeholder="Post Your Reply"
                className="resize-none focus:outline-none outline-double"
                maxLength={153}
                onChange={(e) => {
                  setDataComentar({
                    ...dataComentar,
                    isi: e.target.value,
                  });
                }}
              ></textarea>
              <span className="flex items-center w-full gap-2 ">
                <h3 className="text-2xl font-bold">{dataComentar.name}</h3>
                <p className="text-sm ">{dataComentar.email}</p>
              </span>
              <h3>{dataComentar.content}</h3>
              <button>SUBMIT</button>
              <button
                type="button"
                onClick={() => setOpenRetweet(!openRetweet)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        <Header />
        <main className="flex overflow-y-auto w-full p-8 gap-4 flex-col ">
          {postings && postings.length > 0 ? (
            postings.map((posting) => (
              <>
                <Link
                  to={`/post/${posting.id}`}
                  key={posting.id}
                  className="flex flex-col gap-4 "
                >
                  <Link
                    to={`/profil/${posting.id_user}`}
                    className="flex items-center w-full gap-4 "
                  >
                    <h3 className="text-2xl font-bold">{posting.full_name}</h3>
                    <p className="text-sm ">{posting.email}</p>
                  </Link>
                  <p className="text-justify">{posting.content}</p>
                  <img
                    className="m-auto"
                    src={`${posting.mediaUrl}`}
                    alt="Posting Error"
                  />
                  <hr className="border border-black" />
                </Link>
                <div className="flex justify-evenly items-center w-full relative">
                  <button
                    disabled={!off}
                    className="flex items-center w-[3.5rem] justify-around "
                    onClick={() => {
                      setOff((prevOff) => !prevOff); //falses
                      temp.current = {
                        ...like,
                        post: posting.id,
                        user: user.id,
                      };
                      setLike(temp.current);
                      console.log(checks);
                      const kondisi = checks.find(
                        (c) => c.id_post === posting.id && c.id_user === user.id
                      );
                      kondisi
                        ? api(`/like/${user.id}/${posting.id}`, "DELETE")
                        : api("/like", "POST", temp.current);

                      api("/like/check").then((e) => {
                        console.log(e);
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
                          : "text-black "
                      } w-8`}
                    />
                    {count.map((e, index) =>
                      e.id_post === posting.id && e.banyak !== 0 ? (
                        <span key={index}>{e.banyak}</span>
                      ) : null
                    )}
                  </button>

                  <button>
                    <FiShare2
                      onClick={() => {
                        setOpenRetweet(!openRetweet);
                        setDataComentar({
                          ...dataComentar,
                          retweet: posting.id,
                          content: posting.content,
                          user_retweet: user.id,
                          email: posting.email,
                          name: posting.full_name,
                        });
                      }}
                    />
                    {
                      countRedweed?.find(
                        (e) => e.id_retweet === posting.id && e
                      ).count
                    }
                  </button>
                  <button
                    className="flex items-center w-8 justify-between"
                    onClick={() => {
                      setDataComentar({
                        ...dataComentar,
                        id_post: posting.id,
                        content: posting.content,
                        user: user.id,
                        email: posting.email,
                        name: posting.full_name,
                      });
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
              </>
            ))
          ) : (
            <p>No postings available.</p>
          )}
        </main>
      </>
    );
  } else {
    return <Navigate to="/login" />;
  }
}
