import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { IconButton } from "@mui/material";
import { Avatar, Dropdown, MenuProps } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import service from "../helpers/service";
import { toast } from "react-toastify";

export default function Topbar(props: any) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>();

  const logout = () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "/login";
  };

  useEffect(() => {
    service
      .get("/users/me")
      .then((res) => {
        if (res.data.status === 200) {
          setUser(res.data.results);
        } else {
          toast.error("Failed to fetch user data");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  const userMenuItems: MenuProps["items"] = [
    {
      key: "1",
      label: <span className="font-[430]">Profile</span>,
      onClick: () => {
        navigate("/users/" + user.id);
      },
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: <span className="font-[430]">Logout</span>,
      onClick: logout,
      danger: true,
    },
  ];

  const { isSidebarOpen, setIsSidebarOpen, isInMobileMode } = props;
  const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);

  return (
    <div className="absolute left-0 top-0 z-10 flex h-16 w-full items-center gap-8 bg-[rgba(255,255,255,0.5)] px-10">
      {isInMobileMode && (
        <div className="-ml-8">
          <IconButton
            aria-label="menu"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <MenuIcon sx={{ color: "black", fontSize: "1.8rem" }} />
          </IconButton>
        </div>
      )}
      <div className="relative ml-auto flex items-center gap-8">
        <NotificationsNoneIcon
          className="cursor-pointer"
          sx={{ color: "black", fontSize: "2rem" }}
        />
        <div className="relative">
          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={["click"]}
            placement="bottomRight"
            overlayStyle={{
              minWidth: "7rem",
              textAlign: "center",
            }}
          >
            <div onClick={() => setIsOpenUserMenu(!isOpenUserMenu)}>
              {user && user.avatar ? (
                <Avatar
                  src={user.avatar}
                  size={45}
                  className="cursor-pointer"
                />
              ) : (
                <AccountCircleIcon
                  className="cursor-pointer"
                  sx={{ color: "black", fontSize: 45 }}
                />
              )}
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

Topbar.propTypes = {
  isSidebarOpen: PropTypes.bool,
  setIsSidebarOpen: PropTypes.func,
  isInMobileMode: PropTypes.bool,
};
