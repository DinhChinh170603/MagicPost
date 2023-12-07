import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import service from "../helpers/service";
import { Button, Input, Space, Table } from "antd";
import SkeletonTable from "../components/SkeletonTable";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const pagination = {
  hideOnSinglePage: true,
  pageSize: 5,
  showTotal: (total: number, range: number[]) =>
    `${range[0]}-${range[1]} of ${total} items`,
};

export default function PackageManagement() {
  const [data, setData] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [search, setSearch] = useState({
    dataIndex: "",
    searchText: "",
  });
  const idSearchInput = useRef(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    service
      .get(`/ex-employee/destinations`)
      .then((res) => {
        if (res.data.status !== 200) {
          toast.error(res.data.message);
          setLoading(false);
          return;
        }
        const newData = res.data.results.map((item) => ({
          ...item,
          key: item.id,
        }));
        setData(newData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // rowSelection
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  // searchInColumn
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearch({ dataIndex, searchText: selectedKeys[0] });
  };
  const handleResetId = (clearFilters) => {
    clearFilters();
    setSearch({ ...search, searchText: "" });
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
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
              confirm({
                closeDropdown: false,
              });
              setSearch({ dataIndex, searchText: selectedKeys[0] });
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
          () =>
            (dataIndex === "id" ? idSearchInput : null)?.select(),
          100,
        );
      }
    },
    render: (text) =>
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

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
    },
    {
      title: "Current Package Location",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
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
  ];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-lime-100">
      <div className="flex w-[80%] justify-start gap-4">
        <Button
          type="primary"
          onClick={start}
          disabled={!hasSelected}
          loading={loading}
        >
          Reload
        </Button>
        <div className="mt-1">
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </div>
      </div>
      <SkeletonTable className="w-[80%]" loading={loading} columns={columns}>
        <Table
          className="w-[80%]"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          idSearchInput={idSearchInput}
        />
      </SkeletonTable>
    </div>
  );
}
