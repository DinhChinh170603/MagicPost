import { Modal as AntModal, Form, Select } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";
import service from "../helpers/service";

interface ModalProps {
    onSubmit: () => void;
    exchangePointsList: any;
    gatherPointsList: any;
    isOpen: boolean;
    setModalOpen: (isOpen: boolean) => void;
}

const { Option } = Select;

const EstablishConnection: React.FC<ModalProps> = ({ onSubmit, exchangePointsList, gatherPointsList, isOpen, setModalOpen }) => {
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
          onSubmit(); // to update the table by callback
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
    <>
      {loading && <Loading />}
      <Form form={form} layout="vertical">
        <AntModal
          style={{ top: 30 }}
          onOk={onFinish}
          open={isOpen}
          onCancel={() => setModalOpen(false)}
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
            rules={[{ required: true, message: "Please select an ExchangePoint" }]}
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

export default EstablishConnection;
