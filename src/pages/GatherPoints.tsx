import { Button, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EstablishConnectionModal from "../components/EstablishConnectionModal";
import InsertNewPointModal from "../components/InsertNewPointModal";
import SkeletonTable from "../components/SkeletonTable";
import { sortByString } from "../helpers/helpers";
import service from "../helpers/service";

const pagination = {
  hideOnSinglePage: true,
  pageSize: 5,
  showTotal: (total: number, range: number[]) =>
    `${range[0]}-${range[1]} of ${total} items`,
};

export default function GatherPoints() {
  const navigate = useNavigate();
  const [exchangePointsList, setExchangePointsList] = useState([]);
  const [gatherPointsList, setGatherPointsList] = useState([]);

  const [modalPointOpen, setModalPointOpen] = useState(false);
  const [modalLinkOpen, setModalLinkOpen] = useState(false);

  const [tableLoading, setTableLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalFinished, setModalFinished] = useState(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: sortByString("name"),
      width: "15%",
    },
    {
      title: "Manager",
      dataIndex: "manager",
      key: "manager",
      width: "20%",
      render: (text: string, record: any) => record.manager?.fullName,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      sorter: sortByString("location"),
      width: "20%",
      filters: [
        {
          text: "Hải Phòng",
          value: "Hải Phòng",
        },
        {
          text: "Vinh",
          value: "Vinh",
        },
        {
          text: "Hà Nội",
          value: "Hà Nội",
        },
        {
          text: "Biên Hòa",
          value: "Biên Hòa",
        },
        {
          text: "Hồ Chí Minh",
          value: "Hồ Chí Minh",
        },
      ],
      onFilter: (value: any, record: any) =>
        record.location.indexOf(value) === 0,
    },
    {
      title: "Linked Exchange Points",
      dataIndex: "linkedExchangePoints",
      key: "linkedExchangePoints",
      render: (linkedExchangePoints: any) => (
        <span>
          {linkedExchangePoints.map((exchangePoint: any) => (
            <Tag
              key={exchangePoint.id}
              onClick={() => {
                navigate(`/exchange-points/${exchangePoint.id}`, {
                  state: { exchangePoint: exchangePoint },
                });
              }}
            >
              {exchangePoint.name}
            </Tag>
          ))}
        </span>
      ),
    },
  ];

  useEffect(() => {
    setTableLoading(true);
    setModalLoading(true);
    service
      .get("/leader/gather-points")
      .then(
        (res) => {
          setTableLoading(false);
          setGatherPointsList(res.data.results);
        },
        (rej) => {
          setTableLoading(false);
          toast.error("Something went wrong", rej);
        },
      )
      .catch((err) => {
        setTableLoading(false);
        toast.error(err.response.data.message);
      });

    service
      .get("/leader/exchange-points")
      .then(
        (res) => {
          setModalLoading(false);
          setExchangePointsList(res.data.results);
        },
        (rej) => {
          setModalLoading(false);
          toast.error("Something went wrong", rej);
        },
      )
      .catch((err) => {
        setModalLoading(false);
        toast.error(err.response.data.message);
      });
  }, [modalFinished]);

  const handleModalSubmit = () => {
    console.log("Submit from GatherPoints");
    setModalFinished((prev) => !prev);
  };

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-lime-100">
        <div className="flex w-[80%] justify-start gap-4">
          <Button type="primary" onClick={() => setModalPointOpen(true)}>
            Insert a new point
          </Button>
          <InsertNewPointModal
            onSubmit={handleModalSubmit}
            apiEndpoint="/leader/gather-point"
            isOpen={modalPointOpen}
            setModalOpen={setModalPointOpen}
          />
          <Button
            type="primary"
            onClick={() => setModalLinkOpen(true)}
            loading={modalLoading}
          >
            Establish Connection
          </Button>
          <EstablishConnectionModal
            onSubmit={handleModalSubmit}
            exchangePointsList={exchangePointsList}
            gatherPointsList={gatherPointsList}
            isOpen={modalLinkOpen}
            setModalOpen={setModalLinkOpen}
          />
        </div>
        <SkeletonTable
          className="w-[80%]"
          loading={tableLoading}
          columns={columns}
        >
          <Table
            className="w-[80%]"
            columns={columns}
            dataSource={gatherPointsList}
            rowKey={(record) => String(record.id)}
            pagination={pagination}
          />
        </SkeletonTable>
      </div>
    </>
  );
}
