import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import service from "../helpers/service";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="text-3xl font-bold">Home</div>
    </div>
  );
}
