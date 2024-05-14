import * as React from "react";

export default function Loader() {
  const [text, setText] = React.useState("Loading");
  const [showImg, setShowImg] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setShowImg(false);
      setText("I waited for 3 seconds");
    }, 3000);
  }, []);
  return (
    <div>
      {showImg ? <img src="./Loader.svg" alt="loading" /> : <h1>{text}</h1>}
    </div>
  );
}
