import { Modal as AntModal, Button, Form, Select } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import service from "../helpers/service";

interface ModalProps {
  exchangePointsList: any;
  gatherPointsList: any;
  isOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
}

const { Option } = Select;

const EstablishConnectionModal: React.FC<ModalProps> = ({
  exchangePointsList,
  gatherPointsList,
  isOpen,
  setModalOpen,
}) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onFinish = () => {
    const { gatherPoint, exchangePoint } = form.getFieldsValue();

    setLoading(true);
    service
      .patch("/leader/link", {
        gatherPointId: gatherPoint,
        exchangePointId: exchangePoint,
      })
      .then((res) => {
        setLoading(false);
        if (res.data.status === 200) {
          toast.success(res.data.message);
          setModalOpen(false);
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

  const handleModalClose = () => {
    setModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish} id="linkForm">
        <AntModal
          style={{ top: 30 }}
          open={isOpen}
          onCancel={handleModalClose}
          footer={[
            <Button key="back" onClick={handleModalClose}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={loading}
              form="linkForm"
            >
              Submit
            </Button>,
          ]}
        >
          <div className="mb-8 text-2xl font-bold">
            Select a GatherPoint <br /> linked to an ExchangePoint
          </div>
          <Form.Item
            className="mb-8 w-[80%] flex-1"
            name="gatherPoint"
            label="GatherPoint"
            rules={[{ required: true, message: "Please select a GatherPoint" }]}
          >
            <Select>
              {gatherPointsList.map((department: any) => (
                <Option key={department.id} value={department.id}>
                  {department.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            className="mb-12 w-[80%] flex-1"
            name="exchangePoint"
            label="ExchangePoint"
            rules={[
              { required: true, message: "Please select an ExchangePoint" },
            ]}
          >
            <Select>
              {exchangePointsList.map((department: any) => (
                <Option key={department.id} value={department.id}>
                  {department.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </AntModal>
      </Form>
    </>
  );
};

export default EstablishConnectionModal;
