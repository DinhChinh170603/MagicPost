import { Button, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import service from "../helpers/service";

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

  const onFinish = () => {
    const { email, fullName, departmentId } = form.getFieldsValue();
    const formData1 = new FormData();
    const formData2 = new FormData();
    formData1.append("email", email);
    formData1.append("fullName", fullName);
    formData2.append("", nowpassword);
    formData2.append("", newpassword);
    formData2.append("", confirmpassword);

    service
      .put("/users/me", activeTab === "account" ? formData1 : formData2)
      .then((res) => {
        if (res.data.status === 200) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
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
    <div className="flex h-screen w-full items-center justify-center bg-gray-300">
      <div className="flex h-[60%] w-[80%]">
        <div className="w-1/4 border border-black p-4">
          <div className="flex flex-col items-center">
            <img
              src="https://c1.klipartz.com/pngpicture/823/765/sticker-png-login-icon-system-administrator-user-user-profile-icon-design-avatar-face-head.png"
              alt="Avatar"
              className="mx-auto mb-5 mt-10 h-40 w-40 rounded-full"
            />
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
            <div className="ml-10 mt-10 flex flex-col gap-5">
              <div className="text-3xl font-bold">Account Settings</div>
              <Form form={form} onFinish={onFinish}>
                <Form.Item
                  className="w-[50%]"
                  name="fullName"
                  label="Full Name"
                  labelCol={{ span: 24 }}
                  rules={[
                    { required: true, message: "Please enter a full name" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  className="w-[50%]"
                  name="email"
                  label="Email"
                  labelCol={{ span: 24 }}
                  rules={[
                    { required: true, message: "Please enter an email" },
                    {
                      type: "email",
                      message: "Please enter a valid email",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  className="w-[50%]"
                  name="departmentID"
                  label="Department ID"
                  labelCol={{ span: 24 }}
                >
                  <Input disabled={true} />
                </Form.Item>
                <div className="flex gap-4">
                  <Button className="h-10 w-20" type="primary" onClick={onFinish}>
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
            <div className="ml-10 mt-10 flex flex-col gap-5">
              <div className="text-3xl font-bold">Password Settings</div>
              <Form.Item
                className="w-[50%]"
                name="nowpassword"
                label="Now Password"
                labelCol={{ span: 24 }}
                rules={[
                  { required: true, message: "Please enter Now Password" },
                ]}
              >
                <Input.Password />
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
                <Input.Password />
              </Form.Item>
              <Form.Item
                className="w-[50%]"
                name="confirmPassword"
                label="Confirm Password"
                labelCol={{ span: 24 }}
                rules={[
                  { required: true, message: "Please enter Confirm Password" },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <div className="flex gap-4">
                <Button
                  className="h-10 w-20"
                  type="primary"
                  onSubmit={onFinish}
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
  );
}
