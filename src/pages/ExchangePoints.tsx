import React, { useEffect, useState } from "react";
import { sortByString } from "../helpers/helpers";
import service from "../helpers/service";
import { Table } from "antd";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";
import Modal from "../components/Modal";

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
  pageSize: 10,
  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
};

export default function ExchangePoints() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalFinished, setModalFinished] = useState(false);

  useEffect(() => {
    setLoading(true);
    service
      .get("/leader/exchange-points")
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
    console.log("Submit from ExchangePoints");
    setModalFinished((prev) => !prev);
  };

  return (
    <>
      {loading && <Loading />}
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-lime-100">
        <div className="flex w-[80%] justify-start">
          <Modal onSubmit={handleModalSubmit} apiEndpoint="/leader/exchange-point"/>
        </div>
        <Table
          className="w-[80%]"
          columns={columns}
          dataSource={data}
          rowKey={(record) => String(record.id)}
          pagination={pagination}
        />
      </div>
    </>
  );
}
