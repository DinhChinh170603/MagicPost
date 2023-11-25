import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import Loading from "../helpers/Loading";
import service from "../helpers/service";

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
  },
  {
    field: "manager",
    headerName: "Manager",
    valueGetter: (params: GridValueGetterParams) => {
      return params.row.manager?.fullName;
    },
    flex: 1,
  },
  {
    field: "location",
    headerName: "Location",
    flex: 1,
  },
  {
    field: "linkedExchangePoints",
    headerName: "Linked Exchange Points",
    renderCell: (params: GridRenderCellParams) => {
      return params.row.linkedExchangePoints.map((point) => (
        <>
          <Link key={point.id} to={`/exchange-points/${point.id}`}>
            {point.name}
            <br />
          </Link>
        </>
      ));
    },
    flex: 1,
  },
];

const pagination = {
  paginationModel: {
    pageSize: 5,
  },
};

export default function GatherPoints() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalFinished, setModalFinished] = useState(false);

  useEffect(() => {
    setLoading(true);
    service
      .get("/leader/gather-points")
      .then((res) => {
        if (res.data.status !== 200) {
          toast.error(res.data.message);
          console.log(res.data.results);
          setLoading(false);
          return;
        }
        setData(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err);
        setLoading(false);
      });
  }, [modalFinished]);

  const handleModalSubmit = () => {
    console.log("Submit from GatherPoints");
    setModalFinished((prev) => !prev);
  };

  return (
    <>
      {loading && <Loading />}
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-lime-100">
        <div className="w-[80%]">
          <div className="flex justify-start">
            <Modal
              onSubmit={handleModalSubmit}
              apiEndpoint="/leader/exchange-point"
            />
          </div>
          <DataGrid
            classes={{
              root: "bg-white",
              columnHeader: "bg-slate-300",
            }}
            columns={columns}
            rows={data}
            initialState={{ pagination }}
            autoHeight
            getRowId={(row) => row.id}
            isRowSelectable={() => false}
          />
        </div>
      </div>
    </>
  );
}
