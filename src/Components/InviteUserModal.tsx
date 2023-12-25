import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import service from "../helpers/service";
import { toast } from "react-toastify";
import { EE_ROLE, EM_ROLE } from "../helpers/constants";

const { Option } = Select;

export default function InviteUserModal(props: any) {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const [roleDepartmentList, setRoleDepartmentList] = React.useState([]);

  const {
    open,
    setOpen,
    gatherPointsList,
    exchangePointsList,
    noManagerGatherPointsList,
    noManagerExchangePointsList,
  } = props;

  const handleRoleSelection = (value: string) => {
    if (
      !gatherPointsList ||
      !exchangePointsList ||
      !noManagerGatherPointsList ||
      !noManagerExchangePointsList
    ) {
      return;
    }

    switch (value) {
      case "GATHER_MANAGER":
        setRoleDepartmentList(noManagerGatherPointsList);
        break;
      case EM_ROLE:
        setRoleDepartmentList(noManagerExchangePointsList);
        break;
      case "GATHER_EMPLOYEE":
        setRoleDepartmentList(gatherPointsList);
        break;
      case EE_ROLE:
        setRoleDepartmentList(exchangePointsList);
        break;
      default:
        break;
    }
    form.setFieldValue("departmentId", undefined);
  };

  useEffect(() => {
    if (
      !gatherPointsList ||
      !exchangePointsList ||
      !noManagerGatherPointsList ||
      !noManagerExchangePointsList
    ) {
      return;
    }
    if (form.getFieldValue("role")) {
      handleRoleSelection(form.getFieldValue("role"));
    }
  }, [
    gatherPointsList,
    exchangePointsList,
    noManagerGatherPointsList,
    noManagerExchangePointsList,
  ]);

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

  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <Modal
      title="Invite User"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          htmlType="submit"
          form="invite-user-form"
          loading={loading}
        >
          Invite
        </Button>,
      ]}
    >
      <Form
        form={form}
        name="invite-user-form"
        layout="vertical"
        onFinish={onFinish}
      >
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
        <Form.Item
          className="flex-1"
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select onChange={handleRoleSelection}>
            <Option value="GATHER_MANAGER">Gather Manager</Option>
            <Option value="GATHER_EMPLOYEE">Gather Employee</Option>
            <Option value={EM_ROLE}>Exchange Manager</Option>
            <Option value={EE_ROLE}>Exchange Employee</Option>
          </Select>
        </Form.Item>
        <Form.Item
          className="flex-1"
          name="departmentId"
          label="Department"
          dependencies={["role"]}
          rules={[{ required: true, message: "Please select a department" }]}
        >
          <Select
            disabled={!form.getFieldValue("role") || !roleDepartmentList}
            loading={!roleDepartmentList}
          >
            {/* Replace roleDepartmentList with your actual data */}
            {roleDepartmentList.map((department: any) => (
              <Option key={department.id} value={department.id}>
                {department.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          className="w-full"
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: "Please enter a full name" }]}
        >
          <Input />
        </Form.Item>
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
      </Form>
    </Modal>
  );
}

InviteUserModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  exchangePointsList: PropTypes.array,
  noManagerExchangePointsList: PropTypes.array,
  gatherPointsList: PropTypes.array,
  noManagerGatherPointsList: PropTypes.array,
};
