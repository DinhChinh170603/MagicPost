import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Table } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BulkReceiveModal from "../components/BulkReceiveModal";
import SkeletonTable from "../components/SkeletonTable";
import Loading from "../helpers/Loading";
import { EE_ROLE } from "../helpers/constants";
import service from "../helpers/service";

export default function IncomingPackage(props: any) {
  const { role } = props;
  const [roleAPI, setRoleAPI] = useState("");

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [role, roleAPI]);

  const receive = (id: string) => {
    setProcessLoading(true);
    service
      .patch(roleAPI + `/receive/${id}`)
      .then((res) => {
        setProcessLoading(false);
        if (res.data.status !== 200) {
          toast.error(res.data.message);
          return;
        }
        toast.success(res.data.message);
        onConfirmSuccess(id);
      })
      .catch((err) => {
        setProcessLoading(false);
        toast.error(err.response.data.message);
      });
  };

  const onConfirmSuccess = (id: string) => {
    setData((data) => data.filter((item: any) => item.id !== id));
  };

  const pagination = {
    hideOnSinglePage: true,
    pageSize: 5,
    showTotal: (total: number, range: number[]) =>
      `${range[0]}-${range[1]} of ${total} items`,
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "From",
      dataIndex: "orgPointId",
      key: "orgPointId",
    },
    {
      title: "Timestamp",
      dataIndex: "status",
      key: "timestamp",
      render: (status: any[]) => {
        const timestampDetail = status.find((s) =>
          s.detail.includes("Gói hàng mới đã được ghi nhận tại điểm"),
        );
        if (timestampDetail) {
          const formattedTimestamp = moment(timestampDetail.timestamp).format(
            "DD-MM-YYYY [at] HH:mm:ss",
          );
          return formattedTimestamp;
        }
        return "";
      },
    },
    {
      title: "Package Type",
      dataIndex: "packageType",
      key: "packageType",
      filters: [
        {
          text: "GOODS",
          value: "GOODS",
        },
        {
          text: "DOCUMENT",
          value: "DOCUMENT",
        },
      ],
      onFilter: (value: any, record: any) =>
        record.packageType.indexOf(value) === 0,
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: any) => (
        <div className="flex w-[80%] justify-start gap-4">
          <Button
            type="primary"
            onClick={() => receive(record.id)}
            loading={loading}
          >
            Received
          </Button>
        </div>
      ),
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const results = data.filter((item: any) =>
      item.id
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim()),
    );

    if (results.length !== searchResult.length) {
      setSearchResult(results);
    }
  }, [searchQuery, data, searchResult]);

  return (
    <div className="w-full">
      {processLoading && <Loading />}
      <div className="flex">
        <div className="mb-4 ml-3 text-3xl font-bold">Incoming Package</div>
        <div className="ml-auto mr-3">
          <Button type="primary" onClick={loadData} loading={loading}>
            Reload
          </Button>
        </div>
      </div>

      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <div className="w-full rounded-xl bg-white p-3 shadow-lg">
          <div className="mb-4 flex w-full items-center justify-between gap-3 rounded-lg bg-white">
            <Input
              placeholder="Package ID"
              className="w-[30%] px-2 py-1"
              suffix={
                <div className="rounded-l px-2 py-1">
                  <SearchOutlined className="transition-all duration-300" />
                </div>
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="primary" onClick={() => setOpen(true)} loading={loading}>
              Bulk Receive
            </Button>
          </div>

          <SkeletonTable className="w-full" loading={loading} columns={columns}>
            <Table
              scroll={{ x: 800 }}
              className="w-full"
              columns={columns}
              dataSource={searchResult}
              pagination={pagination}
            />
          </SkeletonTable>
        </div>
      </div>
      <BulkReceiveModal
        open={open}
        setOpen={setOpen}
        roleAPI={roleAPI}
        data={data}
        onActionSuccess={onConfirmSuccess}
      />
    </div>
  );

  function loadData() {
    setLoading(true);
    if (role === EE_ROLE) {
      setRoleAPI("/ex-employee");
    } else if (role === "GATHER_EMPLOYEE") {
      setRoleAPI("/gth-employee");
    }

    if (roleAPI) {
      service
        .get(roleAPI + `/incoming-packages`)
        .then((res) => {
          if (res.data.status !== 200) {
            toast.error(res.data.message);
            setLoading(false);
            return;
          }
          const newData = res.data.results.map((item: { id: any }) => ({
            ...item,
            key: item.id,
          }));
          setData(newData);
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
  }
}

IncomingPackage.propTypes = {
  role: PropTypes.string,
};
