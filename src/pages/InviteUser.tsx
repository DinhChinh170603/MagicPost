import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";
import service from "../helpers/service";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";

export default function InviteUser() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);

  const [exchangePointsList, setExchangePointsList] = useState([]);
  const [noManagerExchangePointsList, setNoManagerExchangePointsList] =
    useState([]);
  const [gatherPointsList, setGatherPointsList] = useState([]);
  const [noManagerGatherPointsList, setNoManagerGatherPointsList] = useState(
    [],
  );

  const [emailError, setEmailError] = useState(false);
  const [fullNameError, setFullNameError] = useState(false);
  const [roleError, setRoleError] = useState(false);

  const [roleDepartmentList, setRoleDepartmentList] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .all([
        service.get("/leader/exchange-points"),
        service.get("/leader/gather-points"),
      ])
      .then(
        axios.spread((res1, res2) => {
          setExchangePointsList(res1.data.results);
          setGatherPointsList(res2.data.results);
          setNoManagerExchangePointsList(
            res1.data.results.filter(
              (exchangePoint) => exchangePoint.manager === null,
            ),
          );
          setNoManagerGatherPointsList(
            res2.data.results.filter(
              (gatherPoint) => gatherPoint.manager === null,
            ),
          );
          setLoading(false);
        }),
        () => {
          setLoading(false);
          toast.error("Something went wrong");
        },
      )
      .catch((err) => {
        setLoading(false);
        toast.error(err.response.data.message);
      });
  }, []);

  const handleRoleSelection = (value: string) => {
    setRole(value);
    switch (value) {
      case "GATHER_MANAGER":
        setRoleDepartmentList(noManagerGatherPointsList);
        console.log("noManagerGatherPointsList", noManagerGatherPointsList);
        break;
      case "EXCHANGE_MANAGER":
        setRoleDepartmentList(noManagerExchangePointsList);
        console.log("noManagerExchangePointsList", noManagerExchangePointsList);
        break;
      case "GATHER_EMPLOYEE":
        setRoleDepartmentList(gatherPointsList);
        console.log("gatherPointsList", gatherPointsList);
        break;
      case "EXCHANGE_EMPLOYEE":
        setRoleDepartmentList(exchangePointsList);
        console.log("exchangePointsList", exchangePointsList);
        break;
      default:
        break;
    }
  };

  const onFinish = () => {
    if (!email || !role || !fullName || !dob) {
      toast.error("Please fill out every fields");
      return;
    }
    if (emailError || fullNameError || roleError) {
      toast.error("Please check your input");
      return;
    }
    const formData = new FormData();
    formData.append("email", email);
    formData.append("role", role);
    formData.append("fullName", fullName);
    formData.append("departmentId", departmentId);
    formData.append("dob", dob);

    setLoading(true);

    service
      .post("/leader/invite", formData)
      .then((res) => {
        setLoading(false);
        if (res.data.status === 201) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response.data.message);
      });
  };

  return (
    <>
      {loading && <Loading />}
      <div className="flex h-screen w-full flex-col bg-orange-100 p-5">
        <div className="text-3xl font-bold">Invite User</div>
        <div className="w-[60%] self-center">
          <div className="mt-4 flex gap-4">
            <TextField
              className="flex-1"
              required
              label="Email"
              error={emailError}
              onBlur={() => {
                if (email === "" || !email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
                  setEmailError(true);
                } else {
                  setEmailError(false);
                }
              }}
              helperText= { emailError && "Please enter a valid email" }
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-4 flex gap-4">
            <TextField
              label="Role"
              select
              defaultValue={""}
              className="flex-1"
              required
              error={roleError}
              onBlur={() => {
                if (role === "") {
                  setRoleError(true);
                } else {
                  setRoleError(false);
                }
              }}
              helperText= { roleError && "Please select a role" }
              onChange={(e) => handleRoleSelection(e.target.value)}
            >
              <MenuItem value="GATHER_MANAGER">Gather Manager</MenuItem>
              <MenuItem value="GATHER_EMPLOYEE">Gather Employee</MenuItem>
              <MenuItem value="EXCHANGE_MANAGER">Exchange Manager</MenuItem>
              <MenuItem value="EXCHANGE_EMPLOYEE">Exchange Employee</MenuItem>
            </TextField>
            <TextField
              label="Department"
              select
              disabled={role === ""}
              defaultValue={""}
              className="flex-1"
              onChange={(e) => setDepartmentId(e.target.value)}
            >
              {roleDepartmentList.map((department) => (
                <MenuItem key={department.id} value={department.id}>
                  {department.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="mt-4 flex gap-4">
            <TextField
              className="flex-1"
              label="Full Name"
              required
              error={fullNameError}
              onBlur={() => {
                if (fullName === "") {
                  setFullNameError(true);
                } else {
                  setFullNameError(false);
                }
              }}
              helperText= { fullNameError && "Please enter a full name" }
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <DatePicker
              className="mt-4"
              label="Date of Birth"
              format={"DD/MM/YYYY"}
              disableFuture
              onChange={(value) => {
                setDob(
                  value.$D +
                    "-" +
                    (value.$M + 1 < 10 ? "0" : "") +
                    (value.$M + 1) +
                    "-" +
                    value.$y,
                );
              }}
            />
          </div>
          <div className="mt-4">
            <Button
              variant="contained"
              onClick={onFinish}
              style={{ display: "block" }}
            >
              Submit
            </Button>
          </div>
          {/* <div className="mt-4">
            <input
              id="avatar"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setAvatar(e.target.files[0]);
                  const reader = new FileReader();
                  reader.readAsDataURL(e.target.files[0]);
                  reader.onload = () => {
                    const preview = document.getElementById("avatarPreview");
                    if (preview) {
                      preview.src = reader.result as string;
                      preview.classList.remove("hidden");
                    }
                  };
                } else {
                  setAvatar(undefined);
                }
              }}
            />
            <label
              htmlFor="avatar"
              className="cursor-pointer rounded-lg bg-orange-400 px-3 py-2"
            >
              Upload Avatar
            </label>
            <img
              id="avatarPreview"
              className="mt-4 hidden h-[200px] w-[200px] rounded-full"
            />
          </div> */}
        </div>
      </div>
    </>
  );
}
