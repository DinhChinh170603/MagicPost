import { Table, Button, Space, Descriptions, Input } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import SkeletonTable from "../components/SkeletonTable";
import service from "../helpers/service";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

export default function PackageManagement(props: any) {
  const { role } = props;
  const [roleAPI, setRoleAPI] = useState("");

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
    if (role === "EXCHANGE_EMPLOYEE") {
      setRoleAPI("/ex-employee");
    } else if (role === "GATHER_EMPLOYEE") {
      setRoleAPI("/gth-employee");
    }
    console.log(roleAPI);

    if (roleAPI) {
      axios
        .all([
          service.get(roleAPI + `/sent-packages`),
          service.get(roleAPI + `/received-packages`),
        ])
        .then(
          axios.spread((res1, res2) => {
            const newData1 = res1.data.results.map((item) => ({
              ...item,
              key: item.id,
            }));
            setSentPackages(newData1);
            const newData2 = res2.data.results.map((item) => ({
              ...item,
              key: item.id,
            }));
            setReceivedPackages(newData2);
            console.log(res1.data.results);
            console.log(res2.data.results);
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
    }
    setCurrentPageOfSent(1);
    setCurrentPageOfReceived(1);
  }, [role, roleAPI]);

  // searchInColumn
  const handleSearchSent = (selectedKeys, confirm, dataIndex) => {
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
    } else {
      console.log(
        `The searched id ${selectedKeys[0]} is not found in the data.`,
      );
    }
  };
  const handleResetIdSent = (clearFilters) => {
    clearFilters();
    setSearchSent({ ...searchSent, searchText: "" });
  };
  const getColumnSearchPropsSent = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
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
              confirm({
                closeDropdown: false,
              });
              setSearchSent({ dataIndex, searchText: selectedKeys[0] });
            }}
            className={dataIndex === "id" ? "hidden" : "inline"}
          >
            Filter
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
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(
          () => (dataIndex === "id" ? idSearchInputSent : null)?.select(),
          100,
        );
      }
    },
    render: (text) =>
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
  const handleSearchReceived = (selectedKeys, confirm, dataIndex) => {
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
      console.log(
        `The searched id ${selectedKeys[0]} is not found in the data.`,
      );
    }
  };
  const handleResetIdReceived = (clearFilters) => {
    clearFilters();
    setSearchReceived({ ...searchReceived, searchText: "" });
  };
  const getColumnSearchPropsReceived = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
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
              confirm({
                closeDropdown: false,
              });
              setSearchReceived({ dataIndex, searchText: selectedKeys[0] });
            }}
            className={dataIndex === "id" ? "hidden" : "inline"}
          >
            Filter
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
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(
          () => (dataIndex === "id" ? idSearchInputReceived : null)?.select(),
          100,
        );
      }
    },
    render: (text) =>
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
      ...getColumnSearchPropsSent("id"),
    },
    {
      title: "Sender Name",
      dataIndex: "senderName",
      key: "senderName",
    },
  ];

  const columnsReceived = [
    {
      title: "Package ID",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchPropsReceived("id"),
    },
    {
      title: "Sender Name",
      dataIndex: "senderName",
      key: "senderName",
    },
  ];

  type PackageDetail = {
    key: number;
    label: string;
    children: React.ReactNode;
    span: number;
  };

  const packageDetailSent = (pkg): PackageDetail[] => [
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

  const packageDetailReceived = (pkg): PackageDetail[] => [
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

  const dataSent = sentPackages.map((pkg) => ({
    key: pkg.id,
    id: pkg.id,
    senderName: pkg.senderName,
    description: (
      <Descriptions size="small" bordered items={packageDetailSent(pkg)} />
    ),
  }));

  const dataReceived = receivedPackages.map((pkg) => ({
    key: pkg.id,
    id: pkg.id,
    senderName: pkg.senderName,
    description: (
      <Descriptions size="small" bordered items={packageDetailReceived(pkg)} />
    ),
  }));

  return (
    <>
      <div className="flex h-full w-full">
        <div className="mx-auto mt-8 flex w-[98%]">
          <div className="w-1/2">
            <div className="flex w-full flex-col gap-4">
              <div className="text-2xl font-bold">Sent Packages</div>
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
              <div className="text-2xl font-bold">Received Packages</div>
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
    </>
  );
}

PackageManagement.propTypes = {
  role: PropTypes.string,
};
