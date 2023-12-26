import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Select } from "antd";
import React, { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";
import service from "../helpers/service";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";


ChartJS.register(
  CategoryScale,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  ArcElement,
  Title,
  Legend,
  Tooltip,
);

export default function LeaderDashboard() {
  const [months, setMonths] = useState(4);

  const [hrStatisticsLoading, setHrStatisticsLoading] = useState(false);
  const [packagesStatisticsLoading, setPackagesStatisticsLoading] =
    useState(false);
  const [revenueLoading, setRevenueLoading] = useState(false);

  const [totalEmployees, setTotalEmployees] = useState(-1);
  const [thisMonthRevenue, setThisMonthRevenue] = useState(0);
  const [lastMonthRevenue, setLastMonthRevenue] = useState(0);
  const [growthRate, setGrowthRate] = useState(1);
  const [profileUser, setProfileUser] = useState<any>({});

  const [packagesStatistics, setPackagesStatistics] = useState<any>({
    datasets: [],
  });

  const [revenue, setRevenue] = useState<any>({
    datasets: [],
  });

  const [usersStatistics, setUsersStatistics] = useState<any>({
    datasets: [],
  });

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

  React.useEffect(() => {
    setPackagesStatisticsLoading(true);
    setRevenueLoading(true);
    service
      .get("/leader/packages-statistics", { params: { m: months } })
      .then((res) => {
        const statistics = res.data.results.reverse();

        const monthLabels = extractMonthLabels(statistics);

        setPackagesStatisticsLoading(false);

        setPackagesStatistics({
          labels: monthLabels,
          datasets: [
            {
              label: "Total",
              data: statistics.map((item: any) => item.total),
              fill: false,
              borderColor: "rgb(75, 192, 192)",
            },
            {
              label: "Successful",
              data: statistics.map((item: any) => item.success),
              fill: false,
              borderColor: "rgb(255, 99, 132)",
            },
            {
              label: "Rejected",
              data: statistics.map((item: any) => item.rejected),
              fill: false,
              borderColor: "rgb(54, 162, 235)",
            },
            {
              label: "In Progress",
              data: statistics.map((item: any) => item.inProgress),
              fill: false,
              borderColor: "rgb(255, 205, 86)",
            },
          ],
        });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setPackagesStatisticsLoading(false);
      });

    service
      .get("/leader/revenue-statistics", { params: { m: months } })
      .then((res) => {
        const statistics = res.data.results.reverse();

        const monthLabels = extractMonthLabels(statistics);

        setRevenueLoading(false);
        setThisMonthRevenue(statistics[statistics.length - 1]?.revenue || 0);
        setLastMonthRevenue(statistics[statistics.length - 2]?.revenue || 0);

        setRevenue({
          labels: monthLabels,
          datasets: [
            {
              label: "Total",
              data: statistics.map((item: any) => item.revenue),
              fill: true,
              borderColor: "rgb(75, 192, 192)",
            },
          ],
        });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setPackagesStatisticsLoading(false);
      });

    if (!usersStatistics.labels) {
      setHrStatisticsLoading(true);
      service
        .get("/leader/hr-statistics")
        .then((res) => {
          const statistics = res.data.results;

          setUsersStatistics({
            labels: [
              "Exchange point managers",
              "Gather point managers",
              "Exchange point employees",
              "Gather point employees",
            ],
            datasets: [
              {
                label: "Count",
                data: [
                  statistics.em,
                  statistics.gm,
                  statistics.ee,
                  statistics.ge,
                ],
                borderColor: [
                  "rgb(255, 99, 132)",
                  "rgb(54, 162, 235)",
                  "rgb(255, 205, 86)",
                  "rgb(75, 192, 192)",
                ],
                backgroundColor: [
                  "rgba(255, 99, 132, 0.5)",
                  "rgba(54, 162, 235, 0.5)",
                  "rgba(255, 205, 86, 0.5)",
                  "rgba(75, 192, 192, 0.5)",
                ],
                borderWidth: 1,
              },
            ],
          });

          setTotalEmployees(
            statistics.em + statistics.gm + statistics.ee + statistics.ge,
          );

          setHrStatisticsLoading(false);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setHrStatisticsLoading(false);
        });
    }
  }, [months]);

  useEffect(() => {
    setGrowthRate(thisMonthRevenue / lastMonthRevenue);
  }, [thisMonthRevenue, lastMonthRevenue]);

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

  const options: any = {
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

  const optionsBarChart: any = {
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Workforce",
        font: {
          size: 30,
        },
      },
    },
  };

  const optionRevenue: any = {
    plugins: {
      legend: {
        display: false,
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
        <img src="/src/assets/logo_edit.png" width={130} height={100} />
      </div>

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

      <div className="mb-4 flex w-full flex-wrap justify-evenly gap-3 md:gap-0">
        <div className="relative flex basis-[98%] items-center justify-center border border-gray-300 bg-white p-3 text-center shadow-md md:basis-[46%] xl:basis-[40%]">
          {hrStatisticsLoading && <Loading relative />}

          {totalEmployees !== -1 && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-sm:hidden">
              <b className="text-4xl">{totalEmployees}</b>
              <br />
              <span className="text-xl">employees</span>
            </div>
          )}
          <Doughnut data={usersStatistics} options={optionsBarChart} />
        </div>

        <div className="flex basis-[98%] flex-col space-y-3 md:basis-[98%] xl:basis-[55%]">
          <div className="relative flex basis-[30%] flex-col items-center justify-between border border-gray-300 bg-white p-3 shadow-md lg:flex-row">
            <div className="self-center pl-3">
              <span className="text-xl">Revenue this month</span>
              <br></br>
              <b className="text-4xl">{thisMonthRevenue} VND</b>
              <div>
                {growthRate >= 1 ? (
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <FaArrowUp color="green" size={20} className="mr-1" />
                    <span className="text-lg text-green-700">
                      {" "}
                      {Math.abs(growthRate * 100 - 100).toFixed(1)}% {"\u00A0"}
                    </span>
                    <span className="text-lg"> Since last month</span>
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <FaArrowDown color="red" size={20} className="mr-1" />
                    <span className="text-lg text-red-700">
                      {" "}
                      {Math.abs(growthRate * 100 - 100).toFixed(1)}% {"\u00A0"}
                    </span>
                    <span className="text-lg"> Since last month</span>
                  </span>
                )}
              </div>
            </div>
            <div>
              {revenueLoading && <Loading relative />}
              <Line
                data={revenue}
                options={optionRevenue}
                className="max-sm:w-full"
              />
            </div>
          </div>
          <div className="relative flex w-full basis-[70%] items-center justify-center border border-gray-300 bg-white p-3 text-center shadow-md min-h-[400px]">
            {packagesStatisticsLoading && <Loading relative />}
            <Line data={packagesStatistics} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
