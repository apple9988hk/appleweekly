import React, { useEffect, useState, Component } from "react";
import mergeImages from "merge-images";
import axios from "axios";

export default function JImage() {
  // const pixel = { width: 752, height: 480 };
  const toDisplay = { width: 1250 };
  const [mergedSrc, setMergedSrc] = useState(null);
  const [mergedImageSize, setMergedImageSize] = useState({
    width: null,
    height: null,
  });
  const [pixel, setPixel] = useState({ width: 0, height: 0 });
  const [textInfo, setTextInfo] = useState(null);
  const [fetched, setFetched] = useState([]);
  const [fetchId, setFetchId] = useState("");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [fullSizeOption, setFullSizeOption] = useState(false);
  const [displayTextOption, setDisplayTextOption] = useState(true);
  const [fetchStatus, setFetchStatus] = useState("Idle");
  // const [src, setSrc] = useState(null);

  const addJImage = async () => {
    if (fetchId.length !== 10) {
      console.log("Invalid Id");
    } else {
      setFetchStatus("Loading");
      setMergedSrc(null);
      setTextInfo(null);
      setPixel({ width: 0, height: 0 });
      setFetched([]);
      const snapshot = await axios.get(
        `http://tmdata.udc.local/api/spectral/pixel-image/${fetchId}`
      );
      setFetched(snapshot.data);
      setFetchStatus("Drawing");
    }
  };

  const toggleFullSize = () => {
    setFullSizeOption(!fullSizeOption);
  };
  const toggleDisplayText = () => {
    setDisplayTextOption(!displayTextOption);
  };
  const getImageSize = async (PixelImage) => {
    var img = document.createElement("img");
    await img.setAttribute("src", "data:image/png;base64," + PixelImage);
    setPixel({ width: img.width, height: img.height });
    console.log({ width: img.width, height: img.height });
    console.log("1");
  };
  useEffect(() => {
    if (fetched.length > 0) {
      getImageSize(fetched[0].PixelImage);
    }
  }, [fetched]);

  useEffect(() => {
    if (pixel.height > 0) {
      setMergedImageSize({
        width: pixel.width * 8,
        height: pixel.height * Math.ceil(fetched.length / 8),
      });
      let toMerge = fetched.map(function (d, index) {
        return {
          src: "data:image/png;base64," + d.PixelImage,
          id: d.SampleID,
          x: (index % 8) * pixel.width,
          y: Math.floor(index / 8) * pixel.height,
        };
      });
      setTextInfo(
        fetched.map(function (d, index) {
          return {
            id: d.SampleID,
            x: (index % 8) * pixel.width,
            y: Math.floor(index / 8) * pixel.height,
          };
        })
      );
      mergeImages(toMerge, {
        width: pixel.width * 8,
        height: pixel.height * Math.ceil(fetched.length / 8),
      })
        .then((merged) => {
          setMergedSrc(merged);
          setFetchStatus("Idle");
        })
        .catch((err) => console.log(err));
    }
  }, [pixel]);

  return (
    <div className="max-w-7xl mx-auto px-5">
      <div className="font-bold text-3xl">JImage</div>
      <div className="flex flex-row w-full max-w-xs pt-5 pb-2 items-center">
        <div className="form-control pr-2">
          <input
            type="text"
            placeholder="Input id"
            className="input input-bordered input-sm w-full max-w-xs"
            onChange={(e) => setFetchId(e.target.value)}
          />
        </div>
        <button className={`btn btn-outline btn-sm `} onClick={addJImage}>
          Fetch
        </button>
      </div>
      <div className="flex flex-row ">
        <div className="form-control w-48 px-4">
          <label className="label cursor-pointer">
            <span className="label-text"> Full Size </span>
            <input
              type="checkbox"
              className="toggle"
              checked={fullSizeOption}
              onChange={toggleFullSize}
            />
          </label>
        </div>
        <div className="form-control w-48 px-4">
          <label className="label cursor-pointer">
            <span className="label-text"> Display Text </span>
            <input
              type="checkbox"
              className="toggle"
              checked={displayTextOption}
              onChange={toggleDisplayText}
            />
          </label>
        </div>
      </div>
      <div className="container">
        <div>
          {fetchStatus !== "Idle" ? (
            <div className="flex justify-center items-center">
              <button className="btn loading bg-white border-hidden text-gray-700">
                {fetchStatus}
              </button>
            </div>
          ) : null}
        </div>
        {mergedSrc && !fullSizeOption ? (
          <Canvas
            toDisplay={toDisplay}
            mergedSrc={mergedSrc}
            mergedImageSize={mergedImageSize}
            textInfo={textInfo}
            fullSizeOption={fullSizeOption}
            displayTextOption={displayTextOption}
          />
        ) : null}
        {mergedSrc && fullSizeOption ? (
          <Canvas
            toDisplay={{ width: mergedImageSize.width }}
            mergedSrc={mergedSrc}
            mergedImageSize={mergedImageSize}
            textInfo={textInfo}
            fullSizeOption={fullSizeOption}
            displayTextOption={displayTextOption}
          />
        ) : null}
      </div>
    </div>
  );
}

const Canvas = ({
  toDisplay,
  mergedSrc,
  mergedImageSize,
  textInfo,
  fullSizeOption,
  displayTextOption,
}) => {
  const dWidth = toDisplay.width;
  const dHeight =
    (mergedImageSize.height * toDisplay.width) / mergedImageSize.width;
  const [id, setId] = useState(textInfo[0]?.id.slice(0, 10));
  const fontCode = fullSizeOption
    ? "bold 32px verdana, sans-serif"
    : "bold 8px verdana, sans-serif";
  const hPadding = fullSizeOption ? 30 : 10;
  const wPadding = fullSizeOption ? 30 : 10;

  const canvas = React.useRef();
  const { sWidth, sHeight } = mergedImageSize;

  React.useEffect(() => {
    const context = canvas.current.getContext("2d");
    var image = new Image();
    image.src = mergedSrc;
    image.onload = function () {
      context.drawImage(image, 0, 0, dWidth, dHeight);
      let i = 0;
      if (displayTextOption) {
        for (let i = 0; i < textInfo.length; i++) {
          context.font = fontCode;
          var welcomeMessage = textInfo[i].id;
          context.textAlign = "start";
          context.textBaseline = "Bottom";
          context.fillStyle = "#FFFFFF"; //<======= here
          context.fillText(
            welcomeMessage,
            textInfo[i].x * (dWidth / mergedImageSize.width) + wPadding,
            textInfo[i].y * (dHeight / mergedImageSize.height) + hPadding
          );
        }
      }
    };
  }, [id, displayTextOption]);
  return (
    <div className="object-contain max-w-7xl mx-auto">
      <canvas
        ref={canvas}
        width={dWidth} // CHANGED
        height={dHeight} // CHANGED
      />
    </div>
  );
};

// chrome://flags/#block-insecure-private-network-requests
