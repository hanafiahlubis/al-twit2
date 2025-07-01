import { useOutletContext } from "react-router-dom";
import { AllStateContext, DataContext } from "../App";
import React, { useState } from "react";
import { useRef } from "react";
import { AiFillLike } from "react-icons/ai";
import { TfiCommentsSmiley } from "react-icons/tfi";
import { FiShare2 } from "react-icons/fi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

import { api, checkz } from "../utils.js";
import { useNavigate } from "react-router-dom";
import ProfilBio from "../components/ProfilBio";
import Content from "../components/Content";
import RekomendasiFollower from "../components/RekomendasiFollower";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Modal } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

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
  const [likeLoadingIds, setLikeLoadingIds] = useState([])
  const [off, setOff] = useState(true);
  const [follower, setFollower] = useState({});
  const [visible, setVisible] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);

  const navigate = useNavigate();
  let temp = useRef();


  const showDeleteConfirm = (postId, content) => {
    setDeletePostId(postId);
    setVisible(true);
  };

  const handleDelete = async () => {
    await api.delete(`/posting/${deletePostId}`);
    console.log(`Posting ${deletePostId} berhasil dihapus`);
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  const handleNavigate = () => {
    navigate(`/`);
  };

  const isLoading = (postId) => likeLoadingIds.includes(postId);
  const iconBtn =
    "p-2 rounded-full transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand/50";

  return (
    <main
      className={`flex overflow-y-auto p-[1.5rem] gap-4   ${location.pathname === `/profil/${id.id}` ? "justify-center no-scrollbar w-full" : "w-4/5"}`}
    >
      <div className="flex flex-col gap-6 w-full max-w-[640px] mx-auto">
        {postings && postings.length > 0 ? (
          postings?.map((posting) => (
            <React.Fragment key={posting.id}>
              {location.pathname === `/post/${id.id}` && (
                <button className="flex items-center w-max " onClick={handleNavigate}>
                  <ArrowLeftOutlined style={{ fontSize: "20px", marginRight: "8px" }} />
                  Back
                </button>
              )}

              <div key={posting.id} className={`${posting.id_retweet ? "flex " : "block "} flex-col p-4 ${location.pathname === `/post/${id.id}` ? "pt-0" : ""} border-b`}>
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
                                follower.id_user === user?.id && follower.id_user_to === posting.id_user
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
                                  setTimeout(async () => await api.post("/follower", follower), 500);
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
                  className={`${posting.id_retweet && "p-[1.5rem] "} flex flex-col gap-4 `}
                >
                  <div className="flex w-full ">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profil/${posting.id_user}`);
                      }}
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
                      {posting.id_user !== user?.id && posting.user_redweet !== user.id
                        ? !posting.id_retweet && (
                          <>
                            {dataFollower.find(
                              (follower) =>
                                follower.id_user === user?.id && follower.id_user_to === posting.id_user
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
                                  await api.post("/follower", follower);
                                }}
                              >
                                Follower
                              </button>
                            )}
                          </>
                        )
                        : !posting.id_retweet && (
                          <div className="flex items-center gap-1 text-gray-500">

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/post/${posting.id}`);
                              }}
                              className={`${iconBtn} text-green-600 hover:bg-green-600/10 hover:text-green-700`}
                              title="Edit posting"
                            >
                              {/* <FaRegEdit size={18} /> */}
                              <FiEdit2 size={18} />
                            </button>


                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                showDeleteConfirm(posting.id, posting.content);
                              }}
                              className={`${iconBtn} text-red-500 hover:bg-red-500/10 hover:text-red-600`}
                              title="Hapus posting"
                            >
                              {/* <AiTwotoneDelete size={18} /> */}
                              <FiTrash2 size={18} />
                            </button>


                          </div>
                        )}
                    </div>
                  </div>
                  <Content isi={{ isi: posting.content }} />
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-lg">
                    <img
                      src={posting.mediaUrl}
                      alt="Media posting"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <hr className="border border-black" />
                </button>
                <div className="flex justify-between items-center mt-4 text-gray-500">
                  {/* Like Button */}
                  <button
                    disabled={isLoading(posting.id)}
                    className="flex items-center gap-1 hover:text-green-600 transition "
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (isLoading(posting.id)) return;

                      setLikeLoadingIds((prev) => [...prev, posting.id]);

                      const alreadyLiked = checks.some(
                        (c) => c.id_post === posting.id && c.id_user === user?.id
                      );

                      try {
                        if (alreadyLiked) {
                          await api.delete(`/like/${user.id}/${posting.id}`);
                        } else {
                          await api.post("/like", { post: posting.id, user: user.id });
                        }

                        const [checkRes, countRes] = await Promise.all([
                          api.get("/like/check"),
                          api.get("/like"),
                        ]);
                        setChecks(checkRes);
                        setCount(countRes);
                      } catch (err) {
                        console.error("Error like:", err);
                      } finally {
                        // lepas loading
                        setLikeLoadingIds((prev) => prev.filter((p) => p !== posting.id));
                      }
                    }}
                  >
                    <AiFillLike
                      size={20}
                      className={`${checkz(checks, posting.id, user?.id) ? "text-[#53c71a] " : "text-black "
                        } w-8`}
                    />
                    {count.map((e, index) =>
                      e.id_post === posting.id && e.banyak !== 0 ? (
                        <span key={index}>{e.banyak}</span>
                      ) : null
                    )}
                  </button>

                  {/* Retweet Button */}
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

                  {/* Comment Button */}
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
              </div >
            </ React.Fragment>

          ))
        ) : (
          <p className="text-center text-sm text-gray-500" >You haven’t liked any posts yet.</p>
        )
        }
      </div >
      {location.pathname !== `/profil/${id.id}` && <RekomendasiFollower />}

      < Modal
        title="Konfirmasi Penghapusan"
        visible={visible}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Hapus"
        cancelText="Batal"
      >
        <p>Apakah Anda yakin ingin menghapus postingan ini?</p>
      </Modal >
    </main >
  );
}
