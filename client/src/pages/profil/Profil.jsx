import { useEffect, useState, useContext } from "react";
import { useOutletContext, useParams, Navigate } from "react-router-dom";
import { BsCalendarDate } from "react-icons/bs";
import { AllStateContext, DataContext } from "../../App";
import Postingan from "../../components/Postingan.jsx";
import Header from "../../components/Header";
import { api } from "../../utils.js";
import Loader from "../../components/Loader.jsx";

export default function Profil() {
  const id = useParams("id");
  const [data, setData] = useState([]);
  const user = useOutletContext()[0];
  const [openPost, setOpenPost] = useState(true);
  const [openLike, setOpenLike] = useState(false);
  const [loading, setLoading] = useState(false);

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

        <main className="flex overflow-y-auto p-8 gap-4 flex-col w-[80%]">
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
                <span className="font-bold">{data?.following || 0}</span> Following
              </h1>
              <h1>
                <span className="font-bold">{data?.followers || 0}</span> followers
              </h1>
            </div>
          </div>

          <div className="flex justify-center gap-8 border-b-green-600">
            <button
              className={`pb-2 px-4 text-sm font-medium transition
                ${openPost ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-500 hover:text-green-600/80"}`}
              onClick={async () => {
                if (openPost) return;
                setOpenPost(true);
                setOpenLike(false);
                setLoading(true);

                try {
                  const res = await api.get(`/posting/${id.id}`);
                  setPostings(res.data);
                  setCountComentar(res.comentar);
                  setCount(res.like);
                  setChecks(res.check);
                } finally {
                  setLoading(false);
                }
              }}
            >
              Posts
            </button>

            <button
              className={`pb-2 px-4 text-sm font-medium transition
                ${openLike ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-500 hover:text-green-600/80"}`}
              onClick={async () => {
                if (openLike) return;
                setOpenLike(true);
                setOpenPost(false);
                setLoading(true);
                try {
                  const data = await api.get(`/posting/${user.id}/${id.id}`);
                  const dataLike = await api.get("/like");
                  
                  setPostings(data.data);
                  setCountComentar(data.comentar);
                  setCount(dataLike);
                  setChecks(data.check);
                  setDataFollower(data.follower);

                } finally {
                  setLoading(false);
                }
              }}
            >
              Likes
            </button>
          </div>


          {openPost && (
            loading ? (
              <Loader />
            ) : postings.length ? (
              <Postingan />
            ) : (
              <p className="text-center text-sm text-gray-500 mt-8">
                No posts yet.
              </p>
            )
          )}

          {openLike && (
            loading ? (
              <Loader />
            ) : postings.length ? (
              <Postingan />
            ) : (
              <p className="text-center text-sm text-gray-500 mt-8">
                No liked posts yet.
              </p>
            )
          )}

        </main>
      </>
    );
  } else {
    return <Navigate to="/login" />;
  }
}
