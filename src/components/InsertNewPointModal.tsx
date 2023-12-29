import { Modal as AntModal, Button, Form, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { cities } from "../helpers/location";
import service from "../helpers/service";
import { LEADER_ROLE } from "../helpers/constants";

interface ModalProps {
  apiEndpoint: string;
  isOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  onAddPointSuccess: (point: any) => void;
}

const InsertNewPointModal: React.FC<ModalProps> = ({
  apiEndpoint,
  isOpen,
  setModalOpen,
  onAddPointSuccess,
}) => {
  const [form] = Form.useForm();

  const [districts, setDistricts] = useState<any>([]);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [dataLoading, setDataLoading] = useState(false);
  const [employees, setEmployees] = useState<any>([]);

  useEffect(() => {
    if (!isOpen) return;
    setDataLoading(true);
    service
      .get("/leader/subordinates")
      .then((res) => {
        if (res.data.status === 200) {
          setEmployees(
            res.data.results.filter(
              (e: any) =>
                e.role !== LEADER_ROLE &&
                (e.departmentId === null || e.departmentId === ""),
            ),
          );
          setDataLoading(false);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setDataLoading(false);
      });
  }, [isOpen]);

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
    const { name, city, district, manager } = form.getFieldsValue();
    const location = district + ", " + city;

    setLoading(true);

    service
      .post(apiEndpoint, {
        name: name,
        location: location,
        managerId: manager ? manager : null,
      })
      .then((res) => {
        setLoading(false);
        if (res.data.status === 201) {
          toast.success(res.data.message);
          setModalOpen(false);
          form.resetFields();
          onAddPointSuccess(res.data.results);
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
      <AntModal
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
        <Form id="pointForm" form={form} layout="vertical" onFinish={onFinish}>
          <div className="text-2xl font-bold">
            {apiEndpoint === "/exchange-point"
              ? "Create an Exchange Point"
              : "Create a Gather Point"}
          </div>
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

          <Form.Item
            className="mb-8 w-[70%] flex-1"
            name="manager"
            label="Manager"
          >
            <Select disabled={dataLoading}>
              {employees.map((employee: any) => (
                <Select.Option key={employee.id} value={employee.id}>
                  {employee.fullName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </AntModal>
    </>
  );
};

export default InsertNewPointModal;
