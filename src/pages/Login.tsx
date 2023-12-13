import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React from "react";
import { toast } from "react-toastify";
import logo from "../assets/logo.jpg";
import service from "../helpers/service";

export default function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const [forgotPassword, setForgotPassword] = React.useState(false);

  const onFinish = () => {
    if (forgotPassword) {
      setLoading(true);

      const { email } = form.getFieldsValue();

      service
        .patch("/reset-password", { email })
        .then((res) => {
          setLoading(false);
          if (res.data.status === 200) {
            toast.success(res.data.message);
            setForgotPassword(false);
          } else {
            toast.error("No user found with this email");
          }
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response.data.message);
        });
    } else {
      setLoading(true);

      const { email, password } = form.getFieldsValue();

      service
        .post("/authenticate", {
          email,
          password,
        })
        .then((res) => {
          if (res.data.status === 200) {
            localStorage.setItem("jwtToken", res.data.results);
            setLoading(false);
            window.location.href = "/";
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setLoading(false);
        });
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-300">
        <img src={logo} className="h-[50%] w-[50%]" alt="logo" />
      </div>

      {!forgotPassword ? (
        <Form form={form} onFinish={onFinish} className="flex flex-1">
          <div className="flex flex-1 flex-col items-center justify-center">
            <span className="mb-4 text-3xl font-bold">Login</span>

            <Form.Item
              name="email"
              className="w-[40%]"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
                className="py-2"
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              name="password"
              className="w-[40%]"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
                className="py-2"
              />
            </Form.Item>

            <Form.Item className="w-[20%]">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={loading}
              >
                Login
              </Button>
            </Form.Item>

            <div className="-mt-4 mb-3 w-[38%] text-center">
              <span
                className="cursor-pointer text-base text-[#4c56df] hover:underline"
                onClick={() => setForgotPassword(true)}
              >
                Forgot Password?
              </span>
            </div>
          </div>
        </Form>
      ) : (
        <Form form={form} onFinish={onFinish} className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col items-center justify-center">
            <span className="mb-4 text-3xl font-bold">Forget Password</span>

            <Form.Item
              name="email"
              className="w-[40%]"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
                className="py-2"
              />
            </Form.Item>

            <Form.Item className="w-40">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={loading}
              >
                Reset password
              </Button>
            </Form.Item>

            <div className="-mt-4 mb-3 w-[38%] text-center">
              <span
                className="cursor-pointer text-base text-[#dc5f29] hover:underline"
                onClick={() => setForgotPassword(false)}
              >
                Back to Login
              </span>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
}
