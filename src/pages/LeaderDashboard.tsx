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
import React, { useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { toast } from "react-toastify";
import Loading from "../helpers/Loading";
import service from "../helpers/service";

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

  const [totalEmployees, setTotalEmployees] = useState(-1);

  const [packagesStatistics, setPackagesStatistics] = useState<any>({
    datasets: [],
  });

  const [usersStatistics, setUsersStatistics] = useState<any>({
    datasets: [],
  });

  React.useEffect(() => {
    setHrStatisticsLoading(true);
    setPackagesStatisticsLoading(true);
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
  }, []);

  function extractMonthLabels(data: any) {
    const currentDate = new Date();
    const tmp = [];
    for (let i = 0; i < data.length; i++) {
      const monthDate = new Date(currentDate);
      monthDate.setMonth(currentDate.getMonth() - i);
      const monthLabel = `${monthDate
        .toLocaleString("default", {
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

  return (
    <div className="flex h-full w-full flex-col items-center bg-bgColor">
      <div
        className="mb-4 flex rounded-md bg-btnHover px-5 pr-20 shadow-lg"
        style={{ width: "1210px" }}
      >
        <span className="mt-3 text-xl font-bold">Welcome back</span>
        <img
          src="/src/assets/logo_edit.png"
          width={130}
          height={100}
          className="ml-auto"
        />
      </div>

      <div
        style={{ display: "flex", gap: "20px" }}
        className="flex-col xl:flex-row"
      >
        <div
          style={{
            width: "500px",
            height: "500px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            backgroundColor: "white",
            position: "relative",
          }}
        >
          {hrStatisticsLoading && <Loading relative />}

          {totalEmployees !== -1 && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <b className="text-4xl">{totalEmployees}</b>
              <br />
              <span className="text-xl">employees</span>
            </div>
          )}
          <Doughnut data={usersStatistics} options={optionsBarChart} />
        </div>
        <div
          style={{
            width: "700px",
            height: "350px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            backgroundColor: "white",
            position: "relative",
          }}
        >
          {packagesStatisticsLoading && <Loading relative />}
          <Line data={packagesStatistics} options={options} />
        </div>
      </div>
    </div>
  );
}
