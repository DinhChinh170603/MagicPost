import { Table } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SkeletonTable from "../components/SkeletonTable";
import { sortByString } from "../helpers/helpers";
import service from "../helpers/service";
import { useNavigate } from "react-router-dom";

export default function Managers() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: sortByString("name"),
      width: "15%",
    },
    {
      title: "Manager",
      dataIndex: "manager",
      key: "manager",
      sorter: sortByString("manager"),
      width: "20%",
      render: (text: string, record: any) => {
        return record.manager ? record.manager.fullName : "";
      },
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      sorter: sortByString("location"),
      width: "15%",
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

  const pagination = {
    hideOnSinglePage: false,
    pageSize: 5,
    showTotal: (total: number, range: number[]) =>
      `${range[0]}-${range[1]} of ${total} items`,
  };

  useEffect(() => {
    setLoading(true);
    service
      .get("/leader/exchange-points")
      // .get("/gth-manager/exchange-points")
      .then((res) => {
        if (res.data.status !== 200) {
          toast.error(res.data.message);
          setLoading(false);
          return;
        }
        setData(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <SkeletonTable className="w-[80%]" loading={loading} columns={columns}>
          <Table
            className="w-[80%]"
            columns={columns}
            dataSource={data}
            rowKey={(record) => String(record.id)}
            pagination={pagination}
          />
        </SkeletonTable>
      </div>
    </>
  );
}
