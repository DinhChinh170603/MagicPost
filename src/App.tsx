import { Drawer } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMediaQuery, useWindowSize } from "@uidotdev/usehooks";
import { ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Topbar from "./components/Topbar";
import Sidebar from "./navs/Sidebar";
import ExchangePoints from "./pages/ExchangePoints";
import GatherPoints from "./pages/GatherPoints";
import Home from "./pages/Home";
import InviteUser from "./pages/InviteUser";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import User from "./pages/User";
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const inMobileMode = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (inMobileMode) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [inMobileMode]);

  const getPage = (children: React.ReactNode) => {
    return (
      <>
        {/* {inMobileMode && (
          <Backdrop
            sx={{ color: "#fff", zIndex: 2 }}
            open={isSidebarOpen}
            onClick={() => setIsSidebarOpen(false)}
          />
        )} */}
        <div className="flex">
          <div>
            {inMobileMode ? (
              <Drawer
                open={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                anchor="left"
              >
                <Sidebar />
              </Drawer>
            ) : (
              <Sidebar />
            )}
          </div>

          <div className="relative flex flex-1 flex-col">
            <div className="relative">
              <Topbar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isInMobileMode={inMobileMode}
              />
            </div>
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Roboto",
            colorPrimary: "#fa541c",
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <BrowserRouter>
            <Routes>
              <Route index element={getPage(<Home />)}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route
                path="/exchange-points"
                element={getPage(<ExchangePoints />)}
              ></Route>
              <Route
                path="/gather-points"
                element={getPage(<GatherPoints />)}
              ></Route>
              <Route path="/users/:id" element={getPage(<User />)}></Route>
              <Route path="/invite" element={getPage(<InviteUser />)}></Route>
              <Route path="*" element={getPage(<NotFound />)}></Route>
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </LocalizationProvider>
      </ConfigProvider>
    </>
  );
}

export default App;
