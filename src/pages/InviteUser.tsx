import React, { useState } from "react";
import { Input, Select, DatePicker, Button } from "antd";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";
import service from "../helpers/service";

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
        if (res.data.status === 200) {
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

  const roleOptions = [
    { value: "GATHER_MANAGER", label: "Gather Manager" },
    { value: "GATHER_EMPLOYEE", label: "Gather Employee" },
    { value: "EXCHANGE_MANAGER", label: "Exchange Manager" },
    { value: "EXCHANGE_EMPLOYEE", label: "Exchange Employee" },
  ];

  return (
    <>
      {loading && <Loading />}
      <div className="flex h-screen w-full flex-col bg-orange-100 p-5">
        <div className="text-3xl font-bold">Invite User</div>
        <div className="w-[60%] self-center">
          <div className="mt-4 flex gap-4">
            <Input
              className="flex-1"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Select
              className="flex-1"
              options={roleOptions}
              placeholder="Role"
              onChange={(value) => setRole(value)}
            />
          </div>
          <div className="mt-4 flex gap-4">
            <Input
              className="flex-1"
              placeholder="Full Name"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <DatePicker
            className="mt-4"
            placeholder="Date of Birth"
            format={"DD/MM/YYYY"}
            onChange={(value) => {
              if (!value) {
                setDob("");
                return;
              }
              const date = `${value.date()}/${
                value.month() + 1
              }/${value.year()}`;
              console.log(date);
              setDob(date);
            }}
          />
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
          <Button
            type="primary"
            className="mt-4 bg-blue-300 text-black"
            onClick={onFinish}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
}
