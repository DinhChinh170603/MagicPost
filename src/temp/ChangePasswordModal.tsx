import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Form, Input, Modal } from "antd";
import { FIELD_REQUIRED } from "../helpers/constants";
import service from "../helpers/service";
import { toast } from "react-toastify";

export default function ChangePasswordModal(props: any) {
  const [form] = Form.useForm();
  const { open, setOpen } = props;

  const [loading, setLoading] = useState(false);

  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "/login";
  };

  const onFinish = () => {
    const { oldPassword, newPassword, confirmPassword } = form.getFieldsValue();
    if (newPassword !== confirmPassword) {
      form.setFields([
        {
          name: "newPassword",
          errors: ["Passwords do not match."],
        },
        {
          name: "confirmPassword",
          errors: ["Passwords do not match."],
        },
      ]);
      return;
    }
    setLoading(true);
    service
      .patch("/change-password", { oldPassword, newPassword })
      .then((res) => {
        setLoading(false);
        if (res.data.status === 200) {
          onClose();
          toast.success(
            "Password changed successfully! You will be logged out",
          );
          setTimeout(() => {
            logout();
          }, 1500);
        } else {
          form.setFields([
            {
              name: "oldPassword",
              errors: [res.data.message],
            },
          ]);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response.data.message);
      });
  };

  return (
    <Modal
      title="Change Password"
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
          form="change-password"
          loading={loading}
        >
          Change
        </Button>,
      ]}
    >
      <Form
        form={form}
        name="change-password"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="Old Password"
          name="oldPassword"
          rules={[{ required: true, message: FIELD_REQUIRED }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true, message: FIELD_REQUIRED }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[{ required: true, message: FIELD_REQUIRED }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
}

ChangePasswordModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};
