import { Select } from "antd";
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
import React, { useContext, useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { toast } from "react-toastify";
import AuthContext from "../contexts/AuthContext";
import Loading from "../helpers/Loading";
import { roleValueMap } from "../helpers/helpers";
import service from "../helpers/service";


const { Option } = Select;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Legend,
  Tooltip,
);

export default function PointDashboard() {
  const [months, setMonths] = useState(4);
  const [loading, setLoading] = useState(false);

  const [doughnutStatistics, setDoughnutStatistics] = React.useState<any>({
    datasets: [],
  });

  const [barStatistics, setBarStatistics] = React.useState<any>({
    datasets: [],
  });

  const [statistics, setStatistics] = React.useState<any>();

  const { user } = useContext<any>(AuthContext);
  const [profileUser, setProfileUser] = useState<any>({});

  useEffect(() => {
    service
      .get("/users/me")
      .then((res) => {
        setProfileUser(res.data.results);
        console.log(profileUser);
      })
      .catch((err) => {
        toast.error(err.response);
      });
  }, []);

  function extractMonthLabels(data: any) {
    const currentDate = new Date();
    const tmp = [];
    for (let i = 0; i < data.length; i++) {
      const monthDate = new Date(currentDate);
      monthDate.setMonth(currentDate.getMonth() - i);
      const monthLabel = `${monthDate
        .toLocaleString("en-US", {
          month: "long",
        })
        .slice(0, 3)} ${monthDate.getFullYear()}`;
      tmp.push(monthLabel);
    }
    return tmp.reverse();
  }

  const monthSelection = (value: string) => {
    switch (value) {
      case "4":
        setMonths(4);
        break;
      case "6":
        setMonths(6);
        break;
      case "9":
        setMonths(9);
        break;
      case "12":
        setMonths(12);
        break;
      default:
        break;
    }
  };

  const loadStatistics = () => {
    setLoading(true);
    const roleApiPrefix = roleValueMap[user.role];
    service
      .get(roleApiPrefix + "/statistics", { params: { m : months }})
      .then((res) => {
        if (res.data.status === 200) {
          setStatistics(res.data.results);
          setLoading(false);
          setDoughnutStatistics({
            labels: ["Incoming packages", "Pending packages"],
            datasets: [
              {
                label: "Count",
                data: [res.data.results.incoming, res.data.results.pending],
                borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
                backgroundColor: [
                  "rgba(255, 99, 132, 0.5)",
                  "rgba(54, 162, 235, 0.5)",
                ],
                borderWidth: 1,
              },
            ],
          });

          const monthlyStatistics =
            res.data.results.monthlyStatistics.reverse();

          setBarStatistics({
            labels: extractMonthLabels(monthlyStatistics),
            datasets: [
              {
                label: "Sent",
                data: monthlyStatistics.map((item: any) => item.sent),
                backgroundColor: "rgba(255, 99, 132, 0.7)",
              },
              {
                label: "Received",
                data: monthlyStatistics.map((item: any) => item.received),
                backgroundColor: "rgba(54, 162, 235, 0.7)",
              },
            ],
          });
        } else {
          toast.error(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!user) return;

    loadStatistics();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    loadStatistics();
  }, [months]);

  const doughnutOptions: any = {
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Pending",
        font: {
          size: 30,
        },
      },
    },
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
    <div className="flex h-full w-full flex-col items-center">
      <div
        className="mb-4 flex justify-between rounded-md bg-btnHover px-5 shadow-lg"
        style={{ width: "97%" }}
      >
        <span className="mt-3 text-xl font-bold">
          Welcome back, {profileUser.fullName}
        </span>
        <img
          src="/assets/logo_edit.png"
          width={130}
          height={100}
          className="ml-auto"
        />
      </div>

      {user && (user.role === "EXCHANGE_MANAGER" || user.role === "GATHER_MANAGER") &&(
        <div className="mb-3 ml-auto mr-5">
          <span>Select time range:{"\u00A0"}</span>
          <Select onChange={monthSelection} defaultValue={"4"}>
            <Option value="4">4</Option>
            <Option value="6">6</Option>
            <Option value="9">9</Option>
            <Option value="12">12</Option>
          </Select>
          <span> months</span>
        </div>
      )}

      <div className="mb-4 flex w-full flex-wrap justify-evenly">
        <div className="flex basis-[98%] items-center border border-gray-300 bg-white p-3 px-5 shadow-md md:basis-[46%] xl:basis-[30%]">
          <div className="flex flex-col">
            <div className="text-2xl font-bold">
              {statistics ? statistics.pending + statistics.incoming : 0}
            </div>
            <div className="text-base">Packages Awaiting</div>
          </div>
          <img
            className="ml-auto"
            width={70}
            height={70}
            src="/assets/pending.svg"
          />
        </div>
        <div className="flex basis-[98%] items-center border border-gray-300 bg-white p-3 px-5 shadow-md md:basis-[46%] xl:basis-[30%]">
          <div className="flex flex-col">
            <div className="text-2xl font-bold">
              {statistics ? statistics.totalSent : 0}
            </div>
            <div className="text-base">Sent Records</div>
          </div>
          <img
            className="ml-auto"
            width={70}
            height={70}
            src="/assets/inprogress.svg"
          />
        </div>
        <div className="flex basis-[98%] items-center border border-gray-300 bg-white p-3 px-5 shadow-md md:basis-[46%] xl:basis-[30%]">
          <div className="flex flex-col">
            <div className="text-2xl font-bold">
              {statistics ? statistics.totalReceived : 0}
            </div>
            <div className="text-base">Received Records</div>
          </div>
          <img
            className="ml-auto"
            width={70}
            height={70}
            src="/assets/received.svg"
          />
        </div>
      </div>

      <div className="mb-4 flex w-full flex-wrap justify-evenly max-md:gap-5">
        <div className="relative flex basis-[98%] items-center justify-center border border-gray-300 bg-white p-3 text-center shadow-md md:basis-[46%] xl:basis-[30%]">
          {!statistics && <Loading relative />}

          {statistics && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <b className="text-3xl">
                {statistics.pending + statistics.incoming}
              </b>
              <br />
              <span className="text-md">awaiting packages</span>
            </div>
          )}

          <Doughnut data={doughnutStatistics} options={doughnutOptions} />
        </div>

        <div className="relative flex w-full min-h-[400px] basis-[98%] items-center justify-center border border-gray-300 bg-white p-3 text-center shadow-md md:basis-[98%] xl:basis-[63%]">
          {loading && <Loading relative />}
          <Bar data={barStatistics} options={barOptions} />
        </div>
      </div>
    </div>
  );
}
