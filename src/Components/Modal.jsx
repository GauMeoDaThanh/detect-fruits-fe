/* eslint-disable react/prop-types */
import React, { useRef } from "react";
import { X } from "lucide-react";

const Modal = ({ onClose, detectedInfo, detectedImage }) => {
  const modalRef = useRef(null);
  const closeModal = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className="fixed inset-0 flex  justify-center bg-black bg-opacity-30 backdrop-blur-sm"
    >
      <div className="mt-5 flex flex-col text-white">
        <button onClick={onClose} className="place-self-end">
          <X size={30}></X>
        </button>
        <div className="flex flex-col items-center gap-5 rounded-xl bg-indigo-600 px-10 py-5">
          <h1 className="text-3xl font-extrabold">Detect result</h1>
          <div className="flex flex-row space-x-7">
            <img
              src={detectedImage}
              alt="detected"
              className="rounded"
              width={640}
              height={640}
            />
            <div className="flex flex-col">
              <h2 className="mb-4 text-2xl font-bold">The image have</h2>
              <ul>
                {Object.entries(detectedInfo).map(([key, value]) => (
                  <li key={key}>{key}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
