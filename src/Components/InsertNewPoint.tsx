import { Modal as AntModal, Form, Input, Select } from "antd";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";
import service from "../helpers/service";

interface ModalProps {
  onSubmit: () => void;
  apiEndpoint: string;
  isOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
}

const InsertNewPoint: React.FC<ModalProps> = ({
  onSubmit,
  apiEndpoint,
  isOpen,
  setModalOpen,
}) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onFinish = () => {
    const { name, location } = form.getFieldsValue();

    setLoading(true);

    service
      .post(apiEndpoint, {
        name: name,
        location: location,
      })
      .then((res) => {
        setLoading(false);
        if (res.data.status === 201) {
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
          <div className="mb-8 text-2xl font-bold">Fill out this form</div>
          <Form.Item
            className="w-[60%] flex-1"
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter a Name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className="mb-8 h-8 w-[60%] flex-1"
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please select a location" }]}
          >
            <Select
              defaultValue="Location"
              options={[
                { value: "Hà Nội", label: "Hà Nội" },
                { value: "Hải Phòng", label: "Hải Phòng" },
                { value: "Vinh", label: "Vinh" },
                { value: "Biên Hòa", label: "Biên Hòa" },
                { value: "Đà Nẵng", label: "Đà Nẵng" },
                { value: "Hồ Chí Minh", label: "Hồ Chí Minh" },
              ]}
            />
          </Form.Item>
        </AntModal>
      </Form>
    </>
  );
};

export default InsertNewPoint;
