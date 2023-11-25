import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { IcBaselineAccountCircle } from "../assets/icons/IcBaselineAccountCircle";
import service from "../helpers/service";
import { Button } from "@mui/material";
import { useWindowSize } from "@uidotdev/usehooks";

const Sidebar = () => {
  const activeStyle =
    "w-[80%] rounded-lg bg-orange-400 p-3 text-center text-xl font-bold";
  const inactiveStyle =
    "w-[80%] rounded-lg p-3 text-center text-xl font-bold hover:bg-orange-200";

  const [userFullname, setUserFullname] = useState();
  const [userRole, setUserRole] = useState();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { width } = useWindowSize();

  const logout = () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "/login";
  };

  useEffect(() => {
    service.get("/users/me").then((res) => {
      console.log(res.data.results.fullName);
      setUserFullname(res.data.results.fullName);
      setUserRole(res.data.results.role);
    });
  }, []);

  return (
    <div
      className={`flex h-full flex-col items-center gap-3 py-3 transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-0"
      }`}
    >
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
        to="/exchange-points"
        end
        className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
      >
        Exchange Points
      </NavLink>
      <NavLink
        to="/gather-points"
        end
        className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
      >
        Gather Points
      </NavLink>
      <NavLink
        to="/invite"
        end
        className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
      >
        Invite
      </NavLink>

      {width < 768 && (
        <Button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          Toggle Sidebar
        </Button>
      )}
      <div className="mt-auto flex w-full flex-col items-center gap-3">
        <div
          onClick={() => logout()}
          className="mt-auto w-[80%] cursor-pointer rounded-lg bg-slate-800 p-3 text-center text-xl font-bold text-white"
        >
          Logout
        </div>
        <NavLink to="/users/0" end className="flex w-[80%] items-center gap-3">
          <IcBaselineAccountCircle fontSize={60} />
          <span className="block w-full">
            <h1 className="text-lg font-bold">{userFullname}</h1>
            <p className="text-sm">{userRole}</p>
          </span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
