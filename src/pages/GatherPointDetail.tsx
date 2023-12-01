import { Skeleton, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SkeletonTable from "../components/SkeletonTable";
import service from "../helpers/service";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Badge, Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';

const pagination = {
  hideOnSinglePage: true,
  pageSize: 5,
  showTotal: (total: number, range: number[]) =>
    `${range[0]}-${range[1]} of ${total} items`,
};

export default function GatherPointDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
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

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'ID',
      children: gatherPoint.id,
      span: 3,
    },
    {
      key: '2',
      label: "GatherPoint's name",
      children: gatherPoint.name,
      span: 1,
    },
    {
      key: '3',
      label: 'Location',
      children: gatherPoint.location,
      span: 3,
    },
    {
      key: '4',
      label: 'Managed by',
      children: gatherPoint.manager.fullName,
      span: 1,
    },
    {
      key: '5',
      label: 'Email',
      children: gatherPoint.manager.email,
      span: 2,
    },
  ];

  const columns = [
    {
      title: "Sent Packages IDs",
      dataIndex: "sentPackagesIds",
      key: "sentPackagesIds",
        render: (sentPackagesIds: any) => (
          <span>
            {sentPackagesIds.map((packagesIds: any) => (
              <Tag
                key={packagesIds.id}
                onClick={() => {
                  navigate(`/package/${packagesIds.id}`, {
                    state: { packagesIds: packagesIds },
                  });
                }}
              >
                {packagesIds.id}
              </Tag>
            ))}
          </span>
        ),
    },
    {
      title: "Received Packages IDs",
      dataIndex: "receivedPackagesIds",
      key: "receivedPackagesIds",
      render: (receivedPackagesIds: any) => (
        <span>
          {receivedPackagesIds.map((packagesIds: any) => (
            <Tag
              key={packagesIds.id}
              onClick={() => {
                navigate(`/package/${packagesIds.id}`, {
                  state: { packagesIds: packagesIds },
                });
              }}
            >
              {packagesIds.id}
            </Tag>
          ))}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="flex h-full">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col p-10">
          <div className="pb-10">
            <Descriptions title="GatherPointDetail" bordered items={items} />
          </div>
          {/* <div className="relative flex-grow bg-lime-100">
            <SkeletonTable loading={loading} columns={columns}>
              <Table
                className="w-full"
                columns={columns}
                dataSource={data}
                rowKey={(record: any) => String(record.id)}
                pagination={pagination}
              />
            </SkeletonTable>
          </div> */}
        </div>
      </div>
    </>
  );
}
