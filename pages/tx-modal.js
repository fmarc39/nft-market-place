import React, { useEffect, useRef } from "react";
import Image from "next/image";
import LoadingLogo from "../public/assets/logo/circles.svg";

const TxModal = ({ txHash, setModal }) => {
  let menuRef = useRef();

  useEffect(() => {
    let handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
        setModal(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-bgExtModal">
        <div className="relative w-auto my-6 mx-auto max-w-3xl" ref={menuRef}>
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-lightBlack outline-none focus:outline-none">
            <div className="p-6">
              <div className="flex flex-col justify-center items-center">
                <Image
                  src={LoadingLogo}
                  alt="loading-logo"
                  height={35}
                  width={35}
                />
                <h3 className="text-l font-semibold text-white mt-4">
                  Broadcating Transaction...
                </h3>
              </div>
            </div>
            <div className="bg-bgModal p-4 m-4 shadow-lg rounded-lg">
              <p className="text-white9">Tx Hash</p>
              <p className="text-white9">{txHash}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default TxModal;
