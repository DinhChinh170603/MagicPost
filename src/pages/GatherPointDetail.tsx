import { Skeleton, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SkeletonTable from "../components/SkeletonTable";
import service from "../helpers/service";
import { useLocation } from "react-router-dom";

const pagination = {
  hideOnSinglePage: true,
  pageSize: 5,
  showTotal: (total: number, range: number[]) =>
    `${range[0]}-${range[1]} of ${total} items`,
};

export default function GatherPointDetail() {
  const { state } = useLocation();
  const { gatherPoint } = state;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    service
      .get(`/leader/gather-point?id=` + gatherPoint.id)
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
  }, [gatherPoint.id]);

  const renderIdsColumn = (ids: any) => (
    <>
      {ids.map((id: any) => (
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
      render: (sentPackagesIds: any) =>
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
      render: (receivedPackagesIds: any) =>
        loading ? (
          <Skeleton active paragraph={{ rows: 1 }} />
        ) : (
          renderIdsColumn(receivedPackagesIds)
        ),
    },
  ];

  return (
    <>
      <div className="flex h-full">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col p-10">
          <div className="pb-10">
            <h3 className="text-3xl font-bold">
              GatherPoint's name: {gatherPoint.name}
            </h3>
            <p className="text-1xl">
              Managed by: {gatherPoint.manager.fullName}
              <span className="mx-2">|</span>
              Location: {gatherPoint.location}
            </p>
          </div>
          <div className="relative flex-grow bg-lime-100">
            <SkeletonTable loading={loading} columns={columns}>
              <Table
                className="w-full"
                columns={columns}
                dataSource={data}
                rowKey={(record: any) => String(record.id)}
                pagination={pagination}
              />
            </SkeletonTable>
          </div>
        </div>
      </div>
    </>
  );
}
