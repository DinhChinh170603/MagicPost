import React from "react";
import { toast } from "react-toastify";
import logo from "../assets/logo.jpg";
import Loading from "../helpers/Loading";
import service from "../helpers/service";
import {
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

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
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
        setLoading(false);
      });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      login();
    }
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
          <TextField
            className="w-[40%]"
            type="text"
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <TextField
            className="w-[40%]"
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={onKeyDown}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            label="Password"
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
