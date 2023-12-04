import React from 'react'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import service from "../helpers/service";


export default function PackageDetail() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    service
      .get(`/ex-manager/sent-packages`)
      .then((res) => {
        if (res.data.status !== 200) {
          toast.error(res.data.message);
          setLoading(false);

          return;
        }
        setData(res.data.results);
        console.log(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>PackageDetail</div>
  )
}
