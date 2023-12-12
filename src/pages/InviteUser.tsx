import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";
import service from "../helpers/service";
import axios from "axios";
import { Button, DatePicker, Form, Input, Select } from "antd";

const { Option } = Select;

export default function InviteUser() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const [exchangePointsList, setExchangePointsList] = useState([]);
  const [noManagerExchangePointsList, setNoManagerExchangePointsList] =
    useState([]);
  const [gatherPointsList, setGatherPointsList] = useState([]);
  const [noManagerGatherPointsList, setNoManagerGatherPointsList] = useState(
    [],
  );

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
              (exchangePoint: any) => exchangePoint.manager === null,
            ),
          );
          setNoManagerGatherPointsList(
            res2.data.results.filter(
              (gatherPoint: any) => gatherPoint.manager === null,
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
    switch (value) {
      case "GATHER_MANAGER":
        setRoleDepartmentList(noManagerGatherPointsList);
        break;
      case "EXCHANGE_MANAGER":
        setRoleDepartmentList(noManagerExchangePointsList);
        break;
      case "GATHER_EMPLOYEE":
        setRoleDepartmentList(gatherPointsList);
        break;
      case "EXCHANGE_EMPLOYEE":
        setRoleDepartmentList(exchangePointsList);
        break;
      default:
        break;
    }
  };

  const onFinish = () => {
    const { email, role, fullName, departmentId, dob } = form.getFieldsValue();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("role", role);
    formData.append("fullName", fullName);
    formData.append("departmentId", departmentId);
    formData.append("dob", dob.format("DD-MM-YYYY"));

    setLoading(true);

    service
      .post("/leader/invite", formData)
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
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      initialValues={{ role: "", departmentId: "" }}
    >
      {loading && <Loading />}
      <div className="flex h-full w-full flex-col p-5">
        <div className="text-3xl font-bold">Invite User</div>
        <div className="w-[60%] self-center">
          <div className="mt-4 flex gap-4">
            <Form.Item
              className="w-full"
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
              className="flex-1"
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select onChange={handleRoleSelection}>
                <Option value="GATHER_MANAGER">Gather Manager</Option>
                <Option value="GATHER_EMPLOYEE">Gather Employee</Option>
                <Option value="EXCHANGE_MANAGER">Exchange Manager</Option>
                <Option value="EXCHANGE_EMPLOYEE">Exchange Employee</Option>
              </Select>
            </Form.Item>
            <Form.Item
              className="flex-1"
              name="departmentId"
              label="Department"
              dependencies={["role"]}
              rules={[
                { required: true, message: "Please select a department" },
              ]}
            >
              <Select disabled={!form.getFieldValue("role")}>
                {/* Replace roleDepartmentList with your actual data */}
                {roleDepartmentList.map((department: any) => (
                  <Option key={department.id} value={department.id}>
                    {department.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="flex gap-4">
            <Form.Item
              className="w-full"
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
