import { Table } from "antd";
import { sortByNumber, sortByString } from "../helpers/helpers";

interface Shipment {
  id: number;
  name: string;
  weight: number; // in kilograms
  destination: string;
  deliveryDate: string;
  status: string;
}

function createShipment(
  id: number,
  name: string,
  weight: number,
  destination: string,
  deliveryDate: string,
  status: string,
): Shipment {
  return {
    id,
    name,
    weight,
    destination,
    deliveryDate,
    status,
  };
}

const data: Shipment[] = [
  createShipment(1, "Laptop", 3.5, "New York", "2023-11-20", "In Transit"),
  createShipment(
    2,
    "Smartphone",
    0.5,
    "Los Angeles",
    "2023-11-21",
    "Delivered",
  ),
  createShipment(3, "Tablet", 1.2, "Chicago", "2023-11-22", "Pending"),
  createShipment(
    4,
    "Headphones",
    0.3,
    "San Francisco",
    "2023-11-23",
    "Delivered",
  ),
  createShipment(
    5,
    "External Hard Drive",
    1.0,
    "Seattle",
    "2023-11-24",
    "In Transit",
  ),
  createShipment(6, "Printer", 8.2, "Miami", "2023-11-25", "Pending"),
  createShipment(7, "Camera", 2.5, "Boston", "2023-11-26", "In Transit"),
  createShipment(
    8,
    "Bluetooth Speaker",
    0.8,
    "Austin",
    "2023-11-27",
    "Delivered",
  ),
  createShipment(9, "Monitor", 5.0, "Denver", "2023-11-28", "Delivered"),
  createShipment(
    10,
    "Mouse and Keyboard Set",
    0.7,
    "Atlanta",
    "2023-11-29",
    "Pending",
  ),
  createShipment(11, "Backpack", 0.5, "Phoenix", "2023-11-30", "In Transit"),
  createShipment(
    12,
    "Smart Watch",
    0.2,
    "Philadelphia",
    "2023-12-01",
    "Pending",
  ),
  createShipment(13, "Power Bank", 0.4, "Dallas", "2023-12-02", "Delivered"),
  createShipment(
    14,
    "Gaming Laptop",
    4.0,
    "Houston",
    "2023-12-03",
    "In Transit",
  ),
  createShipment(
    15,
    "Wireless Router",
    0.9,
    "Detroit",
    "2023-12-04",
    "Pending",
  ),
  createShipment(
    16,
    "Digital Camera",
    1.2,
    "Minneapolis",
    "2023-12-05",
    "In Transit",
  ),
  createShipment(
    17,
    "Fitness Tracker",
    0.3,
    "San Diego",
    "2023-12-06",
    "Delivered",
  ),
  createShipment(
    18,
    "USB Flash Drive",
    0.1,
    "Portland",
    "2023-12-07",
    "Pending",
  ),
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: sortByString("name"),
    render: (text: string) => <p>{text}</p>,
    width: "30%",
  },
  {
    title: "Destination",
    dataIndex: "destination",
    key: "destination",
    sorter: sortByString("destination"),
    render: (text: string) => <p>{text}</p>,
    width: "20%",
  },
  {
    title: "Delivery Date",
    dataIndex: "deliveryDate",
    key: "deliveryDate",
    sorter: sortByString("deliveryDate"),
    render: (text: string) => <p>{text}</p>,
    width: "20%",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    sorter: sortByString("status"),
    render: (text: string) => <p>{text}</p>,
    width: "20%",
    filters: [
      { text: "Pending", value: "Pending" },
      { text: "In Transit", value: "In Transit" },
      { text: "Delivered", value: "Delivered" },
    ],
    onFilter: (value: string, record: Shipment) => record.status === value,
  },
  {
    title: "Weight",
    dataIndex: "weight",
    key: "weight",
    sorter: sortByNumber("weight"),
    render: (text: string) => <p>{text}</p>,
    width: "10%",
  },
];

export default function EnhancedTable() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-300">
      <Table className="w-[80%]" columns={columns} dataSource={data} />
    </div>
  );
}
