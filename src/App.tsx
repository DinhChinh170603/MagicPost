import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ExchangePoints from "./pages/ExchangePoints";
import GatherPoints from "./pages/GatherPoints";
import NotFound from "./pages/NotFound";
import Sidebar from "./navs/Sidebar";
import Login from "./pages/Login";
import User from "./pages/User";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InviteUser from "./pages/InviteUser";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ConfigProvider } from "antd";
import Topbar from "./components/Topbar";
import { useEffect, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { Backdrop } from "@mui/material";
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inMobileMode, setInMobileMode] = useState(false);

  const { width } = useWindowSize();

  useEffect(() => {
    if (width === null) {
      return;
    }

    if (width < 768) {
      setIsSidebarOpen(false);
      setInMobileMode(true);
    }

    if (width >= 768) {
      setIsSidebarOpen(true);
      setInMobileMode(false);
    }
  }, [width]);

  const getPage = (children: React.ReactNode) => {
    return (
      <>
        {inMobileMode && (
          <Backdrop
            sx={{ color: "#fff", zIndex: 2 }}
            open={isSidebarOpen}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <div className="flex">
          <div className={`h-screen ${inMobileMode ? "absolute z-10" : ""}`}>
            <Sidebar isSidebarOpen={isSidebarOpen} />
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
