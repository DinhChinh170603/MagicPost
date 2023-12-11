import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const Sidebar = (props: any) => {
  const activeStyle =
    "w-[80%] rounded-lg bg-orange-400 p-3 text-center text-xl font-bold transition-all duration-100";
  const inactiveStyle =
    "w-[80%] rounded-lg p-3 text-center text-xl font-bold transition-all duration-100 hover:bg-orange-200";

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

  return (
    <div className="flex h-full w-64 flex-col items-center gap-3 overflow-y-auto border-r-2 border-slate-200 bg-gray-300 py-3">
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
        {renderNavigations(role)}
      </>
    </div>
  );
};

Sidebar.propTypes = {
  role: PropTypes.string,
};

export default Sidebar;
