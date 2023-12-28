import { Button, Form, Modal, Select } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "react-toastify";
import { FIELD_REQUIRED } from "../helpers/constants";
import service from "../helpers/service";

export default function BulkReceiveModal(props: any) {
  const [form] = Form.useForm();
  const { open, setOpen, roleAPI, onActionSuccess, data } = props;

  const [loading, setLoading] = useState(false);

  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };

  const onFinish = () => {
    const { data } = form.getFieldsValue();

    setLoading(true);
    data.forEach((item: any) => {
      service
        .patch(`${roleAPI}/receive/${item}`)
        .then((res) => {
          setLoading(false);
          if (res.data.status !== 200) {
            toast.error(res.data.message + ": " + item);
            return;
          }
          toast.success(res.data.message + ": " + item);
          onActionSuccess(item);
          onClose();
        })
        .catch((err) => {
          toast.error(err.response.data.error + ": " + item);
          setLoading(false);
        });
    });
  };

  return (
    <Modal
      title="Bulk receive"
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
          form="bulk-action"
          loading={loading}
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        name="bulk-action"
      >
        <Form.Item
          name="data"
          label="Packages"
          rules={[{ required: true, message: FIELD_REQUIRED }]}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="Please select packages"
            options={data.map((item: any) => ({
              label: item.id,
              value: item.id,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

BulkReceiveModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  roleAPI: PropTypes.string,
  onActionSuccess: PropTypes.func,
  data: PropTypes.array,
};
