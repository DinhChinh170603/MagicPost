import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import service from "../helpers/service";

const Sidebar = () => {
  const activeStyle =
    "w-[80%] rounded-lg bg-orange-400 p-3 text-center text-xl font-bold";
  const inactiveStyle =
    "w-[80%] rounded-lg p-3 text-center text-xl font-bold hover:bg-orange-200";

  const logout = () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "/login";
  };

  useEffect(() => {
    service.get("/users/me").then((res) => {
      console.log(res.data.results.fullName);
    });
  }, []);

  return (
    <div className="flex h-full w-64 flex-col items-center gap-3 overflow-y-auto bg-white py-3">
      <>
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

        <div className="mt-auto flex w-full flex-col items-center gap-3">
          <div
            onClick={() => logout()}
            className="mt-auto w-[80%] cursor-pointer rounded-lg bg-slate-800 p-3 text-center text-xl font-bold text-white"
          >
            Logout
          </div>
        </div>
      </>
    </div>
  );
};

export default Sidebar;
