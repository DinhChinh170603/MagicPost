import PropTypes from "prop-types";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SkeletonTable from "../components/SkeletonTable";
import { sortByString } from "../helpers/helpers";
import service from "../helpers/service";

export default function Managers(props: any) {
  const { role } = props;
  const [roleAPI, setRoleAPI] = useState("");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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
          const filteredData = res.data.results.filter((record) => record.role !== (role === "LEADER" ? "LEADER" : (role === "EXCHANGE_MANAGER" ? "EXCHANGE_MANAGER" : "GATHER_MANAGER")));
          setData(filteredData);
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err);
          setLoading(false);
        });
    }
  }, [role, roleAPI]);

  // Format to DD-MM-YYYY
  const formatDate = (date) => {
    if (!date) return ''; 
    const formattedDate = new Date(date);
    const day = formattedDate.getDate();
    const month = formattedDate.getMonth() + 1; // Month starts from 0
    const year = formattedDate.getFullYear();

    // Use template string to format as DD-MM-YYYY
    return `${day < 10 ? "0" : ""}${day}-${month < 10 ? "0" : ""}${month}-${year}`;
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
      render: (dob) => formatDate(dob),
      width: "15%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      // sorter: sortByString("email"),
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
            text: "GATHER_MANAGER",
            value: "EXCHANGE_EMPLOYEE",
          },
        ],
        onFilter: (value: any, record: any) =>
          record.role.indexOf(value) === 0,
      }),
    },
    {
      title: "Joining Date",
      dataIndex: "startWorkingDate",
      key: "startWorkingDate",
      sorter: (a, b) => {
        const dateA = new Date(a.startWorkingDate);
        const dateB = new Date(b.startWorkingDate);
        return dateA - dateB;
      },
      render: (startWorkingDate) => formatDate(startWorkingDate),
      width: "15%",
    },
  ];

  const pagination = {
    hideOnSinglePage: false,
    pageSize: 5,
    showTotal: (total: number, range: number[]) =>
      `${range[0]}-${range[1]} of ${total} items`,
  };

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <SkeletonTable className="w-[90%]" loading={loading} columns={columns}>
          <Table
            className="w-[90%]"
            columns={columns}
            dataSource={data}
            rowKey={(record) => String(record.id)}
            pagination={pagination}
          />
        </SkeletonTable>
      </div>
    </>
  );
}

Managers.propTypes = {
  role: PropTypes.string,
};
