import React, { useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { toast } from "react-toastify";
import service from "../helpers/service";
import {
  Chart as ChartJS,
  CategoryScale,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Legend,
  Tooltip,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Legend,
  Tooltip,
  ArcElement,
);

export default function Home() {
  const [months, setMonths] = useState(4);

  const [packagesStatistics, setPackagesStatistics] = useState<any>({
    datasets: [],
  });

  const [usersStatistics, setUsersStatistics] = useState<any>({
    datasets: [],
  });

  React.useEffect(() => {
    service
      .get("/leader/packages-statistics", { params: { m: months } })
      .then((res) => {
        const statistics = res.data.results.reverse();

        const monthLabels = extractMonthLabels(statistics);

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
      });

    service.get("/leader/hr-statistics").then((res) => {
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
            data: [statistics.em, statistics.gm, statistics.ee, statistics.ge],
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
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Packages statistics",
      },
    },
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-bgColor">
      <Doughnut data={usersStatistics} />
      <Line data={packagesStatistics} options={options} />
    </div>
  );
}
