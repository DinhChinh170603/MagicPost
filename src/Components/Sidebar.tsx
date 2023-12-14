import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import service from "../helpers/service";
import AuthContext from "../contexts/AuthContext";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Avatar } from "antd";
import simpleLogo from "./../assets/simpleLogo.png";


const Sidebar = (props: any) => {
  const activeStyle =
    "w-[80%] rounded-lg bg-btnColor p-3 text-white text-center text-xl font-bold transition-all duration-100";
  const inactiveStyle =
    "w-[80%] rounded-lg p-3 text-center text-white text-xl transition-all duration-100 hover:bg-btnHover hover:text-black hover:font-bold";

  const { role } = props;

  const renderNavigations = (currentRole: string) => {
    switch (currentRole) {
      case "LEADER":
        return (
          <>
            <NavLink
              to="/managers"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              Managers
            </NavLink>
            <NavLink
              to="/package-management"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              All Package
            </NavLink>
            <NavLink
              to="/exchange-points"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              Exchange Points
            </NavLink>
            <NavLink
              to="/gather-points"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              Gather Points
            </NavLink>
            <NavLink
              to="/invite"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              Invite
            </NavLink>
          </>
        );
      case "EXCHANGE_EMPLOYEE":
        return (
          <>
            <NavLink
              to="/new-package"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              New Package
            </NavLink>
            <NavLink
              to="/package-management"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              Package Management
            </NavLink>
            <NavLink
              to="/package-processing"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              Package Processing
            </NavLink>
            <NavLink
              to="/incoming-packages"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              Incoming Package
            </NavLink>
            <NavLink
              to="/delivery-status"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              Delivery Status
            </NavLink>
          </>
        );

      case "EXCHANGE_MANAGER":
        return (
          <>
            <NavLink
              to="/managers"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              Employees
            </NavLink>
            <NavLink
              to="/package-management"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              Package Management
            </NavLink>
            <NavLink
              to="/invite-employee"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              Invite Employee
            </NavLink>
          </>
        );

      case "GATHER_MANAGER":
        return (
          <>
            <NavLink
              to="/managers"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              Employees
            </NavLink>
            <NavLink
              to="/package-management"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              Package Management
            </NavLink>
            <NavLink
              to="/invite-employee"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              Invite Employee
            </NavLink>
          </>
        );

      case "GATHER_EMPLOYEE":
        return (
          <>
            <NavLink
              to="/package-management"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              Package Management
            </NavLink>
            <NavLink
              to="/package-processing"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              Package Processing
            </NavLink>
            <NavLink
              to="/incoming-packages"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              Incoming Package
            </NavLink>
          </>
        )

      default:
        return <></>;
    }
  };

  const { user, setUser } = useContext<any>(AuthContext);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!user) {
      setLoading(true);
      service
        .get("/users/me")
        .then((res) => {
          if (res.data.status === 200) {
            setUser(res.data.results);
          } else {
            toast.error("Failed to fetch user data");
          }
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="flex h-full w-64 flex-col items-center gap-3 overflow-y-auto border-r-2 border-slate-200 bg-slideBar">
      <>
        <div style={{display: "flex", marginTop: 15, marginBottom: 30}}>
          <img src={simpleLogo} alt="Logo" className="h-10"/>
          <h1 className="text-3xl font-bold text-white ml-2 mt-1">Magic Post</h1>
        </div>
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
        >
          Home
        </NavLink>
        {renderNavigations(role)}

        <div className="w-[80%] rounded-lg bg-bgColor" style={{ display: "flex", marginTop: 15, marginBottom: 30, padding: 5, alignItems: "center", marginTop: "auto"}}>
          {user && user.avatar ? (
              <Avatar
                src={user.avatar}
                size={45}
              />
            ) : (
              <AccountCircleIcon
                sx={{ color: "black", fontSize: 45 }}
              />
            )}
          <h1 className="font-bold text-black ml-1 mt-1" style={{fontSize: (role === "LEADER") ? 16 : 13}}>{role}</h1>
        </div>

      </>
    </div>
  );
};

Sidebar.propTypes = {
  role: PropTypes.string,
};

export default Sidebar;
