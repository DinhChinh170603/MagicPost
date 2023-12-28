import { SearchOutlined } from "@ant-design/icons";
import { Descriptions, DescriptionsProps, Form, Input, Table } from "antd";
import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import moment from "moment";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import SkeletonTable from "../components/SkeletonTable";
import service from "../helpers/service";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Legend,
  Tooltip,
);

export default function GatherPointDetail() {
  const { state } = useLocation();
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
          const newData1 = res1.data.results.map((item: { id: any }) => ({
            ...item,
            key: item.id,
          }));
          setSentPackages(newData1);
          const newData2 = res2.data.results.map((item: { id: any }) => ({
            ...item,
            key: item.id,
          }));
          setReceivedPackages(newData2);
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

  const gatherPointDetail: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "ID",
      children: gatherPoint.id,
      span: 1,
    },
    {
      key: "2",
      label: "Location",
      children: gatherPoint.location,
      span: 2,
    },
    {
      key: "3",
      label: "Managed by",
      children: gatherPoint.manager ? gatherPoint.manager.fullName : null,
      span: 1,
    },
    {
      key: "4",
      label: "Email",
      children: gatherPoint.manager ? gatherPoint.manager.email : null,
      span: 2,
    },
  ];

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
      width: "10%",
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      width: "20%",
      render: (text: any, record: any) => (
        <>
          {record.timestamp
            ? moment(record.timestamp).format("DD-MM-YYYY [at] HH:mm")
            : null}
        </>
      ),
    },
    {
      title: "Last Status",
      dataIndex: "status",
      key: "status",
      width: "55%",
    },
    {
      title: "State",
      key: "state",
      width: "15%",
      filters: [
        {
          text: "Sent",
          value: "sent",
        },
        {
          text: "Received",
          value: "received",
        },
      ],
      onFilter: (value: any, record: any) => record.source.indexOf(value) === 0,

      render: (text: any, record: any) => (
        <>
          {record.source === "sent" ? (
            <div className="rounded-lg bg-[#ffb1c2] px-2 py-1 text-center font-bold">
              Sent
            </div>
          ) : (
            <div className="rounded-lg bg-[#9bd1f5] px-2 py-1 text-center font-bold">
              Received
            </div>
          )}
        </>
      ),
    },
  ];

  type PackageDetail = {
    key: number;
    label: string;
    children: React.ReactNode;
    span: number;
  };

  const packageDetailSent = (pkg: any): PackageDetail[] => [
    {
      key: 1,
      label: "senderName",
      children: pkg.senderName,
      span: 1,
    },
    {
      key: 2,
      label: "receiverName",
      children: pkg.receiverName,
      span: 2,
    },
    {
      key: 3,
      label: "senderContact",
      children: pkg.senderContact,
      span: 1,
    },
    {
      key: 4,
      label: "receiverContact",
      children: pkg.receiverContact,
      span: 2,
    },
    {
      key: 5,
      label: "orgAddress",
      children: pkg.orgAddress,
      span: 1,
    },
    {
      key: 6,
      label: "desAddress",
      children: pkg.desAddress,
      span: 2,
    },
    {
      key: 7,
      label: "packageType",
      children: pkg.packageType,
      span: 1,
    },
    {
      key: 8,
      label: "weight (kg)",
      children: pkg.weight,
      span: 2,
    },
  ];

  const packageDetailReceived = (pkg: any): PackageDetail[] => [
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
  ];

  const dataSent = sentPackages.map((pkg: any) => ({
    key: pkg.id,
    id: pkg.id,
    timestamp: pkg.timestamp,
    status: pkg.status[pkg.status.length - 1].detail,
    description: (
      <Descriptions size="small" bordered items={packageDetailSent(pkg)} />
    ),
    source: "sent",
  }));

  const dataReceived = receivedPackages.map((pkg: any) => ({
    key: pkg.id,
    id: pkg.id,
    timestamp: pkg.timestamp,
    status: pkg.status[pkg.status.length - 1].detail,
    description: (
      <Descriptions size="small" bordered items={packageDetailReceived(pkg)} />
    ),
    source: "received",
  }));

  const historyData = [...dataSent, ...dataReceived].map((item, index) => ({
    ...item,
    key: index,
  }));

  historyData.sort(
    (a, b) => moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf(),
  );

  //Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<any>([]);

  useEffect(() => {
    const results = historyData.filter((item) =>
      item.id.toString().includes(searchQuery),
    );

    if (results.length !== searchResult.length) {
      setSearchResult(results);
    }
  }, [searchQuery, historyData, searchResult]);

  //chart
  const extractMonthLabels = () => {
    const currentDate = new Date();
    const labels = [];

    for (let i = 3; i >= 0; i--) {
      const monthDate = new Date(currentDate);

      monthDate.setMonth(currentDate.getMonth() - i);

      const label = `${monthDate
        .toLocaleString("en-US", {
          month: "long",
        })
        .slice(0, 3)} ${monthDate.getFullYear()}`;
      labels.push(label);
    }

    return labels;
  };

  const labels = extractMonthLabels();

  const countPackagesByMonth = (data: any) => {
    const packagesByMonth : any = {};

    data.forEach((item: any) => {
      const timestampDate = new Date(item.timestamp);
      const monthYear = `${timestampDate
        .toLocaleString("en-US", {
          month: "long",
        })
        .slice(0, 3)} ${timestampDate.getFullYear()}`;

      if (!packagesByMonth[monthYear]) {
        packagesByMonth[monthYear] = 0;
      }
      packagesByMonth[monthYear]++;
    });

    return packagesByMonth;
  };

  const countSent = countPackagesByMonth(dataSent);
  const countReceived = countPackagesByMonth(dataReceived);

  const barChartData = {
    labels: labels,
    datasets: [
      {
        label: "Sent",
        data: countSent,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Received",
        data: countReceived,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const barOptions: any = {
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Packages statistics",
        font: {
          size: 30,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <>
      <b className="mb-5 flex items-center justify-center text-2xl">
        {" "}
        GatherPoint Detail
      </b>
      <div className="mb-10 w-[97] rounded-xl bg-white p-3 shadow-lg">
        <Descriptions bordered items={gatherPointDetail} />
      </div>

      <b className="mb-5 flex items-center justify-center text-2xl">Overview</b>
      <div className="mb-4 flex w-full flex-wrap justify-evenly gap-3 md:gap-0">
        <div className="flex basis-[98%] flex-col space-y-3 md:basis-[98%] xl:basis-[35%]">
          <div className="flex basis-[98%] items-center border border-gray-300 bg-white p-3 px-5 shadow-md md:basis-[46%] xl:basis-[30%]">
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{dataSent.length}</div>
              <div className="text-base">Sent Records</div>
            </div>
            <img
              className="ml-auto"
              width={70}
              height={70}
              src="/src/assets/inprogress.svg"
            />
          </div>

          <div className="flex basis-[98%] items-center border border-gray-300 bg-white p-3 px-5 shadow-md md:basis-[46%] xl:basis-[30%]">
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{dataReceived.length}</div>
              <div className="text-base">Received Records</div>
            </div>
            <img
              className="ml-auto"
              width={70}
              height={70}
              src="/src/assets/received.svg"
            />
          </div>
        </div>

        <div className="flex min-h-[300px] basis-[98%] items-center border border-gray-300 bg-white p-3 px-5 shadow-md md:basis-[46%] xl:basis-[60%]">
          <Bar data={barChartData} options={barOptions} />
        </div>
      </div>

      <b className="mb-5 flex items-center justify-center text-2xl">
        Packages History
      </b>
      <div className="min-h-[78%] w-[97] rounded-xl bg-white p-3 shadow-lg">
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
