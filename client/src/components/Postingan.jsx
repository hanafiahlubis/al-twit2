import { useOutletContext } from "react-router-dom";
import { AllStateContext, DataContext } from "../App";
import { useState } from "react";
import { useRef } from "react";
import { AiFillLike } from "react-icons/ai";
import { TfiCommentsSmiley } from "react-icons/tfi";
import { FiShare2 } from "react-icons/fi";
import { api, checkz } from "../utils.js";
import { useNavigate } from "react-router-dom";
import ProfilBio from "../components/ProfilBio";
import Content from "../components/Content";
import RekomendasiFollower from "../components/RekomendasiFollower";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function Postingan() {
  const location = useLocation();
  const id = useParams("id");
  const { postings } = useContext(DataContext);
  const user = useOutletContext()[0];
  const {
    openComentar,
    setOpenComentar,
    dataComentar,
    setDataComentar,
    countComentar,
    like,
    setLike,
    openRetweet,
    setOpenRetweet,
    dataRetweet,
    setDataRetweet,
    dataFollower,
    checks,
    setChecks,
    count,
    setCount,
  } = useContext(AllStateContext);

  const [off, setOff] = useState(true);
  const [follower, setFollower] = useState({});

  const navigate = useNavigate();
  let temp = useRef();
  return (
    <main
      className={`flex overflow-y-auto p-[1.5rem] gap-4  w-4/5 ${
        location.pathname === `/profil/${id.id}` && "justify-center "
      }  `}
    >
      <div className={`flex  w-[70%] gap-4 flex-col border-[1px] h-max   `}>
        {postings && postings.length > 0 ? (
          postings?.map((posting) => (
            <>
              <div
                key={posting.id}
                className={`${
                  posting.id_retweet ? "flex " : "block "
                } flex-col  p-4 border-b`}
              >
                {posting.id_retweet && (
                  <>
                    <div className="flex w-full justify-between">
                      <ProfilBio
                        profil={{
                          full_name: posting.retweeter_full_name,
                          email: posting.retweet_email,
                        }}
                      />
                      <div>
                        {posting.user_redweet !== user?.id && (
                          <>
                            {dataFollower.find(
                              (follower) =>
                                follower.id_user === user?.id &&
                                follower.id_user_to === posting.id_user
                            ) ? (
                              <button
                                onClick={async () => {
                                  setFollower({
                                    ...follower,
                                    me: user?.id,
                                    to: posting.user_redweet,
                                  });

                                  await api.delete("/follower", follower);
                                }}
                              >
                                UnFollower
                              </button>
                            ) : (
                              <button
                                onClick={async () => {
                                  setFollower({
                                    ...follower,
                                    me: user?.id,
                                    to: posting.user_redweet,
                                  });
                                  console.log(follower);
                                  setTimeout(
                                    async () =>
                                      await api.post("/follower", follower),
                                    500
                                  );
                                }}
                              >
                                Follower
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <Content isi={{ isi: posting.isi }} />
                  </>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/post/${posting.id}`);
                  }}
                  className={`${
                    posting.id_retweet && "p-[1.5rem] "
                  } flex flex-col gap-4 `}
                >
                  <div className="flex w-full ">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profil/${posting.id_user}`);
                      }}
                      //   to={`/profil/${posting.id_user}`}
                      className="flex items-center w-full gap-4 "
                    >
                      <ProfilBio
                        profil={{
                          full_name: posting.full_name,
                          email: posting.email,
                        }}
                      />
                    </button>
                    <div>
                      {posting.id_user !== user?.id && !posting.id_retweet && (
                        <>
                          {dataFollower.find(
                            (follower) =>
                              follower.id_user === user?.id &&
                              follower.id_user_to === posting.id_user
                          ) ? (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                setFollower({
                                  ...follower,
                                  me: user?.id,
                                  to: posting.id_user,
                                });

                                await api.delete("/follower", follower);
                              }}
                            >
                              UnFollower
                            </button>
                          ) : (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                setFollower({
                                  ...follower,
                                  me: user?.id,
                                  to: posting.id_user,
                                });
                                console.log(follower);
                                await api.post("/follower", follower);
                              }}
                            >
                              Follower
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <Content isi={{ isi: posting.content }} />
                  <img
                    className="m-auto"
                    src={`${posting.mediaUrl}`}
                    alt="Posting Error"
                  />
                  <hr className="border border-black" />
                </button>
                <div className="flex justify-evenly items-center w-full relative">
                  <button
                    disabled={!off}
                    className="flex items-center w-[3.5rem] justify-around "
                    onClick={() => {
                      setOff((prevOff) => !prevOff);
                      temp.current = {
                        ...like,
                        post: posting.id,
                        user: user?.id,
                      };
                      setLike(temp.current);
                      console.log(checks);
                      const kondisi = checks.find(
                        (c) =>
                          c.id_post === posting.id && c.id_user === user?.id
                      );
                      kondisi
                        ? api.delete(`/like/${user?.id}/${posting.id}`)
                        : api.post("/like", temp.current);

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
                        checkz(checks, posting.id, user?.id)
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

                  <button className="flex items-center gap-4">
                    <FiShare2
                      onClick={() => {
                        setDataRetweet({
                          ...dataRetweet,
                          ...posting,
                          user: user?.id,
                        });
                        setOpenRetweet(!openRetweet);
                      }}
                    />
                    {posting.retweets_count > 0 ? posting.retweets_count : ""}
                  </button>
                  <button
                    className="flex items-center w-8 justify-between"
                    onClick={() => {
                      setDataComentar({
                        ...dataComentar,
                        id_post: posting.id,
                        content: posting.content,
                        user: user?.id,
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
              </div>
            </>
          ))
        ) : (
          <p>No postings available.</p>
        )}
      </div>
      {location.pathname !== `/profil/${id.id}` && <RekomendasiFollower />}
    </main>
  );
}
