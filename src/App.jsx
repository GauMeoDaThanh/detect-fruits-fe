import * as React from "react";
import axios from "axios";
import Modal from "./Components/Modal";
import Webcam from "react-webcam";

function App() {
  const [showModal, setShowModal] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [useWebcam, setUseWebcam] = React.useState(false);
  const [detectedImage, setDetectedImage] = React.useState("");
  const [detectedInfo, setDetectedInfo] = React.useState({});
  const webcamRef = React.useRef(null);
  const fileRef = React.useRef(null);

  const handleWebcam = () => {
    setUseWebcam(!useWebcam);
    fileRef.current.value = "";
    setImage(null);
  };
  const handleImageChange = (e) => {
    setUseWebcam(false);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setUseWebcam(false);
    setImage(imageSrc);
  }, [webcamRef]);
  const handlerSubmit = async (e) => {
    e.preventDefault();
    if (image === null) return;

    const byteString = atob(image.split(",")[1]);
    const mimeString = image.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    const formData = new FormData(e.target);
    formData.append("image", blob, "image.jpg");
    try {
      const response = await axios.post(
        "http://192.168.1.9:5000/detect",
        formData,
      );
      console.log(response.data);
      if (!Object.prototype.hasOwnProperty.call(response.data, "failed")) {
        setDetectedImage("data:image/jpeg;base64," + response.data.image);
        setDetectedInfo(response.data.fruits);
        console.log(response.data.fruits);
        setShowModal(true);
      } else {
        alert(response.data.failed);
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);
  return (
    <>
      <h1 className="mx-96 bg-gradient-to-r from-red-400 to-blue-500  bg-clip-text text-center text-3xl font-bold text-transparent">
        Detect Fruit
      </h1>
      <form
        onSubmit={handlerSubmit}
        method="post"
        className="m-4 flex flex-row items-end justify-center space-x-4"
      >
        {useWebcam && (
          <Webcam
            width={640}
            height={640}
            ref={webcamRef}
            screenshotQuality={1}
            className="rounded"
            screenshotFormat="image/jpeg"
          ></Webcam>
        )}
        {image && (
          <img
            src={image}
            alt="image-of-fruit"
            className="rounded"
            name="image"
            width={640}
            height={640}
          />
        )}
        <div className="mt-auto flex flex-col space-y-2">
          {image !== null && (
            <button
              type="submit"
              className="rounded-md border-2 border-black bg-green-300 p-2 text-xs text-black transition-colors duration-500 hover:bg-green-600 hover:text-white"
            >
              Detect
            </button>
          )}
          {useWebcam && (
            <button
              type="button"
              onClick={capture}
              className="rounded-md border-2 border-black bg-green-300 p-2 text-xs text-black transition-colors duration-500 hover:bg-green-600 hover:text-white"
            >
              Capture photo
            </button>
          )}
          <button
            type="button"
            onClick={handleWebcam}
            className="cursor-pointer rounded-md border-2 border-black p-2 text-xs text-black transition-colors duration-500 hover:bg-blue-600 hover:text-white"
          >
            Use webcam
          </button>
          <input
            type="file"
            id="imageFile"
            style={{ display: "none" }}
            onChange={handleImageChange}
            accept="image/*"
            name="file"
            ref={fileRef}
          />
          <label
            htmlFor="imageFile"
            className="cursor-pointer rounded-md border-2 border-black p-2 text-xs text-black transition-colors duration-500 hover:bg-blue-600 hover:text-white"
          >
            Upload Image
          </label>
        </div>
      </form>
      <div className="flex h-screen flex-col items-center">
        {showModal && (
          <Modal
            onClose={() => setShowModal(false)}
            detectedImage={detectedImage}
            detectedInfo={detectedInfo}
          ></Modal>
        )}
      </div>
    </>
  );
}

export default App;
