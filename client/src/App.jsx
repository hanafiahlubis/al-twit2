import { useEffect } from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { api } from "./utils.js";
import { createContext } from "react";

export const DataContext = createContext();
export const AllStateContext = createContext();

export default function App() {
  // const [user, setUser] = useState({});
  const [openComentar, setOpenComentar] = useState(false);
  const [dataComentar, setDataComentar] = useState({});
  const [countComentar, setCountComentar] = useState([]);

  const [dataRetweet, setDataRetweet] = useState({});
  const [openRetweet, setOpenRetweet] = useState(false);
  const [follower, setFollower] = useState({});
  const [like, setLike] = useState({});

  const [dataFollower, setDataFollower] = useState([]);
  const [checks, setChecks] = useState([]);
  const [count, setCount] = useState([]);

  const [countentComentar, setCountentComentar] = useState([]);
  const [allFollower, setAllFollower] = useState([]);
  const [loading, setLoading] = useState(true);
  // cosn
  const [user, setUser] = useState();
  const [postings, setPostings] = useState([]);
  useEffect(() => {
    api
      .get("/login/me")
      .then((me) => {
        if (!me) {
          console.log("sbbbsss");

          setUser(null);
        } else {
          setUser(me);
          setLike({ user: me.id });
          // setPostings({ ...postings, user: me.id });
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [user?.id]);
  return (
    <AllStateContext.Provider
      value={{
        openComentar,
        setOpenComentar,
        openRetweet,
        setOpenRetweet,
        dataRetweet,
        setDataRetweet,
        dataComentar,
        setDataComentar,
        countComentar,
        setCountComentar,
        like,
        setLike,
        dataFollower,
        setDataFollower,
        checks,
        setChecks,
        count,
        setCount,
        allFollower,
        setAllFollower,
        setFollower,
        follower,
      }}
    >
      <DataContext.Provider value={{ postings, setPostings }}>
        {loading ? <h1>Loading</h1> : <Outlet context={[user, setUser]} />}
      </DataContext.Provider>
    </AllStateContext.Provider>
  );
}
