import { Skeleton, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SkeletonTable from "../components/SkeletonTable";
import { sortByString } from "../helpers/helpers";
import service from "../helpers/service";
import { useLocation } from "react-router-dom";

const pagination = {
  hideOnSinglePage: true,
  pageSize: 5,
  showTotal: (total: number, range: number[]) =>
    `${range[0]}-${range[1]} of ${total} items`,
};

export default function ExchangePointDetail() {
  const { state } = useLocation();
  const { exchangePoint } = state;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    service
      .get(`/leader/exchange-point?id=` + exchangePoint.id)
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
        console.log(err);
      });
  }, [exchangePoint.id]);

  const renderIdsColumn = (ids) => (
    <>
      {ids.map((id) => (
        <Tag key={id}>{id}</Tag>
      ))}
    </>
  );

  const columns = [
    // {
    //   title: "Sent Packages IDs",
    //   dataIndex: "sentPackagesIds",
    //   key: "sentPackagesIds",
    //   render: (sentPackagesIds) =>
    //     loading ? (
    //       <Skeleton active paragraph={{ rows: 1 }} />
    //     ) : (
    //       renderIdsColumn(sentPackagesIds)
    //     ),
    //   width: "15%",
    // },
    {
      title: "Sent Packages IDs",
      dataIndex: "sentPackagesIds",
      key: "sentPackagesIds",
      render: (sentPackagesIds) =>
        loading ? (
          <Skeleton active paragraph={{ rows: 1 }} />
        ) : (
          renderIdsColumn(sentPackagesIds)
        ),
    },
    {
      title: "Received Packages IDs",
      dataIndex: "receivedPackagesIds",
      key: "receivedPackagesIds",
      render: (receivedPackagesIds) =>
        loading ? (
          <Skeleton active paragraph={{ rows: 1 }} />
        ) : (
          renderIdsColumn(receivedPackagesIds)
        ),
    },
  ];

  return (
    <>
      <div className="flex h-screen bg-lime-100">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col p-10">
          <div className="pb-10">
            <h3 className="text-3xl font-bold">
              ExchangePoint's name: {exchangePoint.name}
            </h3>
            <p className="text-1xl">
              Managed by: {exchangePoint.manager.fullName}
              <span className="mx-2">|</span>
              Location: {exchangePoint.location}
            </p>
          </div>
          <div className="relative flex-grow bg-lime-100">
            <SkeletonTable loading={loading} columns={columns}>
              <Table
                className="w-full"
                columns={columns}
                dataSource={data}
                rowKey={(record) => String(record.id)}
                pagination={pagination}
              />
            </SkeletonTable>
          </div>
        </div>
      </div>
    </>
  );
}
