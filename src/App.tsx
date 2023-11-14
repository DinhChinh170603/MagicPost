import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import Post from "./pages/Post";
import NotFound from "./pages/NotFound";
import Sidebar from "./navs/Sidebar";
import Login from "./pages/Login";
function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <div className="flex-1 h-screen">
          <Sidebar />
        </div>
        <div className="flex-[5]">
          <Routes>
            <Route index element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/posts" element={<Posts />}></Route>
            <Route path="/posts/:id" element={<Post />}></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
