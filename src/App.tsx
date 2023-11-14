import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import Post from "./pages/Post";
import NotFound from "./pages/NotFound";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />}></Route>
        <Route path="/posts" element={<Posts />}></Route>
        <Route path="/posts/:id" element={<Post />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
