import { Drawer } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMediaQuery } from "@uidotdev/usehooks";
import { ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ExchangePointDetail from "./pages/ExchangePointDetail";
import ExchangePoints from "./pages/ExchangePoints";
import GatherPointDetail from "./pages/GatherPointDetail";
import GatherPoints from "./pages/GatherPoints";
import Home from "./pages/Home";
import InviteUser from "./pages/InviteUser";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PackageDetail from "./pages/PackageDetail";
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
        <div className="flex h-screen">
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

          <div className="relative flex flex-1 flex-col overflow-y-auto">
            <Topbar
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              isInMobileMode={inMobileMode}
            />
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
            fontSize: 16,
            controlItemBgHover: "rgba(147, 147, 147, 0.6)",
            colorBorder: "rgba(147, 147, 147, 0.4)",
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
              <Route
                path="/gather-points/:id"
                element={<GatherPointDetail />}
              ></Route>
              <Route
                path="/exchange-points/:id"
                element={<ExchangePointDetail />}
              ></Route>
              <Route path="/users/:id" element={getPage(<User />)}></Route>
              <Route path="/invite" element={getPage(<InviteUser />)}></Route>
              <Route
                path="/package/:id"
                element={getPage(<PackageDetail />)}
              ></Route>
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
