import { LinkOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table, Tag, Tooltip, Input } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EstablishConnectionModal from "../components/EstablishConnectionModal";
import InsertNewPointModal from "../components/InsertNewPointModal";
import SkeletonTable from "../components/SkeletonTable";
import { sortByString } from "../helpers/helpers";
import { SearchOutlined } from "@ant-design/icons";
import service from "../helpers/service";
import { AiOutlineDelete } from "react-icons/ai";

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
  const [gatherPointsList, setGatherPointsList] = useState<any>([]);

  const [modalPointOpen, setModalPointOpen] = useState(false);
  const [modalLinkOpen, setModalLinkOpen] = useState(false);

  const [tableLoading, setTableLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const removePoint = (id: string) => {
    setTableLoading(true);
    service
      .delete(`/leader/gather-point/${id}`)
      .then((res) => {
        setTableLoading(false);
        if (res.status === 200) {
          toast.success(res.data.message);
          setGatherPointsList((data: any) =>
            data.filter((item: any) => item.id !== id),
          );
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setTableLoading(false);
      });
  };

  const onAddPointSuccess = (point: any) => {
    setGatherPointsList([point, ...gatherPointsList]);
  };

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
              navigate(`/gather-points/${record.id}`, {
                state: { gatherPoint: record },
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
              className="hover:cursor-pointer hover:font-bold hover:text-btnColor"
            >
              {exchangePoint.id}
            </Tag>
          ))}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_text: string, record: any) => {
        return (
          <div className="flex justify-center">
            <Tooltip title="Remove point">
              <Popconfirm
                title="Remove gather point"
                description="Are you sure you want to remove this gather point?"
                onConfirm={() => removePoint(record.id)}
                placement="left"
                okText="Yes"
                cancelText="No"
              >
                <AiOutlineDelete
                  color="red"
                  size={20}
                  className="cursor-pointer"
                />
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
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
          setGatherPointsList(res.data.results.reverse());
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
  }, []);


  //search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const results = gatherPointsList.filter((item: any) =>
      item.id
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim()),
    );

    if (results.length !== searchResult.length) {
      setSearchResult(results);
    }
  }, [searchQuery, gatherPointsList]);

  return (
    <div className="pb-4">
      <div className="mb-4 flex max-md:flex-col max-md:gap-4">
        <div className=" ml-3 text-3xl font-bold">Gather points</div>
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
        <div className="mb-4 flex w-full items-center justify-center rounded-lg bg-white">
          <Input
            placeholder="Name GatherPoint"
            className="w-[97%] px-2 py-1 md:w-[30%]"
            suffix={
              <div className="rounded-l px-2 py-1">
                <SearchOutlined className="transition-all duration-300" />
              </div>
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <SkeletonTable loading={tableLoading} columns={columns}>
          <Table
            scroll={{ x: 800 }}
            columns={columns}
            dataSource={searchResult}
            rowKey={(record) => String(record.id)}
            pagination={pagination}
          />
        </SkeletonTable>
      </div>
      <EstablishConnectionModal
        exchangePointsList={exchangePointsList}
        gatherPointsList={gatherPointsList}
        isOpen={modalLinkOpen}
        setModalOpen={setModalLinkOpen}
      />
      <InsertNewPointModal
        apiEndpoint="/leader/gather-point"
        isOpen={modalPointOpen}
        setModalOpen={setModalPointOpen}
        onAddPointSuccess={onAddPointSuccess}
      />
    </div>
  );
}
