import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InsertNewPointModal from "../components/InsertNewPointModal";
import SkeletonTable from "../components/SkeletonTable";
import { sortByString } from "../helpers/helpers";
import service from "../helpers/service";
import { PlusCircleOutlined } from "@ant-design/icons";

export default function ExchangePoints() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const [modalPointOpen, setModalPointOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
      width: "15%",
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
      title: "Link with Gather",
      dataIndex: "linkedGatherPoints",
      key: "linkedGatherPoints",
      width: "20%",
      render: (text: string, record: any) => {
        return record.linkedGatherPoint ? (
          <div
            onClick={() => {
              navigate(`/gather-points/${record.linkedGatherPoint.id}`, {
                state: { gatherPoint: record.linkedGatherPoint },
              });
            }}
          >
            {record.linkedGatherPoint.id}
          </div>
        ) : (
          ""
        );
      },
    },
  ];

  const pagination = {
    hideOnSinglePage: false,
    defaultPageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "30"],
    showTotal: (total: number, range: number[]) =>
      `${range[0]}-${range[1]} of ${total} items`,
  };

  useEffect(() => {
    setLoading(true);
    service
      .get("/leader/exchange-points")
      .then((res) => {
        if (res.data.status !== 200) {
          toast.error(res.data.message);
          setLoading(false);
          return;
        }
        setData(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err);
        setLoading(false);
      });
  }, [modalFinished]);

  const handleModalSubmit = () => {
    setModalFinished((prev) => !prev);
  };
  return (
    <div className="pb-4">
      <div className="flex">
        <div className="mb-4 ml-3 text-3xl font-bold">Exchange points</div>
        <Button
          type="primary"
          onClick={() => setModalPointOpen(true)}
          className="ml-auto mr-3 shadow-[0_2px_0_rgba(0,0,0,0.2),0_8px_16px_0_rgba(0,0,0,0.15)]"
          icon={<PlusCircleOutlined />}
        >
          Add new exchange point
        </Button>
      </div>
      <div className="rounded-xl bg-white p-3 shadow-lg">
        <SkeletonTable loading={loading} columns={columns}>
          <Table
            columns={columns}
            dataSource={data}
            rowKey={(record) => String(record.id)}
            pagination={pagination}
          />
        </SkeletonTable>
      </div>
      <InsertNewPointModal
        onSubmit={handleModalSubmit}
        apiEndpoint="/leader/exchange-point"
        isOpen={modalPointOpen}
        setModalOpen={setModalPointOpen}
      />
    </div>
  );
}
