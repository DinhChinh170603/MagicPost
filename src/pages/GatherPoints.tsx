import { Table } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import SkeletonTable from "../components/SkeletonTable";
import { sortByString } from "../helpers/helpers";
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
    onFilter: (value, record) => record.location.indexOf(value) === 0,
  },
];

const pagination = {
  hideOnSinglePage: true,
  pageSize: 5,
  showTotal: (total: number, range: number[]) =>
    `${range[0]}-${range[1]} of ${total} items`,
};

export default function GatherPoints() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalFinished, setModalFinished] = useState(false);

  useEffect(() => {
    setLoading(true);
    service
      .get("/leader/gather-points")
      .then((res) => {
        if (res.data.status !== 200) {
          toast.error(res.data.message);
          setLoading(false);

          return;
        }
        setData(res.data.results);
        console.log(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err);
        setLoading(false);
      });
  }, [modalFinished]);

  const handleModalSubmit = () => {
    console.log("Submit from GatherPoints");
    setModalFinished((prev) => !prev);
  };

  return (
    <>
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-lime-100">
        <div className="flex w-[80%] justify-start">
          <Modal
            onSubmit={handleModalSubmit}
            apiEndpoint="/leader/gather-point"
          />
        </div>
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
