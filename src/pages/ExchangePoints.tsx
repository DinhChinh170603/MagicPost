import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
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
    field: "linkedGatherPoint",
    headerName: "Linked Gather Point",
    valueGetter: (params: GridValueGetterParams) => {
      return params.row.linkedGatherPoint?.name;
    },
    flex: 1,
  },
];

const pagination = {
  paginationModel: {
    pageSize: 5,
  },
};

export default function ExchangePoints() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalFinished, setModalFinished] = useState(false);

  useEffect(() => {
    setLoading(true);
    service
      .get("/leader/exchange-points")
      .then((res) => {
        if (res.data.status !== 200) {
          toast.error(res.data.message);
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
    console.log("Submit from ExchangePoints");
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
