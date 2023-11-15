import React from "react";
import logo from "../assets/logo.jpg";
import service from "../helpers/service";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const login = () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    service
      .post("/authenticate", {
        email,
        password,
      })
      .then((res) => {
        setLoading(false);
        if (res.data.status === 200) {
          localStorage.setItem("jwtToken", res.data.results);
          window.location.href = "/";
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
        setLoading(false);
      });
  };

  return (
    <>
      {loading && <Loading />}
      <div className="flex h-screen w-full">
        <div className="flex flex-1 flex-col items-center justify-center bg-gray-300">
          <img src={logo} className="h-[50%] w-[50%]" alt="logo" />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <span className="text-3xl font-bold">Login</span>
          <input
            className="w-[40%] rounded-lg border border-solid border-gray-500 p-3"
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-[40%] rounded-lg border border-solid border-gray-500 p-3"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-[40%] rounded-lg bg-orange-400 p-3 text-center text-xl font-bold"
            onClick={() => login()}
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
}
