import { Modal as AntModal, Form, Select } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";
import service from "../helpers/service";

interface ModalProps {
  onSubmit: () => void;
  packageIds: any;
  isOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
}

const { Option } = Select;

const DeliveryFailureModal: React.FC<ModalProps> = ({
  onSubmit,
  packageIds,
  isOpen,
  setModalOpen,
}) => {
  const [form] = Form.useForm();
  const [apiEndpoint, setApiEndpoint] = useState("");

  const [loading, setLoading] = useState(false);

  const onFinish = () => {
    const { reason, sendAttempt } = form.getFieldsValue();
    setLoading(true);

    const sendRequests = packageIds.map((packageId: string) => {
      if (sendAttempt === "exceed") {
        return service.patch(`/ex-employee` + `/${apiEndpoint}/` + packageId);
      } else {
        return service.patch(`/ex-employee` + `/${apiEndpoint}/`, {
          packageId: packageId,
          reason: `${sendAttempt} (thất bại) với lí do: ${reason}`,
        });
      }
    });

    Promise.all(sendRequests)
      .then((responses) => {
        setLoading(false);

        responses.forEach((res) => {
            if (res.data.status === 200) {
                toast.success(res.data.message);
                setModalOpen(false);
                form.resetFields();
                onSubmit(); // to update the table by callback
            } else {
                toast.error(res.data.message);
            }
        });
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response.data.message);
      });
  };

  const handleReasonChange = (value: string) => {
    form.setFieldsValue({ reason: value });
  };

  const handleSendAttemptChange = (value: string) => {
    if (value === "Đã quá 3 lần gửi") {
      form.setFieldsValue({ sendAttempt: value });
      setApiEndpoint("strict-reject-receiver");
    } else {
      form.setFieldsValue({ sendAttempt: value });
      setApiEndpoint("reject-receiver");
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Form form={form} layout="vertical">
        <AntModal
          style={{ top: 30 }}
          onOk={onFinish}
          open={isOpen}
          onCancel={() => setModalOpen(false)}
        >
          <div className="mb-8 text-2xl font-bold">Choose a reason</div>
          <Form.Item
            className="mb-8 w-[80%] flex-1"
            name="sendAttempt"
            label="Send Attempt"
            rules={[{ required: true, message: "Please choose a send attempt" }]}
          >
            <Select onChange={handleSendAttemptChange}>
              <Option value="Lần gửi 1">Lần gửi 1</Option>
              <Option value="Lần gửi 2">Lần gửi 2</Option>
              <Option value="Lần gửi 3">Lần gửi 3</Option>
              <Option value="Đã quá 3 lần gửi">Đã quá 3 lần gửi</Option>
            </Select>
          </Form.Item>
          <Form.Item
            className="mb-12 w-[80%] flex-1"
            name="reason"
            label="Reason"
            rules={[{ required: true, message: "Please choose a reason" }]}
          >
            <Select onChange={handleReasonChange}>
              <Option value="Người nhận không liên lạc được">Người nhận không liên lạc được</Option>
              <Option value="Địa chỉ không chính xác">Địa chỉ không chính xác</Option>
              <Option value="Người nhận từ chối nhận hàng">Người nhận từ chối nhận hàng</Option>
              <Option value="Sự cố không mong muốn">Sự cố không mong muốn</Option>
            </Select>
          </Form.Item>
        </AntModal>
      </Form>
    </>
  );
};

export default DeliveryFailureModal;
