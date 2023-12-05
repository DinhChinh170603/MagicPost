import { Modal as AntModal, Button, Input, Select, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";
import service from "../helpers/service";

interface CreatePackageProps {
  departmentId: string;
}

const CreatePackage: React.FC<CreatePackageProps> = ({ departmentId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [senderName, setSenderName] = useState("");
  const [senderContact, setSenderContact] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverContact, setReceiverContact] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [desAddress, setDesAddress] = useState("");
  const [packageType, setPackageType] = useState("");
  const [weight, setWeight] = useState(0.0);

  const choosePackageType = (value: string) => {
    setPackageType(value);
  };

  const onFinish = () => {
    if (!senderName || !senderContact || !receiverName || !receiverContact || !orgAddress || !desAddress || !packageType || !weight) {
      toast.error("Please fill out every field");
      return;
    }

    setLoading(true);
    service
      .post(`/ex-employee/new-package`, {
        senderName: senderName,
        senderContact: senderContact,
        receiverName: receiverName,
        receiverContact: receiverContact,
        orgAddress: orgAddress,
        desAddress: desAddress,
        packageType: packageType,
        weight: weight,
        desPointId: departmentId,
      })
      .then((res) => {
        setLoading(false);
        if (res.data.status !== 201) {
          setLoading(false);
          setModalOpen(false);
          toast.error(res.data.message);
          //   onSubmit(); // to update the table by callback
          return;
        } else {
          setLoading(false);
          setModalOpen(false);
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response.data.message);
      });
    setSenderContact("");
    setSenderName("");
    setReceiverContact("");
    setReceiverName("");
    setOrgAddress("");
    setDesAddress("");
    setPackageType("");
    setWeight(0.0);
  };

  return (
    <>
      {loading && <Loading />}
      <Button type="primary" onClick={() => setModalOpen(true)}>
        Create a new package
      </Button>
      <AntModal
        width={screen.width / 2}
        style={{ top: 30 }}
        onOk={onFinish}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
      >
        <div className="text-2xl font-bold">Fill out this form</div>

        <div className="mt-4 flex flex-row gap-24">
          {/* Column 1: Sender Information */}
          <div className="w-[40%] mb-16 flex flex-col gap-3">
            <Typography.Text className="font-bold">Sender Name</Typography.Text>
            <Input required onChange={(e) => setSenderName(e.target.value)} />

            <Typography.Text className="font-bold">
              Sender Contact
            </Typography.Text>
            <Input
              required
              onChange={(e) => setSenderContact(e.target.value)}
            />

            <Typography.Text className="font-bold">
              Origin address
            </Typography.Text>
            <Input required onChange={(e) => setOrgAddress(e.target.value)} />

            <Typography.Text className="font-bold">
              Package Type
            </Typography.Text>
            <Select
              defaultValue="Type"
              onChange={choosePackageType}
              options={[
                { value: "DOCUMENT", label: "Document" },
                { value: "GOODS", label: "Goods" },
              ]}
            />
          </div>
          {/* Column 2: Receiver Information */}
          <div className="w-[40%] mb-16 flex flex-col gap-3">
            <Typography.Text className="font-bold">
              Receiver Name
            </Typography.Text>
            <Input required onChange={(e) => setReceiverName(e.target.value)} />
            <Typography.Text className="font-bold">
              Receiver Contact
            </Typography.Text>
            <Input
              required
              onChange={(e) => setReceiverContact(e.target.value)}
            />
            <Typography.Text className="font-bold">
              Destination address
            </Typography.Text>
            <Input required onChange={(e) => setDesAddress(e.target.value)} />
            <Typography.Text className="font-bold">Weight (kg)</Typography.Text>
            <Input
              required
              onChange={(e) => setWeight(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </AntModal>
    </>
  );
};

export default CreatePackage;
