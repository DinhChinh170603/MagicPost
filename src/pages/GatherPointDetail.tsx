import { Skeleton, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SkeletonTable from "../components/SkeletonTable";
import service from "../helpers/service";
import axios from "axios";
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

  const [sentPackages, setSentPackages] = useState([]);
  const [receivedPackages, setReceivedPackages] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .all([
        service.get(`/leader/gather-points-sent/${gatherPoint.id}`),
        service.get(`/leader/gather-points-received/${gatherPoint.id}`),
      ])
      .then(
        axios.spread((res1, res2) => {
          setSentPackages(res1.data.results);
          setReceivedPackages(res2.data.results);
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
  }, []);

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
    // {
    //   title: "Received Packages IDs",
    //   dataIndex: "receivedPackagesIds",
    //   key: "receivedPackagesIds",
    //   render: (receivedPackagesIds: any) => (
    //     <span>
    //       {receivedPackagesIds.map((packagesIds: any) => (
    //         <Tag
    //           key={packagesIds.id}
    //           onClick={() => {
    //             navigate(`/package/${packagesIds.id}`, {
    //               state: { packagesIds: packagesIds },
    //             });
    //           }}
    //         >
    //           {packagesIds.id}
    //         </Tag>
    //       ))}
    //     </span>
    //   ),
    // },
  ];

  return (
    <>
      <div className="flex h-full">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col p-10">
          <div className="pb-10">
            <Descriptions title="GatherPointDetail" bordered items={items} />
          </div>
          <div className="relative flex flex-grow gap-10">
            <SkeletonTable loading={loading} columns={columns}>
              <Table
                className="w-full"
                columns={columns}
                dataSource={sentPackages}
                rowKey={(record: any) => String(record.id)}
                pagination={pagination}
              />
            </SkeletonTable>
            <SkeletonTable loading={loading} columns={columns}>
              <Table
                className="w-full"
                columns={columns}
                dataSource={receivedPackages}
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
