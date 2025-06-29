import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { createContext } from "react";
import { Alert, Spin } from 'antd';
import { api } from "./utils.js";

export const DataContext = createContext();
export const AllStateContext = createContext();

const contentStyle = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};
const content = <div style={contentStyle} />;

export default function App() {
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
  const [user, setUser] = useState();
  const [postings, setPostings] = useState([]);

  useEffect(() => {
    api
      .get("/login/me")
      .then((me) => {
        if (!me) {
          setUser(null);
        } else {
          setUser(me);
          setLike({ user: me.id });
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
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Spin tip="Loading..." size="large">
              {content}
            </Spin>
            <Alert
              message="Memuat Data"
              description="Konten sedang dimuat, harap bersabar."
              type="info"
              style={{ marginTop: 20 }}
            />
          </div>
        ) : (
          <Outlet context={[user, setUser]} />
        )} 
      </DataContext.Provider>
    </AllStateContext.Provider>
  );
}
