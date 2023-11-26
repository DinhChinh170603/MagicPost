import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";
import service from "../helpers/service";
import { Button, Select, Modal as AntModal } from "antd";
import { TextField } from "@mui/material";

interface ModalProps {
  onSubmit: () => void;
  apiEndpoint: string;
}

const Modal: React.FC<ModalProps> = ({ onSubmit, apiEndpoint }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [manager, setManager] = useState("");
  const [location, setLocation] = useState("");

  const [isExchangePoint, setIsExchangePoint] = useState(false);
  

  const handleChange = (value: string) => {
    setLocation(value);
  };

  useEffect(() => {
    if (apiEndpoint === "/leader/exchange-point") {
      setIsExchangePoint(true);
    } else {
      setIsExchangePoint(false);
    }
  }, [apiEndpoint]);

  const onFinish = () => {
    if (!name || !location) {
      toast.error("Please fill out every field");
      return;
    }

    setLoading(true);

    service
      .post(apiEndpoint, {
        name: name,
        manager: {
          fullName: manager,
        },
        location: location,
      })
      .then((res) => {
        setLoading(false);
        if (res.data.status === 201) {
          console.log("OK");
          toast.success(res.data.message);
          setModalOpen(false);
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
      <Button type="primary" onClick={() => setModalOpen(true)}>
        Insert a new record
      </Button>
      <AntModal
        style={{ top: 30 }}
        visible={modalOpen}
        onOk={onFinish}
        open={modalOpen}
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
          {isExchangePoint ? (
            <TextField
            className="w-[60%]"
            required
            label="Manager"
            onChange={(e) => setManager(e.target.value)}
          />
          ) : null}
          
          {/* <TextField
            className="w-[60%]"
            required
            label="Location"
            onChange={(e) => setLocation(e.target.value)}
          /> */}
          <Select
            defaultValue="Location"
            className="w-[60%] h-10"
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
