import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const activeStyle =
    "w-[80%] rounded-lg bg-orange-400 p-3 text-center text-xl font-bold";
  const inactiveStyle =
    "w-[80%] rounded-lg p-3 text-center text-xl font-bold hover:bg-orange-200";

  return (
    <div className="flex h-full w-full flex-col items-center gap-3 py-3">
      <div>
        <h1 className="text-3xl font-bold">Magic Post</h1>
      </div>
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
      >
        Home
      </NavLink>
      <NavLink
        to="/posts"
        end
        className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
      >
        Posts
      </NavLink>
      <NavLink
        to="/posts/0"
        end
        className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
      >
        Post
      </NavLink>
      <NavLink
        to="/logout"
        end
        className="mt-auto w-[80%] rounded-lg bg-slate-800 p-3 text-center text-xl font-bold text-white"
      >
        Logout
      </NavLink>
    </div>
  );
};

export default Sidebar;
