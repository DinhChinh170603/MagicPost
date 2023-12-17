import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";
import service from "../helpers/service";
import { Button, DatePicker, Form, Input } from "antd";

export default function InviteEmployee(props: any) {
  const [form] = Form.useForm();

  const { role } = props;

  const [loading, setLoading] = useState(false);

  const onFinish = () => {
    const { email, fullName, departmentId, dob } = form.getFieldsValue();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("fullName", fullName);
    formData.append("departmentId", departmentId);
    formData.append("dob", dob.format("DD-MM-YYYY"));

    setLoading(true);
    let roleApiPrefix = "";
    if (role === "EXCHANGE_MANAGER") {
      roleApiPrefix = "/ex-manager";
    } else if (role === "GATHER_MANAGER") {
      roleApiPrefix = "/gth-manager";
    } else {
      toast.error("Something went wrong");
    }

    if (roleApiPrefix) {
      service
        .post(roleApiPrefix + "/invite", formData)
        .then((res) => {
          setLoading(false);
          if (res.data.status === 201) {
            toast.success(res.data.message);
            form.resetFields();
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response.data.message);
        });
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      {loading && <Loading />}
      <div className="flex h-full w-full flex-col p-8 pl-20">
        <div className="text-3xl font-bold">Add employee</div>
        <div className="w-[60%] self-center">
          <div className="mt-4 flex gap-4">
            <Form.Item
              className="w-[50%]"
              name="email"
              label="Email"
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
          </div>
          <div className="flex gap-4">
            <Form.Item
              className="w-[50%]"
              name="fullName"
              label="Full Name"
              rules={[{ required: true, message: "Please enter a full name" }]}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="mt-4">
            <Form.Item
              name="dob"
              label="Date of Birth"
              rules={[
                {
                  type: "object",
                  required: true,
                  message: "Please select a date of birth",
                },
              ]}
            >
              <DatePicker
                className="w-64"
                format="DD/MM/YYYY"
                disabledDate={(current) =>
                  current && current.valueOf() > Date.now()
                }
              />
            </Form.Item>
          </div>
          <div className="mt-4">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
}

InviteEmployee.propTypes = {
  role: PropTypes.string,
};
