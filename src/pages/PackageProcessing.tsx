import { useEffect, useState, useRef, SetStateAction } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import service from "../helpers/service";
import { Button, Input, Space, Table } from "antd";
import SkeletonTable from "../components/SkeletonTable";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import moment from "moment";
import DeliveryFailureModal from "../components/DeliveryFailureModal";
import download from "downloadjs";
import InvoicePrintModal from "../components/InvoicePrintModal";
import { FiPrinter } from "react-icons/fi";
import { EE_ROLE } from "../helpers/constants";
export default function PackageProcessing(props: any) {
  const { role } = props;
  const [roleAPI, setRoleAPI] = useState("");

  const [open, setOpen] = useState(false);

  const [data, setData] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [search, setSearch] = useState({
    dataIndex: "",
    searchText: "",
  });
  const idSearchInput = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [modalReasonOpen, setModalReasonOpen] = useState(false);
  const [modalFinished, setModalFinished] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setModalLoading(true);
    if (role === EE_ROLE) {
      setRoleAPI("/ex-employee");
    } else if (role === "GATHER_EMPLOYEE") {
      setRoleAPI("/gth-employee");
    }

    if (roleAPI) {
      service
        .get(roleAPI + `/pending-packages`)
        .then((res) => {
          if (res.data.status !== 200) {
            toast.error(res.data.message);
            setLoading(false);
            setModalLoading(false);
            return;
          }
          const newData = res.data.results.map((item: { id: any }) => ({
            ...item,
            key: item.id,
          }));
          setData(newData);
          setLoading(false);
          setModalLoading(false);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setLoading(false);
          setModalLoading(false);
        });
    }
    setCurrentPage(1);
  }, [role, roleAPI, modalFinished]);

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

  // searchInColumn
  const handleSearch = (
    selectedKeys: any[],
    confirm: { (): void; (): void; (): void },
    dataIndex: string,
  ) => {
    confirm();
    setSearch({ dataIndex, searchText: selectedKeys[0] });

    // Get index of searched data's list
    const dataIndexIndex = data.findIndex(
      (item) => item[dataIndex] === selectedKeys[0],
    );

    // Check if it is founded
    if (dataIndexIndex !== -1) {
      const searchedPage = Math.ceil((dataIndexIndex + 1) / 5);

      // Update current page
      setCurrentPage(searchedPage);
    } else {
      console.log(
        `The searched id ${selectedKeys[0]} is not found in the data.`,
      );
    }
  };
  const handleResetId = (clearFilters: { (): void; (): void }) => {
    clearFilters();
    setSearch({ ...search, searchText: "" });
  };
  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }: {
      setSelectedKeys: (keys: string[]) => void;
      selectedKeys: string[];
      confirm: () => void;
      clearFilters: () => void;
      close: () => void;
    }) => (
      <div className="p-2">
        <Input
          ref={dataIndex === "id" ? idSearchInput : null}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          className="mb-4 block"
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            className="w-[90px]"
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleResetId(clearFilters)}
            size="small"
            className="w-[90px]"
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        setTimeout(
          () => (dataIndex === "id" ? idSearchInput : null)?.select(),
          100,
        );
      }
    },
    render: (text: { toString: () => string }) =>
      search.dataIndex === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[search.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // Handling operations
  const handleOperation = (apiEndpoint: string) => {
    setLoading(true);

    const sendRequests = selectedRowKeys.map((packageId) => {
      if (apiEndpoint === "report") {
        return service.get(roleAPI + `/${apiEndpoint}/` + packageId);
      } else {
        return service.patch(roleAPI + `/${apiEndpoint}/` + packageId);
      }
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

  const handleModalSubmit = () => {
    setModalFinished((prev) => !prev);
    setSelectedRowKeys([]);
  };

  const pagination = {
    hideOnSinglePage: true,
    pageSize: 5,
    current: currentPage,
    showTotal: (total: number, range: number[]) =>
      `${range[0]}-${range[1]} of ${total} items`,
  };

  const [selectedData, setSelectedData] = useState(null);

  const handlePrint = (rowData) => {
    setOpen(true);
    setSelectedData(rowData);
  };

  const columns = [
    ...(role === EE_ROLE
    ? [
        {
          title: "Print",
          key: "print",
          render: (text: any, record: any) => (
            <div>
              <FiPrinter size={20} className="text-btnColor hover:text-btnHover" onClick={() => handlePrint(record)}></FiPrinter>
            </div>
          ),
        },
      ]
    : []),
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
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
      title: "Next Destination",
      key: "nextDestination",
    },
    {
      title: "Action",
      key: "action",
    },
  ];

  const [downloadLoading, setDownloadLoading] = useState(false);

  const downloadReport = () => {
    setDownloadLoading(true);
    service
      .get(roleAPI + "/report/" + selectedRowKeys[0], {
        responseType: "arraybuffer",
      })
      .then((res) => {
        download(res.data, "report.pdf", res.headers["content-type"]);
        setDownloadLoading(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setLoading(false);
      });
  };

  return (
    <div className="w-full">
      <div className="flex">
        <div className="mb-4 ml-3 text-3xl font-bold">Package Processing</div>
        <div className="ml-auto mr-3">
          <Button
            type="primary"
            onClick={start}
            loading={loading}
          >
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
        <div className="flex w-[80%] justify-start gap-4">
          {role === EE_ROLE ? (
            <>
              <Button
                type="primary"
                onClick={() => handleOperation("send")}
                // disabled={!hasSelected}
                loading={loading}
              >
                Sent To GatherPoint
              </Button>
              <Button
                type="primary"
                onClick={() => handleOperation("send-receiver")}
                // disabled={!hasSelected}
                loading={loading}
              >
                Sent To Receiver
              </Button>
              <Button
                type="primary"
                onClick={() => handleOperation("confirm-receiver")}
                // disabled={!hasSelected}
                loading={loading}
              >
                Delivery Success
              </Button>
              <Button
                type="primary"
                onClick={() => setModalReasonOpen(true)}
                // disabled={!hasSelected}
                loading={loading || modalLoading}
              >
                Delivery Failure
              </Button>
              <Button
                type="primary"
                onClick={() => downloadReport()}
                // disabled={!hasSelected}
                loading={loading || downloadLoading}
              >
                {downloadLoading ? "Downloading" : "Export Invoice"}
              </Button>
              <DeliveryFailureModal
                onSubmit={handleModalSubmit}
                packageIds={selectedRowKeys}
                isOpen={modalReasonOpen}
                setModalOpen={setModalReasonOpen}
              />
            </>
          ) : null}
          {role === "GATHER_EMPLOYEE" ? (
            <>
              <Button
                type="primary"
                onClick={() => handleOperation("sent/gather")}
                // disabled={!hasSelected}
                loading={loading}
              >
                Forward to GatherPoint
              </Button>
              <Button
                type="primary"
                onClick={() => handleOperation("sent/exchange")}
                // disabled={!hasSelected}
                loading={loading}
              >
                Forward to ExchangePoint
              </Button>
            </>
          ) : null}
        </div>
        <div className="rounded-xl bg-white p-3 shadow-lg w-full">
          <SkeletonTable className="w-full" loading={loading} columns={columns}>
            <Table
              className="w-full"
              // rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
              pagination={pagination}
              idSearchInput={idSearchInput}
              onChange={(pagination) => setCurrentPage(pagination.current)}
            />
          </SkeletonTable>
        </div>
        <InvoicePrintModal open={open} setOpen={setOpen} data={selectedData} />
      </div>
    </div>
  );
}

PackageProcessing.propTypes = {
  role: PropTypes.string,
};
