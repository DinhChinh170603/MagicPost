import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Table, Tooltip } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FiPrinter } from "react-icons/fi";
import { toast } from "react-toastify";
import DeliveryFailureModal from "../components/DeliveryFailureModal";
import InvoicePrintModal from "../components/InvoicePrintModal";
import SkeletonTable from "../components/SkeletonTable";
import Loading from "../helpers/Loading";
import { EE_ROLE, GE_ROLE } from "../helpers/constants";
import { sortByString } from "../helpers/helpers";
import service from "../helpers/service";
import BulkActionModal from "../components/BulkActionModal";
export default function PackageProcessing(props: any) {
  const { role } = props;
  const [roleAPI, setRoleAPI] = useState("");

  const [open, setOpen] = useState(false);

  const [data, setData] = useState<any>([]);

  const [modalReasonOpen, setModalReasonOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [processLoading, setProcessLoading] = useState(false);

  const [rejectedId, setRejectedId] = useState("");

  const [forwardablePackages, setForwardablePackages] = useState<any>([]);
  const [sendablePackagesToReceiver, setSendablePackagesToReceiver] =
    useState<any>([]);

  useEffect(() => {
    loadData();
  }, [role, roleAPI]);

  const loadData = () => {
    setLoading(true);
    if (role === EE_ROLE) {
      setRoleAPI("/ex-employee");
    } else if (role === "GATHER_EMPLOYEE") {
      setRoleAPI("/gth-employee");
    }

    if (roleAPI) {
      service
        .get(roleAPI + `/pending-packages`)
        .then((res) => {
          if (res.data.status !== 200) {
            toast.error(res.data.message);
            setLoading(false);
            return;
          }
          setSendablePackagesToReceiver([]);
          setForwardablePackages([]);
          const newData = res.data.results.map((item: any) => {
            if (item.to === "Client") {
              /* empty */
            } else if (role == EE_ROLE) {
              if (
                item.status.length > 2 ||
                item.orgPointId === item.desPointId
              ) {
                setSendablePackagesToReceiver((prev: any) => [
                  ...prev,
                  item.id,
                ]);
              } else {
                setForwardablePackages((prev: any) => [...prev, item.id]);
              }
            } else if (role == GE_ROLE) {
              setForwardablePackages((prev: any) => [...prev, item.id]);
            }
            return {
              ...item,
              key: item.id,
            };
          });
          setData(newData);
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setLoading(false);
        });
    }
  };

  const processPackage = (action: string, id: string) => {
    setProcessLoading(true);
    service
      .patch(roleAPI + `/${action}/` + id)
      .then((res) => {
        setProcessLoading(false);
        if (res.data.status === 200) {
          toast.success(res.data.message);
          if (action === "send-receiver") {
            setData((data: any) =>
              data.map((item: any) => ({
                ...item,
                to: item.id === id ? "Client" : null,
              })),
            );
          } else {
            onActionSuccess(id);
          }
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        setProcessLoading(false);
        toast.error(err.response.data.message);
      });
  };

  const onActionSuccess = (id: string) => {
    setData((data: any) => data.filter((item: any) => item.id !== id));
  };

  const pagination = {
    hideOnSinglePage: true,
    pageSize: 5,
    showTotal: (total: number, range: number[]) =>
      `${range[0]}-${range[1]} of ${total} items`,
  };

  const [selectedData, setSelectedData] = useState(null);

  const handlePrint = (rowData: any) => {
    setOpen(true);
    setSelectedData(rowData);
  };

  const columns = [
    ...(role === EE_ROLE
      ? [
          {
            title: "",
            key: "print",
            render: (text: any, record: any) => (
              <Tooltip title="Print Invoice">
                <FiPrinter
                  size={20}
                  className="cursor-pointer text-btnColor hover:text-btnHover"
                  onClick={() => handlePrint(record)}
                ></FiPrinter>
              </Tooltip>
            ),
          },
        ]
      : []),
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      sorter: sortByString("id"),
    },
    {
      title: "From",
      dataIndex: "orgPointId",
      key: "orgPointId",
      sorter: sortByString("orgPointId"),
    },
    {
      title: "Timestamp",
      dataIndex: "status",
      key: "timestamp",
      render: (status: any[]) => {
        const timestampDetail = status.find((s) =>
          s.detail.includes("Gói hàng mới đã được ghi nhận tại điểm"),
        );
        if (timestampDetail) {
          const formattedTimestamp = moment(timestampDetail.timestamp).format(
            "DD-MM-YYYY [at] HH:mm:ss",
          );
          return formattedTimestamp;
        }
        return "";
      },
      sorter: sortByString("timestamp"),
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
      sorter: sortByString("packageType"),
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: any) => {
        const getActionButton = () => {
          if (record.to === "Client") {
            return (
              <div className="flex space-x-1">
                <Button
                  className="rounded-md bg-successBtn hover:bg-[#c1e2f7] hover:font-bold"
                  onClick={() => processPackage("confirm-receiver", record.id)}
                >
                  Success
                </Button>
                <Button
                  className="rounded-md bg-rejectedBtn hover:bg-[#fcefcf] hover:font-bold"
                  onClick={() => {
                    setRejectedId(record.id);
                    setModalReasonOpen(true);
                  }}
                >
                  Failed
                </Button>
              </div>
            );
          } else if (role == EE_ROLE) {
            if (
              record.status.length > 2 ||
              record.orgPointId === record.desPointId
            ) {
              return (
                <Button
                  onClick={() => processPackage("send-receiver", record.id)}
                >
                  Send to receiver
                </Button>
              );
            } else {
              return (
                <Button
                  type="primary"
                  onClick={() => processPackage("send", record.id)}
                >
                  Forward
                </Button>
              );
            }
          } else if (role == GE_ROLE) {
            return (
              <Button
                type="primary"
                onClick={() => processPackage("send", record.id)}
              >
                Forward
              </Button>
            );
          }
        };
        return <>{getActionButton()}</>;
      },
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const results = data.reverse().filter((item: any) =>
      item.id
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim()),
    );

    if (results.length !== searchResult.length) {
      setSearchResult(results);
    }
  }, [searchQuery, data]);

  return (
    <div className="w-full">
      {processLoading && <Loading />}
      <div className="flex">
        <div className="mb-4 ml-3 text-3xl font-bold">Package Processing</div>
        <div className="ml-auto mr-3">
          <Button type="primary" onClick={loadData} loading={loading}>
            Reload
          </Button>
        </div>
      </div>

      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <div className="w-full rounded-xl bg-white p-3 shadow-lg">
          <div className="mb-4 flex w-full items-center justify-between gap-3 rounded-lg bg-white">
            <Input
              placeholder="Package ID"
              className="w-[30%] px-2 py-1"
              suffix={
                <div className="rounded-l px-2 py-1">
                  <SearchOutlined className="transition-all duration-300" />
                </div>
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="primary" onClick={() => setActionModalOpen(true)} loading={loading}>
              Bulk Action
            </Button>
          </div>
          <SkeletonTable className="w-full" loading={loading} columns={columns}>
            <Table
              scroll={{ x: 800 }}
              className="w-full"
              columns={columns}
              dataSource={searchResult}
              pagination={pagination}
            />
          </SkeletonTable>
        </div>
        <InvoicePrintModal open={open} setOpen={setOpen} data={selectedData} />
      </div>
      <DeliveryFailureModal
        isOpen={modalReasonOpen}
        setModalOpen={setModalReasonOpen}
        packageId={rejectedId}
        onRejectSuccess={onActionSuccess}
      />
      <BulkActionModal
        open={actionModalOpen}
        setOpen={setActionModalOpen}
        forwardable={forwardablePackages}
        sendableToReceiver={sendablePackagesToReceiver}
        onActionSuccess={onActionSuccess}
        roleAPI={roleAPI}
      />
    </div>
  );
}

PackageProcessing.propTypes = {
  role: PropTypes.string,
};
