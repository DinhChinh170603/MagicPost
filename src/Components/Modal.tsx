import React, { useState } from "react";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";
import service from "../helpers/service";
import { Button, Modal as AntModal } from "antd";
import { TextField } from "@mui/material";
import { Select } from 'antd';

const Modal: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const handleChange = (value: string) => {
    setLocation(value);
  };

  const onFinish = () => {
    if (!name || !location) {
      toast.error("Please fill out every fields");
      return;
    }

    setLoading(true);

    service
      .post("/leader/exchange-point", {
        name: name,
        location: location,
      })
      .then((res) => {
        setLoading(false);
        if (res.data.status === 201) {
          console.log("OK");
          toast.success(res.data.message);
          setModalOpen(false);
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
      <Button type="primary" onClick={() => setModalOpen(true)}>
        Insert a new record
      </Button>
      <AntModal
        style={{ top: 30 }}
        visible={modalOpen}
        onOk={onFinish}
        onCancel={() => setModalOpen(false)}
      >
        <div className="text-2xl font-bold">Fill out this form</div>
        <div className="mt-4 flex flex-col gap-4">
          <TextField
            className="w-[60%]"
            required
            label="Name"
            onChange={(e) => setName(e.target.value)}
          />
          {/* <TextField
            className="w-[60%]"
            required
            label="Location"
            onChange={(e) => setLocation(e.target.value)}
          /> */}
          <Select
            defaultValue="Location"
            className="w-[60%] h-15"
            onChange={handleChange}
            options={[
              { value: "Hà Nội", label: "Hà Nội" },
              { value: "Hải Phòng", label: "Hải Phòng" },
              { value: "Vinh", label: "Vinh" },
              { value: "Biên Hòa", label: "Biên Hòa" },
              { value: "Đà Nẵng", label: "Đà Nẵng" },
              { value: "Hồ Chí Minh", label: "Hồ Chí Minh" },
            ]}
          />
        </div>
      </AntModal>
    </>
  );
};

export default Modal;
