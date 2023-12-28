import { SearchOutlined } from "@ant-design/icons";
import { Descriptions, Form, Input, Table } from "antd";
import axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SkeletonTable from "../components/SkeletonTable";
import { roleValueMap } from "../helpers/helpers";
import service from "../helpers/service";

export default function DeliveryStatus(props: any) {
  const { role } = props;

  const [succeedPackages, setSucceedPackages] = useState([]);
  const [rejectedPackages, setRejectedPackages] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const roleApiPrefix = roleValueMap[role];

    if (roleApiPrefix) {
      axios
        .all([
          service.get(roleApiPrefix + `/successful-packages`),
          service.get(roleApiPrefix + `/rejected-packages`),
        ])
        .then(
          axios.spread((res1, res2) => {
            const newData1 = res1.data.results.map((item: { id: any }) => ({
              ...item,
              key: item.id,
            }));
            setSucceedPackages(newData1);
            const newData2 = res2.data.results.map((item: { id: any }) => ({
              ...item,
              key: item.id,
            }));
            setRejectedPackages(newData2);
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
    }
  }, [role]);

  const pagination = {
    hideOnSinglePage: true,
    pageSize: 5,
    showTotal: (total: number, range: number[]) =>
      `${range[0]}-${range[1]} of ${total} items`,
  };

  const columns = [
    {
      title: "Package ID",
      dataIndex: "id",
      key: "id",
      width: "20%",
    },
    {
      title: "Receiver Name",
      dataIndex: "receiverName",
      key: "receiverName",
      width: "20%",
    },
    {
      title: "State",
      key: "state",
      width: "10%",
      filters: [
        {
          text: "Success",
          value: "success",
        },
        {
          text: "Rejected",
          value: "rejected",
        },
      ],
      onFilter: (value: any, record: any) => record.source.indexOf(value) === 0,
      render: (text: any, record: any) => (
        <>
          {record.source === "rejected" ? (
            <div className="rounded-lg bg-[#ffb1c2] px-2 py-1 text-center font-bold">
              Rejected
            </div>
          ) : (
            <div className="rounded-lg bg-[#9bd1f5] px-2 py-1 text-center font-bold">
              Success
            </div>
          )}
        </>
      ),
    },
    {
      title: "Detail",
      dataIndex: "lastStatus",
      key: "detail",
      width: "50%",
      render: (text: any, record: any) => {
        return text || record.reason;
      },
    },
  ];

  type PackageDetail = {
    key: number;
    label: string;
    children: React.ReactNode;
    span: number;
  };

  const packageDetailSucceed = (pkg: any): PackageDetail[] => [
    {
      key: 1,
      label: "senderName",
      children: pkg.senderName,
      span: 1.5,
    },
    {
      key: 2,
      label: "receiverName",
      children: pkg.receiverName,
      span: 1.5,
    },
    {
      key: 3,
      label: "senderContact",
      children: pkg.senderContact,
      span: 1.5,
    },
    {
      key: 4,
      label: "receiverContact",
      children: pkg.receiverContact,
      span: 1.5,
    },
    {
      key: 5,
      label: "orgAddress",
      children: pkg.orgAddress,
      span: 1.5,
    },
    {
      key: 6,
      label: "desAddress",
      children: pkg.desAddress,
      span: 1.5,
    },
    {
      key: 7,
      label: "packageType",
      children: pkg.packageType,
      span: 1.5,
    },
    {
      key: 8,
      label: "weight (kg)",
      children: pkg.weight,
      span: 1.5,
    },
    {
      key: 9,
      label: "lastStatus",
      children: pkg.status[pkg.status.length - 1]
        ? pkg.status[pkg.status.length - 1].detail
        : "",
      span: 3,
    },
  ];

  const packageDetailRejected = (pkg: any): PackageDetail[] => [
    {
      key: 1,
      label: "senderName",
      children: pkg.senderName,
      span: 1.5,
    },
    {
      key: 2,
      label: "receiverName",
      children: pkg.receiverName,
      span: 1.5,
    },
    {
      key: 3,
      label: "senderContact",
      children: pkg.senderContact,
      span: 1.5,
    },
    {
      key: 4,
      label: "receiverContact",
      children: pkg.receiverContact,
      span: 1.5,
    },
    {
      key: 5,
      label: "orgAddress",
      children: pkg.orgAddress,
      span: 1.5,
    },
    {
      key: 6,
      label: "desAddress",
      children: pkg.desAddress,
      span: 1.5,
    },
    {
      key: 7,
      label: "packageType",
      children: pkg.packageType,
      span: 1.5,
    },
    {
      key: 8,
      label: "weight (kg)",
      children: pkg.weight,
      span: 1.5,
    },
    {
      key: 9,
      label: "lastStatus",
      children: pkg.status[pkg.status.length - 1]
        ? pkg.status[pkg.status.length - 1].detail
        : "",
      span: 3,
    },
  ];

  const dataSucceed = succeedPackages.map((pkg: any) => ({
    key: pkg.id,
    id: pkg.id,
    timestamp: pkg.timestamp,
    receiverName: pkg.receiverName,
    lastStatus: pkg.status[pkg.status.length - 1]
      ? pkg.status[pkg.status.length - 1].detail
      : "",
    description: (
      <Descriptions size="small" bordered items={packageDetailSucceed(pkg)} />
    ),
    source: "success",
  }));

  const dataRejected = rejectedPackages.map((pkg: any) => ({
    key: pkg.id,
    id: pkg.id,
    timestamp: pkg.timestamp,
    receiverName: pkg.receiverName,
    reason: pkg.rejectDetails[pkg.rejectDetails.length - 1]
      ? pkg.rejectDetails[pkg.rejectDetails.length - 1].reason
      : "",
    description: (
      <Descriptions size="small" bordered items={packageDetailRejected(pkg)} />
    ),
    source: "rejected",
  }));

  const statusData = [...dataSucceed, ...dataRejected].map((item, index) => ({
    ...item,
    key: index,
  }));

  statusData.sort(
    (a, b) => moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf(),
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<any>([]);

  useEffect(() => {
    const results = statusData.filter((item) =>
      item.id.toString().includes(searchQuery),
    );

    if (results.length !== searchResult.length) {
      setSearchResult(results);
    }
  }, [searchQuery, statusData, searchResult]);

  return (
    <>
      <div className="mb-4 ml-3 text-3xl font-bold">Delivery Status</div>

      <div className="mb-5 flex w-full flex-wrap justify-evenly">
        <div className="mb-2 flex basis-[98%] items-center border border-gray-300 bg-white p-3 px-5 shadow-md xl:basis-[47%]">
          <div className="flex flex-col">
            <div className="text-3xl font-bold">{dataSucceed.length}</div>
            <div className="text-base">Successful Packages</div>
          </div>
          <img
            className="ml-auto py-1"
            width={80}
            height={80}
            src="/src/assets/successful.svg"
          />
        </div>
        <div className="mb-2 flex basis-[98%] items-center border border-gray-300 bg-white p-3 px-5 shadow-md xl:basis-[47%]">
          <div className="flex flex-col">
            <div className="text-3xl font-bold">{dataRejected.length}</div>
            <div className="text-base">Rejected Packages</div>
          </div>
          <img
            className="ml-auto py-1"
            width={80}
            height={80}
            src="/src/assets/rejected.svg"
          />
        </div>
      </div>

      <div className="w-[97] rounded-xl bg-white p-3 shadow-lg">
        <Form className="mt-1 flex items-center justify-center">
          <Form.Item className="mx-auto basis-[90%] md:basis-[60%] xl:basis-[40%]">
            <Input
              placeholder="Package ID"
              className="px-2 py-1 text-lg"
              suffix={
                <div className="rounded-l px-2 py-1">
                  <SearchOutlined className="transition-all duration-300" />
                </div>
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            ></Input>
          </Form.Item>
        </Form>
        <SkeletonTable loading={loading} columns={columns}>
          <Table
            scroll={{ x: 800 }}
            className="w-full"
            columns={columns}
            expandable={{
              expandedRowRender: (record) => (
                <p style={{ margin: 0 }}>{record.description}</p>
              ),
              rowExpandable: (record) => record.description !== "",
            }}
            dataSource={searchResult}
            pagination={pagination}
          />
        </SkeletonTable>
      </div>
    </>
  );
}

DeliveryStatus.propTypes = {
  role: PropTypes.string,
};
