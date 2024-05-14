import Webcam from "react-webcam";
// import Loader from "./Components/Loader";
import axios from "axios";
import * as React from "react";

const convertBlob = (image) => {
  console.log(image);
  const byteString = atob(image.split(",")[1]);
  const mimeString = image.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  console.log("blob", blob);
  return blob;
};

const convertAndSendImageForDetection = async (imageSrc) => {
  const blob = convertBlob(imageSrc);
  const formData = new FormData();
  formData.append("image", blob, "image.jpg");
  console.log("formData", formData);
  try {
    // const response = await axios.post("http://localhost:5000/detect", formData);
    const response = await axios.post(
      "https://cloud-server-detect.onrender.com/detect",
      formData,
    );
    console.log(response.data);
    if (!Object.prototype.hasOwnProperty.call(response.data, "failed")) {
      console.log(response.data.fruits);
      return response.data;
    } else {
      alert(response.data.failed);
    }
  } catch (error) {
    console.error(error);
  }
};

const Testing = () => {
  const webcamRef = React.useRef(null);
  const [image, setImage] = React.useState(null);
  const [useWebcam, setUseWebcam] = React.useState(true);
  const [isShowLoader, setIsShowLoader] = React.useState(false);
  const [isShowModal, setIsShowModal] = React.useState(false);
  const [modalInfo, setModalInfo] = React.useState(null);
  const modalRef = React.useRef(null);

  const capture = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc === null) return;
    setModalInfo(null);
    // setUseWebcam(false);
    setIsShowModal(true);
    setImage(imageSrc);
    setIsShowLoader(true);

    const detectedData = await convertAndSendImageForDetection(imageSrc);
    setModalInfo(detectedData);
    setIsShowLoader(false);
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
      <h1 className="bg-gradient-to-r from-green-400 to-slate-500 bg-clip-text text-center text-3xl font-bold text-transparent">
        Detect Fruit
      </h1>
      <div className="flex flex-grow items-center justify-center">
        {isShowModal && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80"
            onClick={closeModal}
            ref={modalRef}
          >
            {isShowLoader ? (
              <img src="./Loader.svg" alt="loading" className="h-auto w-auto" />
            ) : null}
            {modalInfo != null ? (
              <div className="flex flex-row rounded-lg bg-white p-5">
                <img
                  src={"data:image/jpeg;base64," + modalInfo.image}
                  alt="image-of-fruit"
                  className="h-3/4 w-3/4 rounded object-cover"
                  name="image"
                />
                {/* <div className="flex flex-col p-0 ">
                  {Object.entries(modalInfo.fruits).map(
                    ([fruit, count], index) => {
                      return (
                        <div key={index}>
                          <h1 className="ml-5 text-base font-bold">{`${fruit}: ${count}`}</h1>
                        </div>
                      );
                    },
                  )}
                </div> */}
                <table className="table-auto border-collapse border-2 border-green-500">
                  <thead>
                    <tr className="bg-green-500 text-white">
                      <th className="border-r border-black px-4 py-2">Fruit</th>
                      <th className="px-4 py-2">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(modalInfo.fruits).map(
                      ([fruit, count], index) => {
                        return (
                          <tr
                            key={index}
                            className="border-b border-green-200 text-center"
                          >
                            <td className="border-r border-black px-4 py-2">
                              {fruit}
                            </td>
                            <td className="px-4 py-2">{count}</td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        )}
        {/* {image && (
          <img
            src={image}
            alt="image-of-fruit"
            className="h-4/5 w-4/5 rounded object-cover"
            name="image"
          />
        )} */}
        {useWebcam && (
          <Webcam
            className=" h-4/5 w-4/5 rounded object-cover"
            ref={webcamRef}
          />
        )}
        <button
          className="mb-3 ml-5 rounded-md border-2 border-black bg-green-300 px-6 py-3 text-xs font-bold text-black transition-colors duration-500 hover:bg-green-600 hover:text-white"
          onClick={capture}
        >
          Detect
        </button>
      </div>
    </div>
  );
};

export default Testing;
