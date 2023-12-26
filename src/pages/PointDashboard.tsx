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
import { EE_ROLE, GE_ROLE } from "../helpers/constants";
import { roleValueMap } from "../helpers/helpers";
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

export default function PointDashboard() {
  const [doughnutStatistics, setDoughnutStatistics] = React.useState<any>({
    datasets: [],
  });

  const [barStatistics, setBarStatistics] = React.useState<any>({
    datasets: [],
  });

  const [statistics, setStatistics] = React.useState<any>();

  const { user } = useContext<any>(AuthContext);
  const [profileUser, setProfileUser] = useState<any>({});

  useEffect (() => {
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

  const loadStatistics = () => {
    const roleApiPrefix = roleValueMap[user.role];
    service
      .get(roleApiPrefix + "/statistics")
      .then((res) => {
        if (res.data.status === 200) {
          setStatistics(res.data.results);
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
        }
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };

  useEffect(() => {
    if (!user) return;

    loadStatistics();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    loadStatistics;
  }, []);

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
  };

  return (
    <div className="flex h-full w-full flex-col items-center">
      <div
        className="mb-4 flex rounded-md bg-btnHover px-5 shadow-lg justify-between"
        style={{ width: "97%" }}
      >
        <span className="mt-3 text-xl font-bold">Welcome back, {profileUser.fullName}</span>
        <img
          src="/src/assets/logo_edit.png"
          width={130}
          height={100}
          className="ml-auto"
        />
      </div>

      <div className="mb-4 flex w-[80%] flex-wrap justify-evenly">
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
            src="/src/assets/pending.svg"
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
            src="/src/assets/inprogress.svg"
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
            src="/src/assets/received.svg"
          />
        </div>
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
          {!statistics && <Loading relative />}

          {statistics && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <b className="text-4xl">
                {statistics.pending + statistics.incoming}
              </b>
              <br />
              <span className="text-lg">awaiting packages</span>
            </div>
          )}

          <Doughnut data={doughnutStatistics} options={doughnutOptions} />
        </div>

        {user && user.role !== EE_ROLE && user.role !== GE_ROLE && (
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
            {!statistics && <Loading relative />}
            <Bar data={barStatistics} options={barOptions} />
          </div>
        )}
      </div>
    </div>
  );
}
