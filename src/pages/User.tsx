import { Button, Form, Input, Avatar } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import service from "../helpers/service";
import { MdOutlineEdit } from "react-icons/md";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import UploadAvatar from "../components/UploadAvatar";
import Loading from "../helpers/Loading";

export default function User() {
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const [data, setData] = useState({});

  const [nowpassword, setNowpassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");

  const activeStyle =
    "w-[80%] rounded-lg bg-orange-400 p-3 text-center text-xl font-bold cursor-pointer transition-all duration-100";
  const inactiveStyle =
    "w-[80%] rounded-lg p-3 text-center text-xl font-bold hover:bg-orange-200 cursor-pointer transition-all duration-100";

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
  };

  // const handleAvatarUpload = (file) => {
  //   console.log('Uploaded file:', file);
  // };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "/login";
  };

  const onFinish = () => {
    setLoading(true);
    if (activeTab === "account") {
      const formData = new FormData();
      service
        .post("/avatar", formData)
        .then((res) => {
          if (res.data.status === 200) {
            toast.success(res.data.message);
            window.location.reload();
            setLoading(false);
          } else {
            toast.error(res.data.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setLoading(false);
        });
    } else if (activeTab === "password") {
      setLoading(true);
      if (newpassword !== confirmpassword) {
        toast.error("Passwords do not match");
        return;
      }
      service
        .patch("/password", {
          oldPassword: nowpassword,
          newPassword: newpassword,
        })
        .then((res) => {
          if (res.data.status === 200) {
            toast.success(res.data.message);
            logout();
            setLoading(false);
          } else {
            toast.error(res.data.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    setLoading(true);
    service.get("/users/me").then((res) => {
      form.setFieldsValue(res.data.results);
      setData(res.data.results);
      setLoading(false);
    });
  }, [form]);

  return (
    <>
      {loading && <Loading />}
      <div className="flex h-screen w-full items-center justify-center bg-gray-300">
        <div className="flex h-[70%] w-[80%]">
          <div className="w-1/4 border border-black p-4">
            <div className="flex flex-col items-center">
              <div className="mx-auto mb-5 mt-10">
                <div className="relative">
                  {data && data.avatar ? (
                    <Avatar
                      src={data.avatar}
                      size={150}
                      className="cursor-pointer"
                    />
                  ) : (
                    <AccountCircleIcon
                      className="cursor-pointer"
                      sx={{ color: "black", fontSize: 150 }}
                    />
                  )}
                  <div className="absolute right-2 top-2 cursor-pointer rounded-full border border-gray-500 bg-white p-1">
                    <MdOutlineEdit size={20} rounded-full />
                  </div>
                </div>
              </div>
              <div className="mb-1 text-2xl font-bold">{data.fullName}</div>
              <div className="mb-5 text-gray-500">{data.role}</div>
              <div className="flex w-full flex-col items-center gap-2">
                <div
                  className={
                    activeTab === "account" ? activeStyle : inactiveStyle
                  }
                  onClick={() => handleTabChange("account")}
                >
                  Account
                </div>
                <div
                  className={
                    activeTab === "password" ? activeStyle : inactiveStyle
                  }
                  onClick={() => handleTabChange("password")}
                >
                  Password
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 border border-black p-4">
            {activeTab === "account" && (
              <div className="ml-10 mt-5 flex flex-col gap-5">
                <div className="text-3xl font-bold">Account Settings</div>
                <Form form={form} onFinish={onFinish}>
                  <Form.Item
                    className="w-[50%]"
                    name="fullName"
                    label="Full Name"
                    labelCol={{ span: 24 }}
                  >
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    className="w-[50%]"
                    name="email"
                    label="Email"
                    labelCol={{ span: 24 }}
                  >
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    className="w-[50%]"
                    name="departmentID"
                    label="Department ID"
                    labelCol={{ span: 24 }}
                  >
                    <Input disabled />
                  </Form.Item>
                  <div className="flex gap-4">
                    <Button
                      className="h-10 w-20"
                      type="primary"
                      onClick={onFinish}
                    >
                      Save
                    </Button>
                    <Button className="h-10 w-20" type="default">
                      Cancel
                    </Button>
                  </div>
                </Form>
              </div>
            )}
            {activeTab === "password" && (
              <div className="ml-10 mt-5 flex flex-col gap-2">
                <div className="mb-3 text-3xl font-bold">Password Settings</div>
                <Form.Item
                  className="w-[50%]"
                  name="nowpassword"
                  label="Now Password"
                  labelCol={{ span: 24 }}
                  rules={[
                    { required: true, message: "Please enter Now Password" },
                  ]}
                >
                  <Input.Password
                    onChange={(e) => setNowpassword(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  className="w-[50%]"
                  name="newpassword"
                  label="New Password"
                  labelCol={{ span: 24 }}
                  rules={[
                    { required: true, message: "Please enter New Password" },
                  ]}
                >
                  <Input.Password
                    onChange={(e) => setNewpassword(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  className="w-[50%]"
                  name="confirmpassword"
                  label="Confirm Password"
                  labelCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: "Please enter Confirm Password",
                    },
                  ]}
                >
                  <Input.Password
                    onChange={(e) => setConfirmpassword(e.target.value)}
                  />
                </Form.Item>
                <div className="flex gap-4">
                  <Button
                    className="h-10 w-20"
                    type="primary"
                    onClick={onFinish}
                  >
                    Save
                  </Button>
                  <Button className="h-10 w-20" type="default">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
