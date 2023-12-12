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
import Managers from "./pages/Managers";
import ExchangePointDetail from "./pages/ExchangePointDetail";
import ExchangePoints from "./pages/ExchangePoints";
import GatherPointDetail from "./pages/GatherPointDetail";
import GatherPoints from "./pages/GatherPoints";
import Home from "./pages/Home";
import InviteUser from "./pages/InviteUser";
import InviteEmployee from "./pages/InviteEmployee";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import User from "./pages/User";
import NewPackage from "./pages/NewPackage";
import PackageProcessing from "./pages/PackageProcessing";
import IncomingPackage from "./pages/IncomingPackage";
import PackageManagement from "./pages/PackageManagement";
import DeliveryStatus from "./pages/DeliveryStatus";
import AuthContext from "./contexts/AuthContext";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const inMobileMode = useMediaQuery("(max-width: 768px)");

  const [user, setUser] = useState<any>(null);

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
        <div className="flex h-screen">
          {inMobileMode ? (
            <Drawer
              open={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              anchor="left"
            >
              <Sidebar role={user ? user.role : null} />
            </Drawer>
          ) : (
            <Sidebar role={user ? user.role : null} />
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
        <AuthContext.Provider value={{ user, setUser }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <BrowserRouter>
              <Routes>
                <Route index element={getPage(<Home />)}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/managers" element={getPage(<Managers role={user ? user.role : null} />)}></Route>
                <Route path="/exchange-points" element={getPage(<ExchangePoints />)}></Route>
                <Route path="/gather-points" element={getPage(<GatherPoints />)}></Route>
                <Route path="/gather-points/:id" element={getPage(<GatherPointDetail />)}></Route>
                <Route path="/exchange-points/:id" element={getPage(<ExchangePointDetail />)}></Route>
                <Route path="/new-package" element={getPage(<NewPackage />)}></Route>
                <Route path="/package-processing" element={getPage(<PackageProcessing role={user ? user.role : null}/>)}></Route>
                <Route path="/incoming-packages" element={getPage(<IncomingPackage role={user ? user.role : null}/>)}></Route>
                <Route path="/package-management" element={getPage(<PackageManagement role={user ? user.role : null}/>)}></Route>
                <Route path="/delivery-status" element={getPage(<DeliveryStatus />)}></Route>
                <Route path="/users/:id" element={getPage(<User />)}></Route>
                <Route path="/invite" element={getPage(<InviteUser />)}></Route>
                <Route path="/invite-employee" element={getPage(<InviteEmployee role={user ? user.role : null}/>)}></Route>
                <Route path="*" element={getPage(<NotFound />)}></Route>
              </Routes>
            </BrowserRouter>
            <ToastContainer />
          </LocalizationProvider>
        </AuthContext.Provider>
      </ConfigProvider>
    </>
  );
}

export default App;
