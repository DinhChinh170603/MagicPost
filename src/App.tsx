import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import Post from "./pages/Post";
import NotFound from "./pages/NotFound";
import Sidebar from "./navs/Sidebar";
import Login from "./pages/Login";
function App() {
  const getPage = (children: React.ReactNode) => {
    return (
      <div className="flex">
        <div className="h-screen flex-1">
          <Sidebar />
        </div>
        <div className="flex-[5]">{children}</div>
      </div>
    );
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={getPage(<Home />)}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/posts" element={getPage(<Posts />)}></Route>
        <Route path="/posts/:id" element={getPage(<Post />)}></Route>
        <Route path="*" element={getPage(<NotFound />)}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
