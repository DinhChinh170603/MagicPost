import React, { useState } from "react";
import { Button, Modal as AntModal } from "antd";
import { TextField } from "@mui/material";

const Modal: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  return (
    <>
      <Button type="primary" onClick={() => setModalOpen(true)}>
        Insert a new record
      </Button>
      <AntModal
        style={{ top: 30 }}
        visible={modalOpen}
        onOk={() => setModalOpen(false)}
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
        <TextField
          className="w-[60%]"
          required
          label="Location"
          onChange={(e) => setLocation(e.target.value)}
        />
        </div>
      </AntModal>
    </>
  );
};

export default Modal;
