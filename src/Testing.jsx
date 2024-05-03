import Webcam from "react-webcam";
import Loader from "./Components/Loader";
import * as React from "react";

const Testing = () => {
  const webcamRef = React.useRef(null);
  const [image, setImage] = React.useState(null);
  const [useWebcam, setUseWebcam] = React.useState(true);
  const [isShowLoader, setIsShowLoader] = React.useState(false);
  const [isShowModal, setIsShowModal] = React.useState(false);
  const modalRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setUseWebcam(false);
    setIsShowModal(true);
    setImage(imageSrc);
  }, [webcamRef]);

  const closeModal = (e) => {
    if (e.target === modalRef.current) {
      setIsShowModal(false);
      setImage(null);
      setUseWebcam(true);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-between">
      <h1 className="bg-gradient-to-r from-red-400 to-blue-500 bg-clip-text text-center text-3xl font-bold text-transparent">
        Detect Fruit
      </h1>
      <div className="flex flex-grow items-center justify-center">
        {isShowModal && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80"
            onClick={closeModal}
            ref={modalRef}
          >
            <Loader />
          </div>
        )}
        {image && (
          <img
            src={image}
            alt="image-of-fruit"
            className="h-4/5 w-4/5 rounded object-cover"
            name="image"
          />
        )}
        {useWebcam && (
          <Webcam
            className=" h-4/5 w-4/5 rounded object-cover"
            ref={webcamRef}
          />
        )}
        <button
          className="mb-3 ml-5 rounded-md border-2 border-black bg-blue-300 px-6 py-3 text-xs font-bold text-black transition-colors duration-500 hover:bg-blue-600 hover:text-white"
          onClick={capture}
        >
          Detect
        </button>
      </div>
    </div>
  );
};

export default Testing;
