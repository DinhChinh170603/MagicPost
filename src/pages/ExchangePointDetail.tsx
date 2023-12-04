import { Skeleton, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import SkeletonTable from "../components/SkeletonTable";
import service from "../helpers/service";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Badge, Descriptions } from "antd";
import type { DescriptionsProps } from "antd";

const pagination = {
  hideOnSinglePage: true,
  pageSize: 5,
  showTotal: (total: number, range: number[]) =>
    `${range[0]}-${range[1]} of ${total} items`,
};

export default function ExchangePointDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { exchangePoint } = state;

  const [sentPackages, setSentPackages] = useState([]);
  const [receivedPackages, setReceivedPackages] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .all([
        service.get(`/leader/exchange-points-sent/${exchangePoint.id}`),
        service.get(`/leader/exchange-points-received/${exchangePoint.id}`),
      ])
      .then(
        axios.spread((res1, res2) => {
          setSentPackages(res1.data.results);
          setReceivedPackages(res2.data.results);
          console.log(res1.data.results);
          console.log(res2.data.results);
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

  const exchangePointDetail: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "ID",
      children: exchangePoint.id,
      span: 3,
    },
    {
      key: "2",
      label: "ExchangePoint's name",
      children: exchangePoint.name,
      span: 1,
    },
    {
      key: "3",
      label: "Location",
      children: exchangePoint.location,
      span: 3,
    },
    {
      key: "4",
      label: "Managed by",
      children: exchangePoint.manager.fullName,
      span: 1,
    },
    {
      key: "5",
      label: "Email",
      children: exchangePoint.manager.email,
      span: 2,
    },
  ];

  const columnsSent = [
    {
      title: "SenderName",
      dataIndex: "senderName",
      key: "senderName",
    },
    {
      title: "PackageType",
      dataIndex: "packageType",
      key: "packageType",
    },
  ];

  const columnsReceived = [
    {
      title: "SenderName",
      dataIndex: "senderName",
      key: "senderName",
    },
    {
      title: "PackageType",
      dataIndex: "packageType",
      key: "packageType",
    },
  ];

  const packageDetail: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "senderName",
      children: "John Brown",
      span: 1,
    },
    {
      key: "2",
      label: "receiverName",
      children: "Jim Green",
      span: 2,
    },
    {
      key: "3",
      label: "senderContact",
      children: "0123456789",
      span: 1,
    },
    {
      key: "4",
      label: "receiverContact",
      children: "0123456789",
      span: 2,
    },
    {
      key: "5",
      label: "orgAddress",
      children: "Yen Hoa",
      span: 1,
    },
    {
      key: "6",
      label: "desAddress",
      children: "Thanh Xuan",
      span: 2,
    },
    {
      key: "7",
      label: "packageType",
      children: "GOODS",
      span: 1,
    },
    {
      key: "8",
      label: "weight (kg)",
      children: "0.2",
      span: 2,
    },
  ];

  const data = [
    {
      key: 1,
      senderName: "John Brown",
      packageType: "DOCUMENT",
      description: (
        <Descriptions size="small" bordered items={packageDetail} />
      ),
    },
    {
      key: 2,
      senderName: "Jim Green",
      packageType: "DOCUMENT",
      description: (
        <Descriptions size="small" bordered items={packageDetail} />
      ),
    },
    {
      key: 3,
      senderName: "Not Expandable",
      packageType: "GOODS",
      description: "",
    },
    {
      key: 4,
      senderName: "Joe Black",
      packageType: "DOCUMENT",
      description:
        "My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.",
    },
  ];

  // const columnsSent = [
  //   {
  //     title: "Sent Packages IDs",
  //     dataIndex: "sentPackagesIds",
  //     key: "sentPackagesIds",
  //     render: (sentPackagesIds) => (
  //       <span>
  //         {sentPackagesIds.map((packageId) => (
  //           <Tag
  //             key={packageId.id}
  //             // onClick={() => {
  //             //   navigate(`/package/${packageId}`, {
  //             //     state: { packageId: packageId },
  //             //   });
  //             // }}
  //           >
  //             {packageId.id}
  //           </Tag>
  //         ))}
  //       </span>
  //     ),
  //   },
  // ];

  // const columnsReceived = [
  //   {
  //     title: "Received Packages IDs",
  //     dataIndex: "receivedPackagesIds",
  //     key: "receivedPackagesIds",
  //     render: (receivedPackagesIds: any) => (
  //       <span>
  //         {receivedPackagesIds.map((packagesIds: any) => (
  //           <Tag
  //             key={packagesIds.id}
  //             // onClick={() => {
  //             //   navigate(`/package/${packagesIds.id}`, {
  //             //     state: { packagesIds: packagesIds },
  //             //   });
  //             // }}
  //           >
  //             {packagesIds.id}
  //           </Tag>
  //         ))}
  //       </span>
  //     ),
  //   },
  // ];

  return (
    <>
      <div className="flex h-full">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col pt-10">
          <div className="pb-10">
            <Descriptions title="ExchangePointDetail" bordered items={exchangePointDetail} />
          </div>
          <div className="relative flex flex-grow gap-10">
            {/* <SkeletonTable loading={loading} columns={columnsSent}>
              <Table
                className="w-full"
                columns={columnsSent}
                dataSource={sentPackages}
                rowKey={(record: any) => String(record.id)}
                pagination={pagination}
              />
            </SkeletonTable> */}
            <Table
              className="w-full"
              columns={columnsSent}
              expandable={{
                expandedRowRender: (record) => (
                  <p style={{ margin: 0 }}>
                    {record.description}
                  </p>
                ),
                rowExpandable: (record) => record.description !== "",
              }}
              dataSource={data}
            />
            <Table
              className="w-full"
              columns={columnsReceived}
              expandable={{
                expandedRowRender: (record) => (
                  <p style={{ margin: 0 }}>
                    {record.description}
                  </p>
                ),
                rowExpandable: (record) => record.description !== "",
              }}
              dataSource={data}
            />
          </div>
        </div>
      </div>
    </>
  );
}
