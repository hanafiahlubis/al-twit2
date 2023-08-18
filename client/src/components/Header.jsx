import { NavLink } from "react-router-dom";
import { pages } from "../main";
import { AiOutlineMenuUnfold, AiFillCloseCircle } from "react-icons/ai";
import { useState } from "react";
export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <>
      <header className="md:border-r-2 p-3 border-black sticky  w-full  md:w-1/4 bg-gray-500 text-white flex md:h-screen flex-col justify-evenly  ">
        <div className="w-full h-screen flex-col justify-evenly hidden md:flex">
          <h1 className="text-center text-3xl">Al-Twit</h1>
          <nav className="flex gap-8 flex-col text-center">
            {pages[3].children.map((page, i) => (
              <NavLink key={i} to={page.path}>
                {page.title}
              </NavLink>
            ))}
          </nav>
          <button>POST</button>
        </div>
        <div className="flex justify-center items-center md:hidden ">
          <h1 className="text-center text-3xl">Al-Twit</h1>
          <button
            className="fixed left-3"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <AiOutlineMenuUnfold />
          </button>
        </div>
      </header>
      {openMenu && (
        <nav className="flex md:hidden gap-8 flex-col text-center fixed top-[14px] p-6 left-1 rounded-md bg-cyan-700">
          <button
            className="absolute top-1 right-[10px] text-white"
            onClick={() => setOpenMenu(false)}
          >
            <AiFillCloseCircle size={20} />
          </button>
          {pages[0].children.map((page, i) => (
            <NavLink key={i} to={page.path}>
              {page.title}
            </NavLink>
          ))}
        </nav>
      )}
    </>
  );
}
