import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import service from "../helpers/service";
import CreatePackage from "../components/CreatePackage";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    service.get("/users/me").then((res) => {
      setData(res.data.results);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {/* <div className="text-3xl font-bold">Home</div> */}
      <CreatePackage departmentId={data.departmentId} />
    </div>
  );
}
