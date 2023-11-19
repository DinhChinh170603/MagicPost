import React from "react";
import EnhancedTable from "../components/EnhancedTable";
import Modal from "../Components/Modal";

export default function Post() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-orange-100">
      <div className="flex flex-col items-center justify-center w-[80%]">
        <div className="w-full mr-auto mb-4">
          <Modal />
        </div>
        <div className="w-full">
          <EnhancedTable />
        </div>
      </div>
    </div>
  );
}
