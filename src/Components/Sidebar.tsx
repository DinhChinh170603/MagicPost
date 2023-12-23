import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import simpleLogo from "./../assets/simpleLogo.png";
import gatherMana from "./../assets/GT_MN_logo.png";
import exchangeMana from "./../assets/EC_MN_logo.png";
import gatherEmp from "./../assets/GT_EM_logo.png";
import exchangeEmp from "./../assets/EC_EM_logo.png";
import leader from "./../assets/leader_logo.png";
import { FaHome, FaExchangeAlt } from "react-icons/fa";
import { IoPeople, IoPersonAddSharp } from "react-icons/io5";
import { PiPackageFill } from "react-icons/pi";
import { MdOutlineZoomInMap } from "react-icons/md";
import { TbTruckDelivery, TbPackageImport  } from "react-icons/tb";
import { LuPackagePlus } from "react-icons/lu";
import { IoMdTimer } from "react-icons/io";

const Sidebar = (props: any) => {
  const activeStyle =
    "w-[80%] rounded-lg bg-btnColor p-3 text-white text-left text-lg font-bold transition-all duration-100";
  const inactiveStyle =
    "w-[80%] rounded-lg p-3 text-left text-white text-lg transition-all duration-100 hover:bg-btnHover hover:text-black hover:font-bold";

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
              <span style={{ display: "flex", alignItems: "center" }}>
                <IoPeople size={20} style={{ marginRight: 10 }} />
                Managers
              </span>
            </NavLink>
            <NavLink
              to="/package-management"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <PiPackageFill size={20} style={{ marginRight: 10 }} />
                All packages
              </span>
            </NavLink>
            <NavLink
              to="/exchange-points"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <FaExchangeAlt size={20} style={{ marginRight: 10 }} />
                Exchange Points
              </span>
            </NavLink>
            <NavLink
              to="/gather-points"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <MdOutlineZoomInMap size={20} style={{ marginRight: 10 }} />
                Gather Points
              </span>
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
              <span style={{ display: "flex", alignItems: "center" }}>
                <LuPackagePlus size={20} style={{ marginRight: 10 }} />
                New Package
              </span>
            </NavLink>
            <NavLink
              to="/incoming-packages"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <TbPackageImport size={20} style={{ marginRight: 10 }} />
                Incoming Package
              </span>
            </NavLink>
            <NavLink
              to="/package-processing"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <IoMdTimer size={20} style={{ marginRight: 10 }} />
                Package Processing
              </span>
            </NavLink>
            <NavLink
              to="/package-management"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <PiPackageFill size={20} style={{ marginRight: 10 }} />
                Package History
              </span>
            </NavLink>
            <NavLink
              to="/delivery-status"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <TbTruckDelivery size={20} style={{ marginRight: 10 }} />
                Delivery Status
              </span>
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
              <span style={{ display: "flex", alignItems: "center" }}>
                <IoPeople size={20} style={{ marginRight: 10 }} />
                Employees
              </span>
            </NavLink>
            <NavLink
              to="/invite-employee"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <IoPersonAddSharp size={20} style={{ marginRight: 10 }} />
                Invite employee
              </span>
            </NavLink>
            <NavLink
              to="/package-management"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <PiPackageFill size={20} style={{ marginRight: 10 }} />
                Package History
              </span>
            </NavLink>
            <NavLink
              to="/delivery-status"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <TbTruckDelivery size={20} style={{ marginRight: 10 }} />
                Delivery Status
              </span>
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
              <span style={{ display: "flex", alignItems: "center" }}>
                <IoPeople size={20} style={{ marginRight: 10 }} />
                Employees
              </span>
            </NavLink>
            <NavLink
              to="/package-management"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <PiPackageFill size={20} style={{ marginRight: 10 }} />
                Package History
              </span>
            </NavLink>
            <NavLink
              to="/invite-employee"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <IoPersonAddSharp size={20} style={{ marginRight: 10 }} />
                Invite Employee
              </span>
            </NavLink>
          </>
        );

      case "GATHER_EMPLOYEE":
        return (
          <>
            <NavLink
              to="/incoming-packages"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <TbPackageImport size={20} style={{ marginRight: 10 }} />
                Incoming Package
              </span>
            </NavLink>
            <NavLink
              to="/package-processing"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <IoMdTimer size={20} style={{ marginRight: 10 }} />
                Package Processing
              </span>
            </NavLink>
            <NavLink
              to="/package-management"
              end
              className={({ isActive }) =>
                isActive ? activeStyle : inactiveStyle
              }
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <PiPackageFill size={20} style={{ marginRight: 10 }} />
                Package History
              </span>
            </NavLink>
          </>
        );

      default:
        return <></>;
    }
  };

  const renderIcon = (currentRole: string) => {
    const iconStyle = { width: 40, height: 40 };
    switch (currentRole) {
      case "LEADER":
        return <img src={leader} alt="Leader Icon" style={iconStyle} />;
      case "GATHER_MANAGER":
        return (
          <img src={gatherMana} alt="Gather Manager Icon" style={iconStyle} />
        );
      case "EXCHANGE_MANAGER":
        return (
          <img
            src={exchangeMana}
            alt="Exchange Manager Icon"
            style={iconStyle}
          />
        );
      case "GATHER_EMPLOYEE":
        return (
          <img src={gatherEmp} alt="Gather Employee Icon" style={iconStyle} />
        );
      case "EXCHANGE_EMPLOYEE":
        return (
          <img
            src={exchangeEmp}
            alt="Exchange Employee Icon"
            style={iconStyle}
          />
        );
      default:
        return <AccountCircleIcon sx={{ color: "black", fontSize: 45 }} />;
    }
  };

  return (
    <div className="flex h-full w-64 flex-col items-center gap-3 overflow-y-auto bg-slideBar">
      <>
        <div style={{ display: "flex", marginTop: 10, alignItems: "center" }}>
          <img src={simpleLogo} alt="Logo" className="h-10" />
          <h1 className="ml-2 font-bold text-white" style={{ fontSize: 28 }}>
            Magic Post
          </h1>
        </div>

        <hr style={{ width: "60%", marginBottom: 15 }} />

        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            <FaHome size={20} style={{ marginRight: 10 }} />
            Home
          </span>
        </NavLink>
        {renderNavigations(role)}

        <div
          className="w-[80%] rounded-lg bg-bgColor"
          style={{
            display: "flex",
            marginBottom: 30,
            padding: 10,
            alignItems: "center",
            marginTop: "auto",
          }}
        >
          {renderIcon(role)}
          <h1
            className="ml-2 mt-1 font-bold text-black"
            style={{ fontSize: role === "LEADER" ? 16 : 13 }}
          >
            {role}
          </h1>
        </div>
      </>
    </div>
  );
};

Sidebar.propTypes = {
  role: PropTypes.string,
};

export default Sidebar;
