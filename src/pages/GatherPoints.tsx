import { Button, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EstablishConnectionModal from "../components/EstablishConnectionModal";
import InsertNewPointModal from "../components/InsertNewPointModal";
import SkeletonTable from "../components/SkeletonTable";
import { sortByString } from "../helpers/helpers";
import service from "../helpers/service";
import { PlusCircleOutlined, LinkOutlined } from "@ant-design/icons";

const pagination = {
  hideOnSinglePage: false,
  defaultPageSize: 10,
  showSizeChanger: true,
  pageSizeOptions: ["5", "10", "20", "30"],
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
      dataIndex: "id",
      key: "id",
      sorter: sortByString("id"),
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
              className="hover:cursor-pointer"
            >
              {exchangePoint.id}
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
    setModalFinished((prev) => !prev);
  };
  return (
    <div className="pb-4">
      <div className="flex">
        <div className="mb-4 ml-3 text-3xl font-bold">Gather points</div>
        <div className="ml-auto mr-3 flex gap-3">
          <Button
            onClick={() => setModalLinkOpen(true)}
            loading={modalLoading}
            className="shadow-[0_2px_0_rgba(0,0,0,0.2),0_8px_16px_0_rgba(0,0,0,0.15)]"
            icon={<LinkOutlined />}
          >
            Establish Connection
          </Button>
          <Button
            type="primary"
            onClick={() => setModalPointOpen(true)}
            className="shadow-[0_2px_0_rgba(0,0,0,0.2),0_8px_16px_0_rgba(0,0,0,0.15)]"
            icon={<PlusCircleOutlined />}
          >
            Insert a new point
          </Button>
        </div>
      </div>
      <div className="rounded-xl bg-white p-3 shadow-lg">
        <SkeletonTable loading={tableLoading} columns={columns}>
          <Table
            scroll={{ x: 800 }}
            columns={columns}
            dataSource={gatherPointsList}
            rowKey={(record) => String(record.id)}
            pagination={pagination}
          />
        </SkeletonTable>
      </div>
      <EstablishConnectionModal
        onSubmit={handleModalSubmit}
        exchangePointsList={exchangePointsList}
        gatherPointsList={gatherPointsList}
        isOpen={modalLinkOpen}
        setModalOpen={setModalLinkOpen}
      />
      <InsertNewPointModal
        onSubmit={handleModalSubmit}
        apiEndpoint="/leader/gather-point"
        isOpen={modalPointOpen}
        setModalOpen={setModalPointOpen}
      />
    </div>
  );
}
