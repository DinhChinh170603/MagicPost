import { Modal as AntModal, Button, Form, Select } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import service from "../helpers/service";

interface ModalProps {
  packageId: any;
  isOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  onRejectSuccess: (id: string) => void;
}

const { Option } = Select;

const DeliveryFailureModal: React.FC<ModalProps> = ({
  onRejectSuccess,
  packageId,
  isOpen,
  setModalOpen,
}) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onFinish = () => {
    const { reason } = form.getFieldsValue();
    setLoading(true);

    if (reason === "Người nhận từ chối nhận hàng") {
      service
        .patch("/ex-employee/strict-reject-receiver", { packageId, reason })
        .then((res) => {
          if (res.data.status === 200) {
            toast.success(res.data.message);
            onRejectSuccess(packageId);
            form.resetFields();
            setModalOpen(false);
          } else {
            toast.error(res.data.message);
          }
          setLoading(false);
        });
    } else {
      service
        .patch("/ex-employee/reject-receiver", { packageId, reason })
        .then((res) => {
          if (res.data.status === 200) {
            toast.success(res.data.message);
            form.resetFields();
            setModalOpen(false);
          } else {
            toast.error(res.data.message);
          }
          setLoading(false);
        });
    }
  };

  const onClose = () => {
    form.resetFields();
    setModalOpen(false);
  };

  return (
    <>
      <Form form={form} layout="vertical" name="deliver-failure" onFinish={onFinish}>
        <AntModal
          style={{ top: 30 }}
          open={isOpen}
          onCancel={onClose}
          footer={[
            <Button key="back" onClick={onClose}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              htmlType="submit"
              form="deliver-failure"
              className="ml-4"
            >
              Submit
            </Button>,
          ]}
        >
          <Form.Item
            className="mb-12 w-[80%] flex-1"
            name="reason"
            label="Reason"
            rules={[{ required: true, message: "Please choose a reason" }]}
          >
            <Select>
              <Option value="Người nhận không liên lạc được">
                Người nhận không liên lạc được
              </Option>
              <Option value="Địa chỉ không chính xác">
                Địa chỉ không chính xác
              </Option>
              <Option value="Sự cố không mong muốn">
                Sự cố không mong muốn
              </Option>
              <Option value="Người nhận từ chối nhận hàng">
                Người nhận từ chối nhận hàng
              </Option>
            </Select>
          </Form.Item>
        </AntModal>
      </Form>
    </>
  );
};

export default DeliveryFailureModal;
