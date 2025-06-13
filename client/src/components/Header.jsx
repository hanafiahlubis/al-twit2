import { NavLink } from "react-router-dom";
import { pages } from "../main";
import { AiOutlineMenuUnfold, AiFillCloseCircle } from "react-icons/ai";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../utils.js";
import { AllStateContext, DataContext } from "../App";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import RetweetModal from "../components/RetweetModal"; // Import the RetweetModal

export default function Header() {
  const setUser = useOutletContext()[1];
  const { setPostings } = useContext(DataContext);
  const {
    openComentar,
    setOpenComentar,
    dataComentar,
    setDataComentar,
    setCountComentar,
    openRetweet,
    setOpenRetweet,
    dataRetweet,
    setDataRetweet,
  } = useContext(AllStateContext);

  const [openMenu, setOpenMenu] = useState(false);
  const [openAdd, setOpenAdd] = useState(true);
  const [addPos, setAddPost] = useState({});
  const user = useOutletContext()[0];

  const handleRetweetSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/retweed", dataRetweet);
      const updatedPostings = await api.get("/posting");
      setPostings(updatedPostings.data);
      setDataRetweet({});
      setOpenRetweet(false);
    } catch (error) {
      console.error("Error in retweeting:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/comentar", dataComentar);
      setCountComentar(await api.get("/comentar"));
      setDataComentar({});
      setOpenComentar(false);
    } catch (error) {
      console.error("Error in commenting:", error);
    }
  };

  const handleLogout = async () => {
    const check = confirm(`Apakah Anda Yakin ingin Keluar ${user.full_name}?`);
    if (check) {
      const response = await api.post("/login/logout");
      console.log("Berhasil Me Navigate");
      alert(response);
      setUser();
    }
  };

  return user ? (
    <>
      {openComentar && (
        <div className="block w-screen sm:w-full fixed h-screen left-0 top-0 z-50 overflow-y-hidden">
          <form
            className="absolute bg-white flex flex-col gap-4 p-8 rounded-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-[512px] shadow-xl shadow-black"
            onSubmit={handleCommentSubmit}
          >
            <span className="flex items-center w-full gap-2 ">
              <h3 className="text-2xl font-bold">{dataComentar.name}</h3>
              <p className="text-sm">{dataComentar.email}</p>
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
              onChange={(e) => setDataComentar({ ...dataComentar, commentar: e.target.value })}
            ></textarea>
            <button>SUBMIT</button>
            <button type="button" onClick={() => setOpenComentar(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {openMenu && (
        <nav className="flex md:hidden gap-8 flex-col text-center fixed top-[14px] p-6 left-1 rounded-md bg-cyan-700">
          <button className="absolute top-1 right-[10px] text-white" onClick={() => setOpenMenu(false)}>
            <AiFillCloseCircle size={20} />
          </button>
          {pages[3].children.map((page, i) => (
            <NavLink key={i} to={page.path}>
              {page.title}
            </NavLink>
          ))}
        </nav>
      )}

      {!openAdd && (
        <div className="block w-screen sm:w-full fixed h-screen left-0 top-0 z-50 overflow-y-hidden">
          <form
            className="absolute bg-white flex flex-col gap-4 p-8 rounded-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-[512px] shadow-xl shadow-black"
            onSubmit={async (e) => {
              e.preventDefault();
              const data = new FormData();
              data.append("file", addPos.media);
              data.append("content", addPos.content);
              data.append("user", user.id);
              const token = localStorage.getItem("token");
              await fetch(`http://localhost:3000/api/posting/add`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: data,
              });
              api.get("/posting").then((data) => {
                setPostings(data.data);
              });
              setOpenAdd(!openAdd);
            }}
          >
            <h3>Posting</h3>
            <label>
              Content
              <input
                type="text"
                onChange={(e) => setAddPost({ ...addPos, content: e.target.value })}
              />
            </label>
            <label>
              Media
              <input
                type="file"
                onChange={(e) => setAddPost({ ...addPos, media: e.target.files[0] })}
              />
            </label>
            <div>
              <button>SUBMIT</button>
              <button type="button" onClick={() => setOpenAdd(!openAdd)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <header className="md:border-r-2 p-3 border-black sticky w-full md:w-1/5 bg-gray-500 text-white flex md:h-screen flex-col justify-evenly">
        <div className="w-full h-screen flex-col justify-evenly hidden md:flex">
          <h1 className="text-center text-3xl">Al-Twit</h1>
          <nav className="flex gap-8 flex-col text-center">
            {pages[3].children.map((page, i) => {
              if (page.title === "PROFIL") {
                return (
                  <NavLink key={i} to={`/profil/${user.id}`}>
                    {page.title}
                  </NavLink>
                );
              } else if (page.title === "POST") {
                return;
              } else {
                return (
                  <NavLink key={i} to={page.path}>
                    {page.title}
                  </NavLink>
                );
              }
            })}
          </nav>
          <button onClick={() => setOpenAdd(!openAdd)}>POST</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div className="flex justify-center items-center md:hidden ">
          <h1 className="text-center text-3xl">Al-Twit</h1>
          <button className="absolute left-3" onClick={() => setOpenMenu(!openMenu)}>
            <AiOutlineMenuUnfold />
          </button>
        </div>
      </header>

      {/* Here we render the RetweetModal */}
      <RetweetModal />
    </>
  ) : (
    <Navigate to="/login" />
  );
}
