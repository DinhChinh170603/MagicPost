import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React from "react";
import { toast } from "react-toastify";
import logo from "/public/logo_animate.gif";
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
          setLoading(false);
          if (res.data.status === 200) {
            localStorage.setItem("jwtToken", res.data.results);
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
    <div className="flex h-screen w-full flex-col xl:flex-row bg-bgColor" style = {{backgroundImage: "url('/public/BG_lookup.png')", backgroundSize: 'cover'}}>
      <div
        className="flex-1 flex-col items-center justify-center hidden xl:flex"
        // style={{
        //   backgroundImage: "url('/src/public/BG.png')",
        //   backgroundSize: "100% 100%",
        // }}
      >
        <img src={logo} className="h-[60%] animate-updown xl:h-[57%] hidden xl:block" alt="logo" />
        {/* <b className="text-[70px] max-lg:-mt-5 max-lg:text-[50px]">
          Magic Post
        </b> */}
      </div>

      {!forgotPassword ? (
        <Form form={form} onFinish={onFinish} className="flex flex-1 justify-center">
          <div className="flex w-[90%] flex-col items-center justify-center">
            <b className="text-[50px] mb-4 items-center justify-center flex xl:hidden">
              Magic Post
            </b>
            <div className="bg-white w-full p-8 rounded-xl shadow-lg xl:w-[70%]">
              <span className="mb-4 text-3xl font-bold flex justify-center ">Login</span>

              <Form.Item
                name="email"
                className="w-full"
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
                className="w-full"
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

              <Form.Item className="w-full justify-center flex">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                  loading={loading}
                >
                  Login
                </Button>
              </Form.Item>

              <div className="-mt-4 mb-3 w-full text-center">
                <span
                  className="cursor-pointer text-base text-[#4c56df] hover:underline"
                  onClick={() => setForgotPassword(true)}
                >
                  Forgot Password?
                </span>
              </div>
            </div>
          </div>
        </Form>
      ) : (
        <Form form={form} onFinish={onFinish} className="flex flex-1 justify-center">
          <div className="flex w-[90%] flex-col items-center justify-center">
            <b className="text-[50px] mb-4 items-center justify-center flex xl:hidden">
              Magic Post
            </b>
            <div className="bg-white w-full p-8 rounded-xl shadow-lg xl:w-[70%]">
              <span className="mb-4 text-3xl font-bold flex justify-center">Forget Password</span>

              <Form.Item
                name="email"
                className="w-full"
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

              <Form.Item className="w-full flex justify-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                  loading={loading}
                >
                  Reset password
                </Button>
              </Form.Item>

              <div className="-mt-4 mb-3 w-full text-center">
                <span
                  className="cursor-pointer text-base text-[#4c56df] hover:underline"
                  onClick={() => setForgotPassword(false)}
                >
                  Back to Login
                </span>
              </div>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
}
