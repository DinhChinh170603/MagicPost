import { UserAddOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table, Tooltip } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import SkeletonTable from "../components/SkeletonTable";
import { sortByString } from "../helpers/helpers";
import service from "../helpers/service";
import InviteUserModal from "../components/InviteUserModal";
import axios from "axios";

export default function Managers(props: any) {
  const { role } = props;
  const [roleAPI, setRoleAPI] = useState("");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [gmCount, setGmCount] = useState(0);
  const [emCount, setEmCount] = useState(0);
  const [geCount, setGeCount] = useState(0);
  const [eeCount, setEeCount] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);

  const [exchangePointsList, setExchangePointsList] = useState(null);
  const [noManagerExchangePointsList, setNoManagerExchangePointsList] =
    useState(null);
  const [gatherPointsList, setGatherPointsList] = useState(null);
  const [noManagerGatherPointsList, setNoManagerGatherPointsList] =
    useState(null);

  useEffect(() => {
    setLoading(true);
    if (role === "LEADER") {
      setRoleAPI("/leader");
    } else if (role === "EXCHANGE_MANAGER") {
      setRoleAPI("/ex-manager");
    } else if (role === "GATHER_MANAGER") {
      setRoleAPI("/gth-manager");
    }

    if (roleAPI) {
      service
        .get(roleAPI + "/subordinates")
        .then((res) => {
          if (res.data.status !== 200) {
            toast.error(res.data.message);
            setLoading(false);
            return;
          }
          let gmCount = 0;
          let emCount = 0;
          let geCount = 0;
          let eeCount = 0;
          const filteredData = res.data.results.filter(
            (record: { role: string }) => {
              switch (record.role) {
                case "EXCHANGE_MANAGER":
                  emCount++;
                  break;
                case "GATHER_MANAGER":
                  gmCount++;
                  break;
                case "EXCHANGE_EMPLOYEE":
                  eeCount++;
                  break;
                case "GATHER_EMPLOYEE":
                  geCount++;
                  break;
                default:
                  break;
              }

              return (
                record.role !==
                (role === "LEADER"
                  ? "LEADER"
                  : role === "EXCHANGE_MANAGER"
                    ? "EXCHANGE_MANAGER"
                    : "GATHER_MANAGER")
              );
            },
          );

          setGmCount(gmCount);
          setEmCount(emCount);
          setGeCount(geCount);
          setEeCount(eeCount);
          setData(filteredData);
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err);
          setLoading(false);
        });
    }
  }, [role, roleAPI]);

  useEffect(() => {
    axios
      .all([
        service.get("/leader/exchange-points"),
        service.get("/leader/gather-points"),
      ])
      .then(
        axios.spread((res1, res2) => {
          setExchangePointsList(res1.data.results);
          setGatherPointsList(res2.data.results);
          setNoManagerExchangePointsList(
            res1.data.results.filter(
              (exchangePoint: any) => exchangePoint.manager === null,
            ),
          );
          setNoManagerGatherPointsList(
            res2.data.results.filter(
              (gatherPoint: any) => gatherPoint.manager === null,
            ),
          );
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

  // Format to DD-MM-YYYY
  const formatDate = (date: string | number | Date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    const day = formattedDate.getDate();
    const month = formattedDate.getMonth() + 1; // Month starts from 0
    const year = formattedDate.getFullYear();

    // Use template string to format as DD-MM-YYYY
    return `${day < 10 ? "0" : ""}${day}-${
      month < 10 ? "0" : ""
    }${month}-${year}`;
  };

  const removeUser = (id: any) => {
    setLoading(true);
    service
      .delete("/leader/user?id=" + id)
      .then((res) => {
        setLoading(false);
        if (res.data.status !== 200) {
          toast.error(res.data.message);
          return;
        }
        toast.success(res.data.message);
        setData(data.filter((item: any) => item.id !== id));
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setLoading(false);
      });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: sortByString("fullName"),
      width: "20%",
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      render: (dob: any) => formatDate(dob),
      width: "15%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "30%",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "20%",
      ...(role === "LEADER" && {
        filters: [
          {
            text: "GATHER_EMPLOYEE",
            value: "GATHER_EMPLOYEE",
          },
          {
            text: "GATHER_MANAGER",
            value: "GATHER_MANAGER",
          },
          {
            text: "EXCHANGE_MANAGER",
            value: "EXCHANGE_MANAGER",
          },
          {
            text: "EXCHANGE_EMPLOYEE",
            value: "EXCHANGE_EMPLOYEE",
          },
        ],
        onFilter: (value: any, record: any) => record.role.indexOf(value) === 0,
      }),
    },
    {
      title: "Joining Date",
      dataIndex: "startWorkingDate",
      key: "startWorkingDate",
      sorter: (
        a: { startWorkingDate: string | number | Date },
        b: {
          id(id: any): import("react").Key;
          startWorkingDate: string | number | Date;
        },
      ) => {
        const dateA = new Date(a.startWorkingDate);
        const dateB = new Date(b.startWorkingDate);
        return dateA - dateB;
      },
      render: (startWorkingDate: any) => formatDate(startWorkingDate),
      width: "15%",
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: any) => (
        <div className="flex justify-center">
          <Tooltip title="Remove user">
            <Popconfirm
              title="Remove user"
              description="Are you sure you want to remove this user?"
              onConfirm={() => removeUser(record.id)}
              placement="left"
              okText="Yes"
              cancelText="No"
            >
              <AiOutlineDelete
                color="red"
                size={20}
                className="cursor-pointer"
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  const pagination = {
    hideOnSinglePage: false,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "15", "20", "25", "30"],
    defaultPageSize: 5,
    showTotal: (total: number, range: number[]) =>
      `${range[0]}-${range[1]} of ${total} items`,
  };

  return (
    <>
      <div className="pb-4">
        <div className="mb-4 ml-3 text-3xl font-bold">Subordinates</div>
        <div className="mb-4 flex w-full flex-wrap justify-evenly">
          <div className="flex basis-[98%] items-center gap-3 bg-white px-5 py-3 shadow-lg sm:basis-[45%] xl:basis-[23%]">
            <img src="/src/assets/GM.svg" width={70} height={70} />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{gmCount}</span>
              <span className="text-sm">Gather managers</span>
            </div>
          </div>
          <div className="flex basis-[98%] items-center gap-3 bg-white px-5 py-3 shadow-lg sm:basis-[45%] xl:basis-[23%]">
            <img src="/src/assets/EM2.svg" width={70} height={70} />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{emCount}</span>
              <span className="text-sm">Exchange managers</span>
            </div>
          </div>
          <div className="flex basis-[98%] items-center gap-3 bg-white px-5 py-3 shadow-lg sm:basis-[45%] xl:basis-[23%]">
            <img src="/src/assets/GE.svg" width={70} height={70} />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{geCount}</span>
              <span className="text-sm">Gather employees</span>
            </div>
          </div>
          <div className="flex basis-[98%] items-center gap-3 bg-white px-5 py-3 shadow-lg sm:basis-[45%] xl:basis-[23%]">
            <img src="/src/assets/EE.svg" width={70} height={70} />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{eeCount}</span>
              <span className="text-sm">Exchange employees</span>
            </div>
          </div>
        </div>
        <div className="mb-2 flex w-full justify-end">
          <Button
            className="mr-3"
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setModalOpen(true)}
          >
            Invite
          </Button>
        </div>
        <div className="rounded-xl bg-white p-3 shadow-lg">
          <SkeletonTable className="w-full" loading={loading} columns={columns}>
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
      <InviteUserModal
        open={modalOpen}
        setOpen={setModalOpen}
        gatherPointsList={gatherPointsList}
        exchangePointsList={exchangePointsList}
        noManagerGatherPointsList={noManagerGatherPointsList}
        noManagerExchangePointsList={noManagerExchangePointsList}
      />
    </>
  );
}

Managers.propTypes = {
  role: PropTypes.string,
};
