import React from "react";
import ReactLoading from "react-loading";

export default function Loading() {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-[rgba(60,60,60,0.5)]">
      <ReactLoading type="bars" color="white" height={100} width={100} />
    </div>
  );
}
