import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InsertNewPointModal from "../components/InsertNewPointModal";
import SkeletonTable from "../components/SkeletonTable";
import { sortByString } from "../helpers/helpers";
import service from "../helpers/service";

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
      render: (_text: string, record: any) => {
        return (
          <div
            onClick={() => {
              navigate(`/exchange-points/${record.id}`, {
                state: { exchangePoint: record },
              });
            }}
            className="cursor-pointer hover:text-btnColor"
          >
            {record.id}
          </div>
        );
      },
    },
    {
      title: "Manager",
      dataIndex: "manager",
      key: "manager",
      sorter: sortByString("manager"),
      render: (_text: string, record: any) => record.manager?.fullName,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      sorter: sortByString("location"),
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
      title: "Linked Gather Point",
      dataIndex: "linkedGatherPoints",
      key: "linkedGatherPoints",
      render: (_text: string, record: any) => {
        return record.linkedGatherPoint ? (
          <Tag
            onClick={() => {
              navigate(`/gather-points/${record.linkedGatherPoint.id}`, {
                state: { gatherPoint: record.linkedGatherPoint },
              });
            }}
            className="hover:cursor-pointer hover:font-bold hover:text-btnColor"
          >
            {record.linkedGatherPoint.id}
          </Tag>
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
        setData(res.data.results.reverse());
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
      <div className="mb-4 flex max-md:flex-col max-md:gap-4">
        <div className="ml-3 text-3xl font-bold">Exchange points</div>
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
            scroll={{ x: 800 }}
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
