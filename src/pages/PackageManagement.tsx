import { SearchOutlined } from "@ant-design/icons";
import { Descriptions, Form, Input, Table } from "antd";
import axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SkeletonTable from "../components/SkeletonTable";
import {
  EE_ROLE,
  EM_ROLE,
  GE_ROLE,
  GM_ROLE,
  IN_PROGRESS_STATE,
  LEADER_ROLE,
  REJECTED_STATE,
  SUCCESS_STATE,
} from "../helpers/constants";
import service from "../helpers/service";
import { sortByString } from "../helpers/helpers";

export default function PackageManagement(props: any) {
  const { role } = props;
  const [roleAPI, setRoleAPI] = useState("");

  const [sentPackages, setSentPackages] = useState([]);
  const [receivedPackages, setReceivedPackages] = useState([]);
  const [allPackage, setAllPackage] = useState([]);

  const [totalCount, setTotalCount] = useState(0);
  const [successfulCount, setSuccessfulCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (role === EE_ROLE) {
      setRoleAPI("/ex-employee");
    } else if (role === GE_ROLE) {
      setRoleAPI("/gth-employee");
    } else if (role === LEADER_ROLE) {
      setRoleAPI("/leader");
    } else if (role === EM_ROLE) {
      setRoleAPI("/ex-manager");
    } else if (role === GM_ROLE) {
      setRoleAPI("/gth-manager");
    }

    if (roleAPI && role !== LEADER_ROLE) {
      axios
        .all([
          service.get(roleAPI + `/sent-packages`),
          service.get(roleAPI + `/received-packages`),
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
    } else if (roleAPI && role === LEADER_ROLE) {
      service.get(roleAPI + `/all-packages`).then((res) => {
        let totalCount = 0;
        let successfulCount = 0;
        let rejectedCount = 0;
        let inProgressCount = 0;

        const newData = res.data.results.map((item: any) => {
          switch (item.generalState) {
            case SUCCESS_STATE:
              successfulCount++;
              break;
            case REJECTED_STATE:
              rejectedCount++;
              break;
            case IN_PROGRESS_STATE:
              inProgressCount++;
              break;
            default:
              break;
          }

          return {
            ...item,
            key: item.id,
          };
        });

        totalCount = successfulCount + rejectedCount + inProgressCount;
        setAllPackage(newData);
        setLoading(false);

        setTotalCount(totalCount);
        setSuccessfulCount(successfulCount);
        setRejectedCount(rejectedCount);
        setInProgressCount(inProgressCount);
      });
    }
  }, [role, roleAPI]);

  const pagination = {
    hideOnSinglePage: true,
    pageSize: 5,
    showTotal: (total: number, range: number[]) =>
      `${range[0]}-${range[1]} of ${total} items`,
  };

  const paginationOfAll = {
    defaultPageSize: 5,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "30"],
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
      render: (_text: any, record: any) => (
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

      render: (_text: any, record: any) => (
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

  const columnsAll = [
    {
      title: "Package ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Sender Name",
      dataIndex: "senderName",
      key: "senderName",
      sorter: sortByString("senderName"),
    },
    {
      title: "Receiver Name",
      dataIndex: "receiverName",
      key: "receiverName",
      sorter: sortByString("receiverName"),
    },
    {
      title: "Package Type",
      dataIndex: "packageType",
      key: "packageType",
      filters: [
        {
          text: "GOODS",
          value: "GOODS",
        },
        {
          text: "DOCUMENT",
          value: "DOCUMENT",
        },
      ],
      onFilter: (value: any, record: any) =>
        record.packageType.indexOf(value) === 0,
    },
    {
      title: "State",
      dataIndex: "generalState",
      key: "generalState",
      filters: [
        {
          text: "Success",
          value: SUCCESS_STATE,
        },
        {
          text: "Rejected",
          value: REJECTED_STATE,
        },
        {
          text: "In Progress",
          value: IN_PROGRESS_STATE,
        },
      ],
      onFilter: (value: any, record: any) =>
        record.generalState.indexOf(value) === 0,
      render: (_text: any, record: any) => (
        <>
          {record.generalState === SUCCESS_STATE ? (
            <div className="rounded-lg bg-[#9bd1f5] px-2 py-1 text-center font-bold">
              Success
            </div>
          ) : record.generalState === REJECTED_STATE ? (
            <div className="rounded-lg bg-[#ffb1c2] px-2 py-1 text-center font-bold">
              Rejected
            </div>
          ) : (
            <div className="rounded-lg bg-[#ffe6ab] px-2 py-1 text-center font-bold">
              In Progress
            </div>
          )}
        </>
      ),
      width: "10rem",
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
    {
      key: 9,
      label: "lastStatus",
      children: pkg.status[pkg.status.length - 1]
        ? pkg.status[pkg.status.length - 1].detail
        : "",
      span: 3,
    },
  ];

  const packageDetailAll = (pkg: any): PackageDetail[] => [
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

  const dataSent = sentPackages.map((pkg: any) => ({
    key: pkg.id,
    id: pkg.id,
    senderName: pkg.senderName,
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
    senderName: pkg.senderName,
    timestamp: pkg.timestamp,
    status: pkg.status[pkg.status.length - 1].detail,
    description: (
      <Descriptions size="small" bordered items={packageDetailReceived(pkg)} />
    ),
    source: "received",
  }));

  const dataOfAll = allPackage.map((pkg: any) => ({
    key: pkg.id,
    id: pkg.id,
    senderName: pkg.senderName,
    receiverName: pkg.receiverName,
    packageType: pkg.packageType,
    orgPointId: pkg.orgPointId,
    desPointId: pkg.orgPointId,
    generalState: pkg.generalState,
    description: (
      <Descriptions size="small" bordered items={packageDetailAll(pkg)} />
    ),
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

  const [searchQueryByLeader, setSearchQueryByLeader] = useState("");
  const [searchResultByLeader, setSearchResultByLeader] = useState<any>([]);

  useEffect(() => {
    if (role !== LEADER_ROLE) return;

    const resultsByLeader = dataOfAll
      .reverse()
      .filter((item: any) =>
        item.id
          .toString()
          .toLowerCase()
          .includes(searchQueryByLeader.toLowerCase().trim()),
      );

    if (resultsByLeader.length !== searchResultByLeader.length) {
      setSearchResultByLeader(resultsByLeader);
    }
  }, [searchQueryByLeader, dataOfAll]);

  useEffect(() => {
    if (role === LEADER_ROLE) return;
    const results = historyData
      .reverse()
      .filter((item: any) =>
        item.id
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim()),
      );

    if (results.length !== searchResult.length) {
      setSearchResult(results);
    }
  }, [searchQuery, historyData]);

  return (
    <>
      <div className="flex justify-center pb-4">
        {role !== LEADER_ROLE && (
          <div className="w-full">
            <div className="mb-4 ml-3 text-3xl font-bold">Packages History</div>
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
                  scroll={{ x: 1200 }}
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
          </div>
        )}

        {role === LEADER_ROLE && (
          <div className="w-full">
            <div className="mb-4 ml-3 text-3xl font-bold">All Packages</div>
            <div className="mb-4 flex w-full flex-wrap justify-evenly">
              <div className="flex basis-[98%] items-center gap-3 bg-white px-5 py-3 shadow-lg sm:basis-[45%] xl:basis-[23%]">
                <img src="/public/total.svg" width={70} height={70} />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">{totalCount}</span>
                  <span className="text-sm">Total</span>
                </div>
              </div>
              <div className="flex basis-[98%] items-center gap-3 bg-white px-5 py-3 shadow-lg sm:basis-[45%] xl:basis-[23%]">
                <img src="/public/successful.svg" width={70} height={70} />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">{successfulCount}</span>
                  <span className="text-sm">Successful</span>
                </div>
              </div>
              <div className="flex basis-[98%] items-center gap-3 bg-white px-5 py-3 shadow-lg sm:basis-[45%] xl:basis-[23%]">
                <img src="/public/rejected.svg" width={70} height={70} />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">{rejectedCount}</span>
                  <span className="text-sm">Rejected</span>
                </div>
              </div>
              <div className="flex basis-[98%] items-center gap-3 bg-white px-5 py-3 shadow-lg sm:basis-[45%] xl:basis-[23%]">
                <img src="/public/inprogress.svg" width={70} height={70} />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">{inProgressCount}</span>
                  <span className="text-sm">In Progress</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-3 shadow-lg">
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
                    value={searchQueryByLeader}
                    onChange={(e) => setSearchQueryByLeader(e.target.value)}
                  ></Input>
                </Form.Item>
              </Form>

              <SkeletonTable loading={loading} columns={columnsAll}>
                <Table
                  scroll={{ x: 800 }}
                  className="w-full"
                  columns={columnsAll}
                  expandable={{
                    expandedRowRender: (record: any) => (
                      <p style={{ margin: 0 }}>{record.description}</p>
                    ),
                    rowExpandable: (record: any) => record.description !== "",
                  }}
                  dataSource={searchResultByLeader}
                  pagination={paginationOfAll}
                />
              </SkeletonTable>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

PackageManagement.propTypes = {
  role: PropTypes.string,
};
