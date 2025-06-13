import { useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import Header from "../components/Header";
import { AllStateContext, DataContext } from "../App";
import { api } from "../utils.js";
import Postingan from "../components/Postingan";

// import Protected from "../components/Protected";
// // import { NavLink } from "react-router-dom";

// import { Navigate } from "react-router-dom";
// import { useOutletContext } from "react-router-dom";

export default function Home() {
  const user = useOutletContext()[0];
  const { setPostings } = useContext(DataContext);
  const {
    setCountComentar,
    setDataFollower,
    setChecks,
    setCount,
    setAllFollower,
  } = useContext(AllStateContext);

  // const [dataFollower, setDataFollower] = useState([]);
  // const [checks, setChecks] = useState([]);
  // const [count, setCount] = useState([]);

  // const [checks, setChecks] = useState([]);
  // const [count, setCount] = useState([]);

  useEffect(() => {
    api.get("/posting").then((data) => {
      setPostings(data.data);
      setDataFollower(data.follower);
      console.log(data.follower);
    });
    api.get("/like/check").then((e) => {
      setChecks(e);
    });
    api.get("/like/").then((e) => {
      setCount(e);
    });
    api.get("/comentar").then((e) => {
      setCountComentar(e);
    });
    if (user) {
      api.get(`/follower/${user.id}`).then((follower) => {
        setAllFollower(follower);
      });
    }
  }, [
    setAllFollower,
    setChecks,
    setCount,
    setCountComentar,
    setDataFollower,
    setPostings,
    user,
  ]);

  if (user) {
    return (
      <>
        <Header />
        <Postingan />
      </>

    );
  } else {
    return <Navigate to="/login" />;
  }
}
