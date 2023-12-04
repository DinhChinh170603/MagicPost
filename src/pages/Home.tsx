import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import service from "../helpers/service";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ĐÃ TẠO ĐƯỢC PACKAGE

  // useEffect(() => {
  //   setLoading(true);
  //   service
  //     .post(`/ex-employee/new-package`, {
  //       senderName: "Vu Ngoc Anh",
  //       senderContact: "0123456789",
  //       receiverName: "Ho Thu Giang",
  //       receiverContact: "0987654321",
  //       orgAddress: "Xuan Dinh",
  //       desAddress: "Ngo 259 Yen Hoa",
  //       packageType: "GOODS", 
  //       weight: 0.2,
  //       desPoint: {
  //         id: "HN_TX_01G3",
  //       },
  //     })
  //     .then((res) => {
  //       if (res.data.status !== 200) {
  //         toast.error(res.data.message);
  //         setLoading(false);

  //         return;
  //       }
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="text-3xl font-bold">Home</div>
    </div>
  );
}
