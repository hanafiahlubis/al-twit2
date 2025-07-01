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
import CommentModal from "./CommentModal.jsx";
import PostModal from "./PostModal.jsx";
import { Modal } from "antd"; // Import Ant Design's Modal for confirmation

export default function Header() {
  const setUser = useOutletContext()[1];
  const { setPostings } = useContext(DataContext);
  const {
    openComentar,
    setOpenComentar,
    dataComentar,
    setDataComentar,
    setCountComentar,
  } = useContext(AllStateContext);

  const [openMenu, setOpenMenu] = useState(false);
  const [openAdd, setOpenAdd] = useState(true);
  const [addPos, setAddPost] = useState({});
  const [logoutModalVisible, setLogoutModalVisible] = useState(false); // State to control logout confirmation modal
  const user = useOutletContext()[0];

  const handleCommentSubmit = async (e) => {
    try {

      await api.post("/comentar", dataComentar);
      setCountComentar(await api.get("/comentar"));
      setDataComentar(prevState => {
        const updatedState = { ...prevState, commentar: "" };
        return updatedState;
      });
      setOpenComentar(false);


    } catch (error) {
      console.error("Error in commenting:", error);
    }
  };

  const handlePostSubmit = async (formDataFromModal) => {
    console.log(user.id);
    
    formDataFromModal.append("user", user.id);
    const token = localStorage.getItem("token");

    const API_URL = import.meta.env.VITE_API_URL;
    await fetch(`${API_URL}/api/posting/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataFromModal,
    });
    api.get("/posting").then((data) => {
      setPostings(data.data);
    });
    setOpenAdd(!openAdd);
  };

  const handleLogout = () => {
    // Show the logout confirmation modal
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    const response = await api.post("/login/logout");
    console.log("Logout successful:", response);
    setUser(); // Clear user state on logout
    setLogoutModalVisible(false); // Close the logout confirmation modal
  };

  const cancelLogout = () => {
    setLogoutModalVisible(false); // Close the modal if the user cancels the action
  };

  return user ? (
    <>
      <header className="md:border-r-2 p-3 border-[#E4E4D0] sticky w-full md:w-1/5 bg-[#AEC3AE] text-white flex md:h-screen flex-col justify-evenly">
        <div className="w-full h-screen flex-col justify-evenly hidden md:flex">
          <h1 className="text-center text-3xl">Al-Twit</h1>
          <nav className="flex gap-8 flex-col text-center">
            {pages[3].children.map((page, i) => {
              if (page.title === "POST") {
                return;
              } else {
                return (
                  <NavLink key={i} to={page.title === "PROFIL" ? `/profil/${user.id}` : page.path}
                    style={({ isActive }) =>
                      isActive
                        ? {
                          backgroundColor: "#E4E4D0",
                          borderRadius: "8px",
                          padding: "6px 16px",
                          fontSize: "14px",
                          color: "#000"
                        } : {}
                    }
                  >
                    {page.title}
                  </NavLink>
                );
              }
            })}
          </nav>
          <button onClick={() => setOpenAdd(!openAdd)}>Post Now</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div className="flex justify-center items-center md:hidden ">
          <h1 className="text-center text-3xl">Al-Twit</h1>
          <button className="absolute left-3" onClick={() => setOpenMenu(!openMenu)}>
            <AiOutlineMenuUnfold />
          </button>
        </div>
      </header>

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


      <RetweetModal />

      <CommentModal
        visible={openComentar}
        onCancel={() => setOpenComentar(false)}
        onSubmit={handleCommentSubmit}
      />
      <PostModal
        visible={openAdd}
        onCancel={() => setOpenAdd(!false)}
        onSubmit={handlePostSubmit}
      />

      {/* Logout Confirmation Modal without animation */}
      <Modal
        title="Logout Confirmation"
        visible={logoutModalVisible}
        onOk={confirmLogout}
        onCancel={cancelLogout}
        okText="Yes, Logout"
        cancelText="Cancel"
        centered
        transitionName="" // Disable animation
        style={{
          borderRadius: "8px",
          position: "fixed",
          top: "1%",
          left: "50%",
          transform: "translateX(-50%)"
        }}
        okButtonProps={{
          style: {
            backgroundColor: "#52c41a", borderRadius: "8px",

            padding: "6px 16px",
            fontSize: "14px",

          }
        }}
        cancelButtonProps={{
          style: {
            borderRadius: "8px",
            borderColor: "#d9d9d9",
            color: "#fff",
            padding: "6px 16px",
            fontSize: "14px",
            backgroundColor: "#f44336"
          }
        }}
      >
        <p>Are you sure you want to log out?</p>
      </Modal >
    </>
  ) : (
    <Navigate to="/login" />
  );
}
