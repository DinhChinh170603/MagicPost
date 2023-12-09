import { Button, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import Loading from "../helpers/Loading";
import service from "../helpers/service";
import { toast } from "react-toastify";

export default function NewPackage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    setPageLoading(true);
    service
      .get("/ex-employee/destinations")
      .then(
        (res) => {
          setDestinations(res.data.results);
          setPageLoading(false);
        },
        () => {
          setPageLoading(false);
          toast.error("Failed to get destinations");
        },
      )
      .catch((err) => {
        toast.error("Failed to get destinations ", err.response.data.message);
      });
    form.setFieldValue("packageType", "GOODS");
  }, []);

  const onFinish = () => {
    setLoading(true);
    service
      .post("/ex-employee/new-package", form.getFieldsValue())
      .then((res) => {
        setLoading(false);
        if (res.data.status === 201) {
          toast.success(res.data.message);
          form.resetFields();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Failed to create package ", err.response.data.message);
      });
  };
  return (
    <>
      {pageLoading && <Loading />}
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="flex h-full w-full flex-col items-center"
      >
        <h1 className="m-4 self-start text-3xl font-bold">New Package</h1>
        <div className="flex w-[80%] flex-wrap gap-x-10 gap-y-3 p-5">
          <Form.Item
            name="senderName"
            label="Sender Name"
            className="basis-[45%]"
            rules={[
              {
                required: true,
                message: "Please fill out this field!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="senderContact"
            label="Sender Contact"
            className="basis-[45%]"
            rules={[
              {
                required: true,
                message: "Please fill out this field!",
              },
              {
                pattern: /^\d{10}$/,
                message: "Please enter a valid phone number!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="receiverName"
            label="Receiver Name"
            className="basis-[45%]"
            rules={[
              {
                required: true,
                message: "Please fill out this field!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="receiverContact"
            label="Receiver Contact"
            className="basis-[45%]"
            rules={[
              {
                required: true,
                message: "Please fill out this field!",
              },
              {
                pattern: /^\d{10}$/,
                message: "Please enter a valid phone number!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="orgAddress"
            label="Origin Address"
            className="basis-[45%]"
            rules={[
              {
                required: true,
                message: "Please fill out this field!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="desAddress"
            label="Destination Address"
            className="basis-[45%]"
            rules={[
              {
                required: true,
                message: "Please fill out this field!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="packageType"
            label="Package Type"
            className="basis-[45%]"
            rules={[
              {
                required: true,
                message: "Please select package type!",
              },
            ]}
          >
            <Select
              options={[
                {
                  value: "GOODS",
                  label: "Goods",
                },
                {
                  value: "DOCUMENT",
                  label: "Document",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="weight"
            label="Weight (kg)"
            className="basis-[45%]"
            rules={[
              {
                required: true,
                message: "Please fill out this field!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="desPointId"
            label="Destination"
            className="basis-[45%]"
            rules={[{ required: true, message: "Please select destination!" }]}
          >
            <Select
              options={
                destinations &&
                destinations.map((d) => ({ value: d.id, label: d.name }))
              }
            />
          </Form.Item>
        </div>

        <Button type="primary" htmlType="submit" loading={loading}>
          Create
        </Button>
      </Form>
    </>
  );
}
