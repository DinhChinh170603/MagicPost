import { Modal as AntModal, Button, Form, Select } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";
import service from "../helpers/service";

interface ModalProps {
    onSubmit: () => void;
    exchangePointsList: any;
    gatherPointsList: any;
}

const { Option } = Select;

const EstablishConnection: React.FC<ModalProps> = ({ onSubmit, exchangePointsList, gatherPointsList }) => {
  const [form] = Form.useForm();

  const [modalOpen, setModalOpen] = useState(false);
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
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Establish Connection
        </Button>
        <AntModal
          style={{ top: 30 }}
          onOk={onFinish}
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
        >
          <div className="mb-5 text-2xl font-bold">
            Select a GatherPoint <br /> linked to an ExchangePoint
          </div>
          <Form.Item
            className="mb-8 flex-1"
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
            className="mb-12 flex-1"
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
