import { Modal as AntModal, Button, Form, Input, Select } from "antd";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { cities } from "../helpers/location";
import service from "../helpers/service";

interface ModalProps {
  onSubmit: () => void;
  apiEndpoint: string;
  isOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
}

const InsertNewPointModal: React.FC<ModalProps> = ({
  onSubmit,
  apiEndpoint,
  isOpen,
  setModalOpen,
}) => {
  const [form] = Form.useForm();

  const [districts, setDistricts] = useState<any>([]);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const handleCityChange = (cityName: string) => {
    const districts = getDistrictsByCityName(cityName);
    setDistricts(districts);
    setSelectedCity(cityName);
    form.setFieldValue("district", undefined);
  };

  // Get districtsList base on cityName
  const getDistrictsByCityName = (cityName: string) => {
    try {
      const city = cities.find((c) => c.name === cityName);

      if (city) {
        return city.districts;
      } else {
        throw new Error(`City with name ${cityName} not found`);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      throw error;
    }
  };

  const handleModalClose = () => {
    form.resetFields();
    setSelectedCity(null);
    setModalOpen(false);
  };

  const onFinish = () => {
    const { name, city, district } = form.getFieldsValue();
    const location = district + ", " + city;

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
      <Form id="pointForm" form={form} layout="vertical" onFinish={onFinish}>
        <AntModal
          style={{ top: 30 }}
          open={isOpen}
          onCancel={handleModalClose}
          footer={[
            <Button key="cancel" onClick={handleModalClose}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              htmlType="submit"
              form="pointForm"
            >
              Submit
            </Button>,
          ]}
        >
          <div className="mb-8 text-2xl font-bold">{apiEndpoint === "/exchange-point" ? "Create an Exchange Point" : "Create a Gather Point"}</div>
          <Form.Item
            className="mb-8 w-[70%] flex-1"
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter a Name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className="mb-8 w-[70%] flex-1"
            label="City"
            name="city"
            rules={[{ required: true, message: "Please select a city" }]}
          >
            <Select onChange={handleCityChange}>
              {cities.map((city) => (
                <Select.Option key={city.name} value={city.name}>
                  {city.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            className="mb-8 w-[70%] flex-1"
            label="District"
            name="district"
            rules={[{ required: true, message: "Please select a district" }]}
          >
            <Select disabled={!selectedCity}>
              {districts.map((district: any) => (
                <Select.Option key={district.name} value={district.name}>
                  {district.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </AntModal>
      </Form>
    </>
  );
};

export default InsertNewPointModal;
