import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex w-full h-full flex-col items-center justify-center">
      <div className="text-2xl font-bold">
        <Link to="/">Home</Link>
      </div>
      <div className="text-2xl font-bold">
        <Link to="/posts">Posts</Link>
      </div>
      <div className="text-2xl font-bold">
        <Link to="/posts/0">Post</Link>
      </div>
    </div>
  );
};

export default Navbar;
