import { useEffect, useState, useRef, SetStateAction } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import service from "../helpers/service";
import { Button, Input, Space, Table } from "antd";
import SkeletonTable from "../components/SkeletonTable";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import moment from "moment";
import { EE_ROLE } from "../helpers/constants";
import { Form } from "antd";

export default function IncomingPackage(props: any) {
  const { role } = props;
  const [roleAPI, setRoleAPI] = useState("");

  const [data, setData] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [search, setSearch] = useState({
    dataIndex: "",
    searchText: "",
  });
  const idSearchInput = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    setCurrentPage(1);
  }, [role, roleAPI]);

  // rowSelection
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys: SetStateAction<never[]>) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  // Handling operations
  const handleOperation = (apiEndpoint: string, record: any) => {
    setLoading(true);

    if (role === EE_ROLE) {
      setRoleAPI("/ex-employee");
    } else if (role === "GATHER_EMPLOYEE") {
      setRoleAPI("/gth-employee");
    }

    const sendRequests = [record.id].map((packageId) => {
      return service.patch(roleAPI + `/${apiEndpoint}/` + packageId);
    });

    Promise.all(sendRequests)
      .then((responses) => {
        setLoading(false);

        responses.forEach((res) => {
          if (res.data.status === 200) {
            toast.success(res.data.message);
            setSelectedRowKeys([]);
          } else {
            toast.error(res.data.message);
          }
        });
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response.data.message);
      });
  };

  const pagination = {
    hideOnSinglePage: true,
    pageSize: 5,
    current: currentPage,
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
          {role === EE_ROLE && (
            <Button
              type="primary"
              onClick={() => handleOperation("receive", record)}
              loading={loading}
            >
              Confirmed from GatherPoint
            </Button>
          )}
          {role === "GATHER_EMPLOYEE" && (
            <>
              <Button
                type="primary"
                onClick={() => handleOperation("received/gather", record)}
                loading={loading}
              >
                Confirm from GatherPoint
              </Button>
              <Button
                type="primary"
                onClick={() => handleOperation("received/exchange", record)}
                loading={loading}
              >
                Confirm from ExchangePoint
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const results = data.filter((item) =>
      item.id.toString().includes(searchQuery)
    );
  
    if (results.length !== searchResult.length) {
      setSearchResult(results);
    }
  }, [searchQuery, data, searchResult]);

  return (
    <div className="w-full">
      <div className="flex">
        <div className="mb-4 ml-3 text-3xl font-bold">Incoming Package</div>
        <div className="ml-auto mr-3">
          <Button type="primary" onClick={start} loading={loading}>
            Reload
          </Button>
        </div>
      </div>

      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <div className="flex w-[80%] justify-start gap-4">
          <div className="mt-1">
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
          </div>
        </div>
        <div className="w-full rounded-xl bg-white p-3 shadow-lg">
          <Form className="flex items-center justify-center mt-1">
          <Form.Item className="basis-[90%] mx-auto md:basis-[60%] xl:basis-[40%]">
            <Input
              placeholder="Package ID"
              className="px-2 py-1 text-lg"
              suffix={
                <div className="rounded-l px-2 py-1">
                  <SearchOutlined className="transition-all duration-300" />
                </div>
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            ></Input>
          </Form.Item>
        </Form>
          
          <SkeletonTable className="w-full" loading={loading} columns={columns}>
            <Table
              scroll={{ x: 800 }}
              className="w-full"
              // rowSelection={rowSelection}
              columns={columns}
              dataSource={searchResult}
              pagination={pagination}
              idSearchInput={idSearchInput}
              onChange={(pagination) =>
                setCurrentPage(pagination.current)
              }
            />
          </SkeletonTable>
        </div>
      </div>
    </div>
  );
}

IncomingPackage.propTypes = {
  role: PropTypes.string,
};
