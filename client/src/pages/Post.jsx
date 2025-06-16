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
        <Postingan />
        <div className="w-full  hidden">
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
