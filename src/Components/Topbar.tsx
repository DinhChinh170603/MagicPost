import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { IconButton } from "@mui/material";
import { Avatar, Dropdown, MenuProps } from "antd";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";
import service from "../helpers/service";
import AuthContext from "../contexts/AuthContext";

export default function Topbar(props: any) {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("jwtToken");
    window.location.href = "/login";
  };

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

  const userMenuItems: MenuProps["items"] = [
    {
      key: "1",
      label: <span className="font-[430]">Profile</span>,
      onClick: () => {
        navigate("/users/" + (user ? user.id : ""));
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
    <>
      {loading && <Loading hideBg={true} />}
      <div className="sticky top-0 z-10 flex w-full items-center gap-8 self-start border-b-2 border-slate-200 bg-[rgba(255,255,255,0.95)] px-10 py-2">
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
    </>
  );
}

Topbar.propTypes = {
  isSidebarOpen: PropTypes.bool,
  setIsSidebarOpen: PropTypes.func,
  isInMobileMode: PropTypes.bool,
};
