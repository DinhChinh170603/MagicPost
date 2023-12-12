import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Avatar, Button, Form, Input } from "antd";
import { useContext, useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { toast } from "react-toastify";
import AuthContext from "../contexts/AuthContext";
import service from "../helpers/service";
// import UploadAvatar from "../components/UploadAvatar";

export default function User() {
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const { user } = useContext<any>(AuthContext);

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
            toast.success("Your avatar has been changed successfully!");
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
      const { curPassword, newPassword, confirmPassword } =
        form.getFieldsValue();
      setLoading(true);
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      service
        .patch("/password", {
          oldPassword: curPassword,
          newPassword: newPassword,
        })
        .then((res) => {
          if (res.data.status === 200) {
            toast.success(
              "Password changed successfully! Now you will be redirected to login page.",
            );
            setInterval(() => {
              logout();
            }, 3000);
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
    form.setFieldsValue(user);
  }, [form]);

  return (
    <>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex h-[80%] w-[80%]">
          <div className="w-1/4 border border-black p-4">
            <div className="flex flex-col items-center">
              <div className="mx-auto mb-5 mt-10">
                <div className="relative">
                  {user && user.avatar ? (
                    <Avatar
                      src={user.avatar}
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
                    <MdOutlineEdit size={20} />
                  </div>
                </div>
              </div>
              <div
                className="mb-1 w-[90%] text-center text-2xl font-bold"
                style={{ overflowWrap: "break-word" }}
              >
                {user.fullName}
              </div>
              <div className="mb-5 text-center text-gray-500">{user.role}</div>
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
            <Form form={form} onFinish={onFinish}>
              {activeTab === "account" && (
                <div className="ml-10 mt-5 flex flex-col gap-3">
                  <div className="text-3xl font-bold">Account Settings</div>
                  <Form.Item
                    className="mt-5 w-[50%]"
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
                    name="departmentId"
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
                </div>
              )}
              {activeTab === "password" && (
                <div className="ml-10 mt-5 flex flex-col gap-2">
                  <div className="mb-3 text-3xl font-bold">
                    Password Settings
                  </div>
                  <Form.Item
                    className="w-[50%]"
                    name="curPassword"
                    label="Current password"
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Please enter current password",
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    className="w-[50%]"
                    name="newPassword"
                    label="New Password"
                    labelCol={{ span: 24 }}
                    rules={[
                      { required: true, message: "Please enter new password" },
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
                      {
                        required: true,
                        message: "Please re-enter new password",
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <div className="flex gap-4">
                    <Form.Item>
                      <Button
                        className="h-10 w-20"
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                      >
                        Save
                      </Button>
                    </Form.Item>
                    <Button className="h-10 w-20" type="default">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
