import * as React from "react";
import axios from "axios";

function App() {
  const [image, setImage] = React.useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const handlerSubmit = async (e) => {
    e.preventDefault();
    if (image === null) return;

    const formData = new FormData(e.target);

    try {
      const response = await axios.post(
        "http://localhost:5000/detect",
        formData,
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <h1 className="bg-gradient-to-r from-red-400 to-blue-500 bg-clip-text text-center text-3xl font-bold text-transparent">
        Detect Fruit
      </h1>
      <form
        onSubmit={handlerSubmit}
        method="post"
        className="m-4 flex flex-row items-center justify-center space-x-4"
      >
        {image && (
          <img src={image} alt="image-of-fruit" className="size-80 rounded" />
        )}
        <div className="flex flex-col space-y-2">
          <button
            type="submit"
            className="rounded-md border-2 border-black bg-green-300 p-2 text-xs text-black transition-colors duration-200 hover:bg-green-600 hover:text-white"
          >
            Detect
          </button>
          <input
            type="file"
            id="imageFile"
            style={{ display: "none" }}
            onChange={handleImageChange}
            accept="image/*"
            name="file"
          />
          <label
            htmlFor="imageFile"
            className="cursor-pointer rounded border-2 border-black p-2 text-xs text-black transition-colors duration-200 hover:bg-blue-600 hover:text-white"
          >
            Upload Image
          </label>
        </div>
      </form>
    </>
  );
}

export default App;
