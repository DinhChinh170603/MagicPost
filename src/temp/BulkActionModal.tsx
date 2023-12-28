import { Button, Form, Modal, Select } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FIELD_REQUIRED } from "../helpers/constants";
import service from "../helpers/service";

export default function BulkActionModal(props: any) {
  const [form] = Form.useForm();
  const {
    open,
    setOpen,
    forwardable,
    sendableToReceiver,
    roleAPI,
    onActionSuccess,
  } = props;

  const [loading, setLoading] = useState(false);

  const [selectedArray, setSelectedArray] = useState([]);

  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };

  useEffect(() => {
    form.setFieldValue("action", "/send/");
    setSelectedArray(forwardable);
  }, [open]);

  const onFinish = () => {
    const { action, data } = form.getFieldsValue();

    setLoading(true);
    data.forEach((item: any) => {
      service
        .patch(`${roleAPI}${action}${item}`)
        .then((res) => {
          setLoading(false);
          if (res.data.status !== 200) {
            toast.error(res.data.message + ": " + item);
            return;
          }
          toast.success(res.data.message + ": " + item);
          if (action === "/send") {
            onActionSuccess(item);
          }
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
      title={roleAPI === "/gth-employee" ? "Bulk Forward" : "Bulk Action"}
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
          name="action"
          label="Action"
          className={roleAPI === "/gth-employee" ? "hidden" : ""}
        >
          <Select
            options={[
              {
                label: "Forward",
                value: "/send/",
              },
              {
                label: "Send to Receiver",
                value: "/send-receiver/",
              },
            ]}
            onChange={(value) => {
              value === "/send-receiver/"
                ? setSelectedArray(sendableToReceiver)
                : setSelectedArray(forwardable);
              form.setFieldValue("data", undefined);
            }}
          />
        </Form.Item>
        <Form.Item
          name="data"
          label="Packages"
          rules={[{ required: true, message: FIELD_REQUIRED }]}
        >
          <Select
            mode="multiple"
            allowClear
            disabled={!form.getFieldValue("action")}
            placeholder="Please select packages"
            options={selectedArray.map((item) => ({
              label: item,
              value: item,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

BulkActionModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  forwardable: PropTypes.array,
  sendableToReceiver: PropTypes.array,
  roleAPI: PropTypes.string,
  onActionSuccess: PropTypes.func,
};
