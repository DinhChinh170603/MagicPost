import React, { useEffect, useState } from "react";
import { sortByString } from "../helpers/helpers";
import service from "../helpers/service";
import { Table } from "antd";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";

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
    sorter: (a, b) => sortByString(a.manager?.fullName, b.manager?.fullName),
    width: "20%",
    render: (text, record) => {
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
    onFilter: (value, record) => record.location.indexOf(value) === 0,
  },
  {
    title: "Link with Exchange",
    dataIndex: "linkedExchangePoints",
    key: "linkedExchangePoints",
    width: "20%",
    render: (text, record) => {
      return record.linkedExchangePoints.map((exchangePoint) => (
        <Link key={exchangePoint.id}>
          {exchangePoint.name}<br />
        </Link>
      ));
    },
  },
];

const pagination = {
  hideOnSinglePage: false,
  pageSize: 10,
  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
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
          console.log(res.data.results);
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
  }, [modalFinished]);

  const handleModalSubmit = () => {
    console.log("Submit from GatherPoints");
    setModalFinished((prev) => !prev);
  };

  return (
    <>
      {loading && <Loading />}
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-lime-100">
        <div className="flex w-[80%] justify-start">
          <Modal onSubmit={handleModalSubmit} apiEndpoint="/leader/gather-point" />
        </div>
        <Table
          className="w-[80%] overflow-auto"
          columns={columns}
          dataSource={data}
          rowKey={(record) => String(record.id)}
          pagination={pagination}
          scroll={{ y: '50vh' }}
        />
      </div>
    </>
  );
}
