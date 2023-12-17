import { Table, Button, Space, Descriptions, Input } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import SkeletonTable from "../components/SkeletonTable";
import service from "../helpers/service";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

export default function DeliveryStatus(props: any) {
  const { role } = props;

  const [succeedPackages, setSucceedPackages] = useState([]);
  const [rejectedPackages, setRejectedPackages] = useState([]);

  const [searchSucceed, setSearchSucceed] = useState({
    dataIndex: "",
    searchText: "",
  });
  const idSearchInputSucceed = useRef(null);
  const [currentPageOfSucceed, setCurrentPageOfSucceed] = useState(1);

  const [searchRejected, setSearchRejected] = useState({
    dataIndex: "",
    searchText: "",
  });
  const idSearchInputRejected = useRef(null);
  const [currentPageOfRejected, setCurrentPageOfRejected] = useState(1);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let roleApiPrefix = "";
    if (role === "EXCHANGE_EMPLOYEE") {
      roleApiPrefix = "/ex-employee";
    } else if (role === "EXCHANGE_MANAGER") {
      roleApiPrefix = "/ex-manager";
    }

    if (roleApiPrefix) {
      axios
        .all([
          service.get(roleApiPrefix + `/successful-packages`),
          service.get(roleApiPrefix + `/rejected-packages`),
        ])
        .then(
          axios.spread((res1, res2) => {
            const newData1 = res1.data.results.map((item: { id: any }) => ({
              ...item,
              key: item.id,
            }));
            setSucceedPackages(newData1);
            const newData2 = res2.data.results.map((item: { id: any }) => ({
              ...item,
              key: item.id,
            }));
            setRejectedPackages(newData2);
            setLoading(false);
          }),
          () => {
            setLoading(false);
            toast.error("Something went wrong");
          },
        )
        .catch((err) => {
          setLoading(false);
          toast.error(err.response.data.message);
        });
      setCurrentPageOfSucceed(1);
      setCurrentPageOfRejected(1);
    }
  }, [role]);

  // Search succeedPackages
  const handleSearchSucceed = (
    selectedKeys: any[],
    confirm: () => void,
    dataIndex: string,
  ) => {
    confirm();
    setSearchSucceed({ dataIndex, searchText: selectedKeys[0] });

    // Get index of searched data's list
    const dataIndexIndex = succeedPackages.findIndex(
      (item) => item[dataIndex] === selectedKeys[0],
    );

    // Check if it is founded
    if (dataIndexIndex !== -1) {
      const searchedPage = Math.ceil((dataIndexIndex + 1) / 5);

      // Update current page
      setCurrentPageOfSucceed(searchedPage);
    }
  };
  const handleResetIdSucceed = (clearFilters: () => void) => {
    clearFilters();
    setSearchSucceed({ ...searchSucceed, searchText: "" });
  };
  const getColumnSearchPropsSucceed = (dataIndex: string) => ({
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
          ref={dataIndex === "id" ? idSearchInputSucceed : null}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearchSucceed(selectedKeys, confirm, dataIndex)
          }
          className="mb-4 block"
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearchSucceed(selectedKeys, confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            className="w-[90px]"
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleResetIdSucceed(clearFilters)}
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
          () => (dataIndex === "id" ? idSearchInputSucceed : null)?.select(),
          100,
        );
      }
    },
    render: (text: { toString: () => string }) =>
      searchSucceed.dataIndex === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchSucceed.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // Search rejectedPackages
  const handleSearchRejected = (
    selectedKeys: any[],
    confirm: () => void,
    dataIndex: string,
  ) => {
    confirm();
    setSearchRejected({ dataIndex, searchText: selectedKeys[0] });

    // Get index of searched data's list
    const dataIndexIndex = rejectedPackages.findIndex(
      (item) => item[dataIndex] === selectedKeys[0],
    );

    // Check if it is founded
    if (dataIndexIndex !== -1) {
      const searchedPage = Math.ceil((dataIndexIndex + 1) / 5);

      // Update current page
      setCurrentPageOfRejected(searchedPage);
    }
  };
  const handleResetIdRejected = (clearFilters: () => void) => {
    clearFilters();
    setSearchRejected({ ...searchRejected, searchText: "" });
  };
  const getColumnSearchPropsRejected = (dataIndex: string) => ({
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
          ref={dataIndex === "id" ? idSearchInputRejected : null}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearchRejected(selectedKeys, confirm, dataIndex)
          }
          className="mb-4 block"
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearchRejected(selectedKeys, confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            className="w-[90px]"
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleResetIdRejected(clearFilters)}
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
          () => (dataIndex === "id" ? idSearchInputRejected : null)?.select(),
          100,
        );
      }
    },
    render: (text: { toString: () => string }) =>
      searchRejected.dataIndex === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchRejected.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const paginationOfSucceed = {
    hideOnSinglePage: true,
    pageSize: 5,
    current: currentPageOfSucceed,
    showTotal: (total: number, range: number[]) =>
      `${range[0]}-${range[1]} of ${total} items`,
  };

  const paginationOfRejected = {
    hideOnSinglePage: true,
    pageSize: 5,
    current: currentPageOfRejected,
    showTotal: (total: number, range: number[]) =>
      `${range[0]}-${range[1]} of ${total} items`,
  };

  const columnsSucceed = [
    {
      title: "Package ID",
      dataIndex: "id",
      key: "id",
      width: "25%",
      ...getColumnSearchPropsSucceed("id"),
    },
    {
      title: "Receiver Name",
      dataIndex: "receiverName",
      key: "receiverName",
      width: "25%",
    },
    {
      title: "Last Status",
      dataIndex: "lastStatus",
      key: "lastStatus",
      width: "50%",
    },
  ];

  const columnsRejected = [
    {
      title: "Package ID",
      dataIndex: "id",
      key: "id",
      width: "25%",
      ...getColumnSearchPropsRejected("id"),
    },
    {
      title: "Receiver Name",
      dataIndex: "receiverName",
      key: "receiverName",
      width: "28%",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      width: "47%",
    },
  ];

  type PackageDetail = {
    key: number;
    label: string;
    children: React.ReactNode;
    span: number;
  };

  const packageDetailSucceed = (pkg: any): PackageDetail[] => [
    {
      key: 1,
      label: "senderName",
      children: pkg.senderName,
      span: 1.5,
    },
    {
      key: 2,
      label: "receiverName",
      children: pkg.receiverName,
      span: 1.5,
    },
    {
      key: 3,
      label: "senderContact",
      children: pkg.senderContact,
      span: 1.5,
    },
    {
      key: 4,
      label: "receiverContact",
      children: pkg.receiverContact,
      span: 1.5,
    },
    {
      key: 5,
      label: "orgAddress",
      children: pkg.orgAddress,
      span: 1.5,
    },
    {
      key: 6,
      label: "desAddress",
      children: pkg.desAddress,
      span: 1.5,
    },
    {
      key: 7,
      label: "packageType",
      children: pkg.packageType,
      span: 1.5,
    },
    {
      key: 8,
      label: "weight (kg)",
      children: pkg.weight,
      span: 1.5,
    },
    {
      key: 9,
      label: "lastStatus",
      children: pkg.status[pkg.status.length - 1]
        ? pkg.status[pkg.status.length - 1].detail
        : "",
      span: 3,
    },
  ];

  const packageDetailRejected = (pkg: any): PackageDetail[] => [
    {
      key: 1,
      label: "senderName",
      children: pkg.senderName,
      span: 1.5,
    },
    {
      key: 2,
      label: "receiverName",
      children: pkg.receiverName,
      span: 1.5,
    },
    {
      key: 3,
      label: "senderContact",
      children: pkg.senderContact,
      span: 1.5,
    },
    {
      key: 4,
      label: "receiverContact",
      children: pkg.receiverContact,
      span: 1.5,
    },
    {
      key: 5,
      label: "orgAddress",
      children: pkg.orgAddress,
      span: 1.5,
    },
    {
      key: 6,
      label: "desAddress",
      children: pkg.desAddress,
      span: 1.5,
    },
    {
      key: 7,
      label: "packageType",
      children: pkg.packageType,
      span: 1.5,
    },
    {
      key: 8,
      label: "weight (kg)",
      children: pkg.weight,
      span: 1.5,
    },
    {
      key: 9,
      label: "lastStatus",
      children: pkg.status[pkg.status.length - 1]
        ? pkg.status[pkg.status.length - 1].detail
        : "",
      span: 3,
    },
  ];

  const dataSucceed = succeedPackages.map((pkg: any) => ({
    key: pkg.id,
    id: pkg.id,
    receiverName: pkg.receiverName,
    lastStatus: pkg.status[pkg.status.length - 1]
      ? pkg.status[pkg.status.length - 1].detail
      : "",
    description: (
      <Descriptions size="small" bordered items={packageDetailSucceed(pkg)} />
    ),
  }));

  const dataRejected = rejectedPackages.map((pkg: any) => ({
    key: pkg.id,
    id: pkg.id,
    receiverName: pkg.receiverName,
    reason: pkg.rejectDetails[pkg.rejectDetails.length - 1]
      ? pkg.rejectDetails[pkg.rejectDetails.length - 1].reason
      : "",
    description: (
      <Descriptions size="small" bordered items={packageDetailRejected(pkg)} />
    ),
  }));

  return (
    <>
      <div className="flex h-full w-full">
        <div className="mx-auto mt-8 flex w-[98%]">
          <div className="relative flex flex-grow gap-4">
            <div className="w-1/2">
              <div className="flex w-full flex-col gap-4">
                <div className="text-[22px] font-bold">
                  Successful Deliveries
                </div>
                <SkeletonTable loading={loading} columns={columnsSucceed}>
                  <Table
                    className="w-full"
                    columns={columnsSucceed}
                    expandable={{
                      expandedRowRender: (record) => (
                        <p style={{ margin: 0 }}>{record.description}</p>
                      ),
                      rowExpandable: (record) => record.description !== "",
                    }}
                    dataSource={dataSucceed}
                    pagination={paginationOfSucceed}
                    idSearchInput={idSearchInputSucceed}
                    onChange={(pagination) =>
                      setCurrentPageOfSucceed(pagination.current)
                    }
                  />
                </SkeletonTable>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex w-full flex-col gap-4">
                <div className="text-[22px] font-bold">Failed Deliveries</div>
                <SkeletonTable loading={loading} columns={columnsRejected}>
                  <Table
                    className="w-full"
                    columns={columnsRejected}
                    expandable={{
                      expandedRowRender: (record) => (
                        <p style={{ margin: 0 }}>{record.description}</p>
                      ),
                      rowExpandable: (record) => record.description !== "",
                    }}
                    dataSource={dataRejected}
                    pagination={paginationOfRejected}
                    idSearchInput={idSearchInputRejected}
                    onChange={(pagination) =>
                      setCurrentPageOfRejected(pagination.current)
                    }
                  />
                </SkeletonTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

DeliveryStatus.propTypes = {
  role: PropTypes.string,
};
