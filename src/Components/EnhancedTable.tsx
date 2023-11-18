import { Table } from "antd";
import { sortByNumber, sortByString } from "../helpers/helpers";
import { useEffect, useState } from "react";
import service from "../helpers/service";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: sortByString("name"),
    width: "30%",
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    sorter: sortByString("location"),
    width: "30%",
  },
];

export default function EnhancedTable() {
  const [data, setData] = useState([]);
  useEffect(() => {
    service.get("/leader/exchange-points").then((res) => {
      setData(res.data.results);
      console.log(res.data.results);
    });
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-300">
      <Table
        className="w-[80%]"
        columns={columns}
        dataSource={data}
        rowKey={(record) => String(record.id)}
      />
    </div>
  );
}
