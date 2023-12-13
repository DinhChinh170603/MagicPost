import { Modal as AntModal, Form, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";
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
  const [wards, setWards] = useState<any>([]);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedWard, setSelectedWard] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const handleCityChange = (cityName: string) => {
    const districts = getDistrictsByCityName(cityName);
    setDistricts(districts);
    setSelectedCity(cityName);
    setSelectedDistrict(null);
    setSelectedWard(null);
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

  // Get wardsList base on cityName and districtName
  const getWardsByCityAndDistrictName = (
    cityName: string,
    districtName: string,
  ) => {
    try {
      const districts = getDistrictsByCityName(cityName);
      const district = districts.find((d) => d.name === districtName);

      if (district) {
        return district.wards;
      } else {
        throw new Error(`District with name ${districtName} not found`);
      }
    } catch (error) {
      console.error("Error fetching wards:", error);
      throw error;
    }
  };

  const handleDistrictChange = (districtName: string) => {
    const newWards = getWardsByCityAndDistrictName(selectedCity, districtName);
    setWards(newWards);
    setSelectedDistrict(districtName);
    setSelectedWard(null);
  };

  // Read data from file location.json when component was render
  useEffect(() => {
    setSelectedDistrict(null);
    setSelectedWard(null);
  }, [selectedCity]);

  const onFinish = () => {
    const { name } = form.getFieldsValue();
    const location =
      selectedCity + ", " + selectedDistrict + ", " + selectedWard;

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
          <div className="mb-8 text-2xl font-bold">
            Create an Exchange Point
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
            <Select onChange={handleDistrictChange} disabled={!selectedCity}>
              {districts.map((district: any) => (
                <Select.Option key={district.name} value={district.name}>
                  {district.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            className="mb-8 w-[70%] flex-1"
            label="Ward"
            name="wards"
            rules={[{ required: true, message: "Please select a ward" }]}
          >
            <Select onChange={setSelectedWard} disabled={!selectedDistrict}>
              {wards.map((ward: any) => (
                <Select.Option key={ward.name} value={ward.name}>
                  {ward.name}
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
