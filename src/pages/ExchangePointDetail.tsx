import {
  Table,
  Button,
  Space,
  Descriptions,
  Input,
  DescriptionsProps,
} from "antd";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import SkeletonTable from "../components/SkeletonTable";
import service from "../helpers/service";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

export default function ExchangePointDetail() {
  const { state } = useLocation();
  const { exchangePoint } = state;

  const [sentPackages, setSentPackages] = useState([]);
  const [receivedPackages, setReceivedPackages] = useState([]);

  const [searchSent, setSearchSent] = useState({
    dataIndex: "",
    searchText: "",
  });
  const idSearchInputSent = useRef(null);
  const [currentPageOfSent, setCurrentPageOfSent] = useState(1);

  const [searchReceived, setSearchReceived] = useState({
    dataIndex: "",
    searchText: "",
  });
  const idSearchInputReceived = useRef(null);
  const [currentPageOfReceived, setCurrentPageOfReceived] = useState(1);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .all([
        service.get(`/leader/exchange-points-sent/${exchangePoint.id}`),
        service.get(`/leader/exchange-points-received/${exchangePoint.id}`),
      ])
      .then(
        axios.spread((res1, res2) => {
          const newData1 = res1.data.results.map((item: { id: any; }) => ({
            ...item,
            key: item.id,
          }));
          setSentPackages(newData1);
          const newData2 = res2.data.results.map((item: { id: any; }) => ({
            ...item,
            key: item.id,
          }));
          setReceivedPackages(newData2);
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
    setCurrentPageOfSent(1);
    setCurrentPageOfReceived(1);
  }, []);

  const exchangePointDetail: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "ExchangePoint's name",
      children: exchangePoint.id,
      span: 2,
    },
    {
      key: "2",
      label: "Location",
      children: exchangePoint.location,
      span: 2,
    },
    {
      key: "3",
      label: "Managed by",
      children: exchangePoint.manager ? exchangePoint.manager.fullName : null,
      span: 2,
    },
    {
      key: "4",
      label: "Email",
      children: exchangePoint.manager ? exchangePoint.manager.email : null,
      span: 2,
    },
  ];

  // searchInColumn
  const handleSearchSent = (selectedKeys: any[], confirm: { (): void; (): void; (): void; }, dataIndex: string) => {
    confirm();
    setSearchSent({ dataIndex, searchText: selectedKeys[0] });

    // Get index of searched data's list
    const dataIndexIndex = receivedPackages.findIndex(
      (item) => item[dataIndex] === selectedKeys[0],
    );

    // Check if it is founded
    if (dataIndexIndex !== -1) {
      const searchedPage = Math.ceil((dataIndexIndex + 1) / 5);

      // Update current page
      setCurrentPageOfSent(searchedPage);
    }
  };
  const handleResetIdSent = (clearFilters: { (): void; (): void; }) => {
    clearFilters();
    setSearchSent({ ...searchSent, searchText: "" });
  };
  const getColumnSearchPropsSent = (dataIndex: string) => ({
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
          ref={dataIndex === "id" ? idSearchInputSent : null}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearchSent(selectedKeys, confirm, dataIndex)
          }
          className="mb-4 block"
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearchSent(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            className="w-[90px]"
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleResetIdSent(clearFilters)}
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
          () => (dataIndex === "id" ? idSearchInputSent : null)?.select(),
          100,
        );
      }
    },
    render: (text: { toString: () => string; }) =>
      searchSent.dataIndex === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchSent.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // searchInColumn
  const handleSearchReceived = (selectedKeys: any[], confirm: { (): void; (): void; (): void; }, dataIndex: string) => {
    confirm();
    setSearchReceived({ dataIndex, searchText: selectedKeys[0] });

    // Get index of searched data's list
    const dataIndexIndex = receivedPackages.findIndex(
      (item) => item[dataIndex] === selectedKeys[0],
    );

    // Check if it is founded
    if (dataIndexIndex !== -1) {
      const searchedPage = Math.ceil((dataIndexIndex + 1) / 5);

      // Update current page
      setCurrentPageOfReceived(searchedPage);
    } else {
    }
  };
  const handleResetIdReceived = (clearFilters: { (): void; (): void; }) => {
    clearFilters();
    setSearchReceived({ ...searchReceived, searchText: "" });
  };
  const getColumnSearchPropsReceived = (dataIndex: string) => ({
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
          ref={dataIndex === "id" ? idSearchInputSent : null}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearchReceived(selectedKeys, confirm, dataIndex)
          }
          className="mb-4 block"
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearchReceived(selectedKeys, confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            className="w-[90px]"
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleResetIdReceived(clearFilters)}
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
          () => (dataIndex === "id" ? idSearchInputReceived : null)?.select(),
          100,
        );
      }
    },
    render: (text: { toString: () => string; }) =>
      searchReceived.dataIndex === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchReceived.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const paginationOfSent = {
    hideOnSinglePage: true,
    pageSize: 5,
    current: currentPageOfSent,
    showTotal: (total: number, range: number[]) =>
      `${range[0]}-${range[1]} of ${total} items`,
  };

  const paginationOfReceived = {
    hideOnSinglePage: true,
    pageSize: 5,
    current: currentPageOfReceived,
    showTotal: (total: number, range: number[]) =>
      `${range[0]}-${range[1]} of ${total} items`,
  };

  const columnsSent = [
    {
      title: "Package ID",
      dataIndex: "id",
      key: "id",
      width: "32%",
      ...getColumnSearchPropsSent("id"),
    },
    {
      title: "Last Status",
      dataIndex: "status",
      key: "status",
      width: "68%",
    },
  ];

  const columnsReceived = [
    {
      title: "Package ID",
      dataIndex: "id",
      key: "id",
      width: "32%",
      ...getColumnSearchPropsReceived("id"),
    },
    {
      title: "Last Status",
      dataIndex: "status",
      key: "status",
      width: "68%",
    },
  ];

  type PackageDetail = {
    key: number;
    label: string;
    children: React.ReactNode;
    span: number;
  };

  const packageDetailSent = (pkg: any): PackageDetail[] => [
    {
      key: 1,
      label: "senderName",
      children: pkg.senderName,
      span: 1,
    },
    {
      key: 2,
      label: "receiverName",
      children: pkg.receiverName,
      span: 2,
    },
    {
      key: 3,
      label: "senderContact",
      children: pkg.senderContact,
      span: 1,
    },
    {
      key: 4,
      label: "receiverContact",
      children: pkg.receiverContact,
      span: 2,
    },
    {
      key: 5,
      label: "orgAddress",
      children: pkg.orgAddress,
      span: 1,
    },
    {
      key: 6,
      label: "desAddress",
      children: pkg.desAddress,
      span: 2,
    },
    {
      key: 7,
      label: "packageType",
      children: pkg.packageType,
      span: 1,
    },
    {
      key: 8,
      label: "weight (kg)",
      children: pkg.weight,
      span: 2,
    },
  ];

  const packageDetailReceived = (pkg: any): PackageDetail[] => [
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
  ];

  const dataSent = sentPackages.map((pkg: any) => ({
    key: pkg.id,
    id: pkg.id,
    status: pkg.status[pkg.status.length - 1].detail,
    description: (
      <Descriptions size="small" bordered items={packageDetailSent(pkg)} />
    ),
  }));

  const dataReceived = receivedPackages.map((pkg: any) => ({
    key: pkg.id,
    id: pkg.id,
    status: pkg.status[pkg.status.length - 1].detail,
    description: (
      <Descriptions size="small" bordered items={packageDetailReceived(pkg)} />
    ),
  }));

  return (
    <>
      <div className="flex h-full">
        <div className="mx-auto flex w-[98%] max-w-screen-xl flex-col pt-10">
          <div className="pb-10">
            <Descriptions
              title="ExchangePoint Detail"
              bordered
              items={exchangePointDetail}
            />
          </div>
          <div className="relative flex flex-grow gap-6">
            <div className="w-1/2">
              <div className="flex w-full flex-col gap-4">
                <div className="text-[18px] font-bold">Sent Packages</div>
                <SkeletonTable loading={loading} columns={columnsSent}>
                  <Table
                    className="w-full"
                    columns={columnsSent}
                    expandable={{
                      expandedRowRender: (record) => (
                        <p style={{ margin: 0 }}>{record.description}</p>
                      ),
                      rowExpandable: (record) => record.description !== "",
                    }}
                    dataSource={dataSent}
                    pagination={paginationOfSent}
                    idSearchInput={idSearchInputSent}
                    onChange={(pagination) =>
                      setCurrentPageOfSent(pagination.current)
                    }
                  />
                </SkeletonTable>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex w-full flex-col gap-4">
                <div className="text-[18px] font-bold">Received Packages</div>
                <SkeletonTable loading={loading} columns={columnsReceived}>
                  <Table
                    className="w-full"
                    columns={columnsReceived}
                    expandable={{
                      expandedRowRender: (record) => (
                        <p style={{ margin: 0 }}>{record.description}</p>
                      ),
                      rowExpandable: (record) => record.description !== "",
                    }}
                    dataSource={dataReceived}
                    pagination={paginationOfReceived}
                    idSearchInput={idSearchInputReceived}
                    onChange={(pagination) =>
                      setCurrentPageOfReceived(pagination.current)
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
