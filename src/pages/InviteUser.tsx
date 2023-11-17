import React, { useState } from "react";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";
import service from "../helpers/service";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

export default function InviteUser() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);

  const onFinish = () => {
    if (!email || !role || !fullName || !dob) {
      toast.error("Please fill out every fields");
      return;
    }
    const formData = new FormData();
    formData.append("email", email);
    formData.append("role", role);
    formData.append("fullName", fullName);
    formData.append("departmentId", "4");
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
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Role"
              select
              defaultValue={""}
              className="flex-1"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="GATHER_MANAGER">Gather Manager</MenuItem>
              <MenuItem value="GATHER_EMPLOYEE">Gather Employee</MenuItem>
              <MenuItem value="EXCHANGE_MANAGER">Exchange Manager</MenuItem>
              <MenuItem value="EXCHANGE_EMPLOYEE">Exchange Employee</MenuItem>
            </TextField>
          </div>
          <div className="mt-4 flex gap-4">
            <TextField
              className="flex-1"
              label="Full Name"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <DatePicker
              className="mt-4"
              label="Date of Birth"
              format={"DD/MM/YYYY"}
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
