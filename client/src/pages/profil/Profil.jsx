import { useEffect, useState, useContext } from "react";
import { useOutletContext, useParams, Navigate } from "react-router-dom";
import { BsCalendarDate } from "react-icons/bs";
import { AllStateContext, DataContext } from "../../App";
import Postingan from "../../components/Postingan.jsx";
import Header from "../../components/Header";
import { api } from "../../utils.js";

export default function Profil() {
  const id = useParams("id");
  const [data, setData] = useState([]);
  const user = useOutletContext()[0];
  const [openPost, setOpenPost] = useState(true);
  const [openLike, setOpenLike] = useState(false);

  const { postings, setPostings } = useContext(DataContext);
  const {
    setCountComentar,
    setDataFollower,
    setChecks,
    setCount,
  } = useContext(AllStateContext);
  useEffect(() => {
    api.get(`/profil/${id.id}`).then((res) => {
      setData(res);
    });
    api.get(`/posting/${id.id}`).then((data) => {
      setPostings(data.data);
      setDataFollower(data.follower);
      setCountComentar(data.comentar);
      setCount(data.like);
      setChecks(data.check);
    });
  }, [id.id]);

  if (user) {
    return (
      <>
        <Header />

        <main className="flex overflow-y-auto w-full p-8 gap-4 flex-col w-[80%]">
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
                const data = await api.get(`/posting/${id.id}`);
                setPostings(data.data);
                setCountComentar(data.comentar);
                setCount(data.like);
                setChecks(data.check);
              }}
            >
              Posts
            </button>
            <button
              className={`${openLike ? "bg-slate-200 " : ""}`}
              onClick={async () => {
                const data = await api.get(`/posting/${user.id}/${id.id}`);
                setPostings(data.data);
                setCountComentar(data.comentar);
                setCount(data.like);
                setChecks(data.check);
                setDataFollower(data.follower);
                setOpenLike(!openLike);
                setOpenPost(false);
              }}
            >
              Likes
            </button>
          </div>

          {openPost && postings.length > 0 ? (
            <Postingan />
          ) : (
            <h1>{openPost && "xxxx"}</h1>
          )}

          {
            openLike && <Postingan />
          }
        </main>
      </>
    );
  } else {
    return <Navigate to="/login" />;
  }
}
