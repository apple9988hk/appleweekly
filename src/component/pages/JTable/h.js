import React, { useEffect, useState, Component } from "react";
import mergeImages from "merge-images";
import axios from "axios";

export default function JImage() {
  const [fetchId, setFetchId] = useState("");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [fetched, setFetched] = useState([]);
  const [imgPos, setImgPos] = useState([]);
  const [src, setSrc] = useState(null);
  const [src2, setSrc2] = useState(null);

  const addJImage = async () => {
    if (fetchId.length !== 10) {
      console.log("Invalid Id");
    } else {
      const snapshot = await axios.get(
        `http://tmdata.udc.local/api/spectral/pixel-image/${fetchId}`
      );
      setFetched(snapshot.data);
    }
  };

  useEffect(() => {
    if (fetched.length) {
      setWidth(752 * 8);
      setHeight(480 * Math.ceil(fetched.length / 8));
      let merged = fetched.map(function (d, index) {
        return {
          // src: "data:image/png;base64," + d.PixelImage,
          src: "data:image/png;base64," + d.PixelImage,
          id: d.SampleID,
          x: (index % 8) * 752,
          y: Math.floor(index / 8) * 480,
        };
      });
      setImgPos(merged);
      mergeImages(merged, {
        width: width,
        height: height,
      })
        .then((src) => setSrc(src))
        .catch((err) => console.log(err));
    }
  }, [fetched]);

  return (
    <div className="max-w-7xl mx-auto px-5">
      <div className="font-bold text-3xl">JImage</div>
      <div className="flex flex-row w-full max-w-xs py-5 items-center px-5">
        <div className="form-control pr-2">
          <input
            type="text"
            placeholder="Input id"
            className="input input-bordered input-sm w-full max-w-xs"
            onChange={(e) => setFetchId(e.target.value)}
          />
        </div>
        <button className={`btn btn-outline btn-sm`} onClick={addJImage}>
          Fetch
        </button>
      </div>
      <h1>Combined Image</h1>
      <div className="container">
        {/* <img src={src} id="combined-image" alt="" /> */}
        {src ? (
          <Canvas
            src={src}
            width={752 * 8}
            height={480 * 5}
            imgPos={imgPos}
            h={height}
            w={width}
          />
        ) : null}

        <div className="bottom-left">Bottom Left</div>
      </div>
    </div>
  );
}

const Canvas = ({ height, width, src, imgPos, w, h }) => {
  // CHANGED
  const canvas = React.useRef();
  console.log("halo");
  console.log(src);

  useEffect(() => {
    const context = canvas.current.getContext("2d");
    var image = new Image();
    image.src = src;
    context.drawImage(image, 0, 0, 1240, (height * 1240) / width);
    console.log(imgPos);
    let i = 0;
    // for (let i = 0; i < imgPos.length; i++) {
    //   context.font = "bold 8px verdana, sans-serif ";
    //   var welcomeMessage = imgPos[i].id;
    //   context.textAlign = "start";
    //   context.textBaseline = "Top";
    //   context.fillStyle = "#ff0000"; //<======= here
    //   context.fillText(welcomeMessage, imgPos[i].x*1240/w + 10 , imgPos[i].y * height*1240/width /h + 10);
    // }
  });
  return (
    <div className="object-contain max-w-7xl mx-auto">
      <canvas
        ref={canvas}
        width={1240} // CHANGED
        height={(height * 1240) / width} // CHANGED
      />
    </div>
  );
};

// class CanvasS extends Component {
//   componentDidMount() {
//     const canvas = this.refs.canvas
//     const ctx = canvas.getContext("2d")
//     const img = this.refs.images;
//     img.onload = () => {
//       ctx.drawImage(img,0,0)
//       ctx.font = "40px Courier";
//       ctx.fillStyle = "black";
//       ctx.fillText(this.props.textToShow, 10,180);
//     }

//   }
//   render() {
//     const {width, height, imageToShow, textToShow} = this.props;

//     return(
//       <>
//         <canvas ref ="canvas" width= {width}  height = {height} />
//       </>
//     )
//   }
// }

// var img = document.createElement("img")
// img.setAttribute("src", base64string)
// setTimeout(function(){
//    console.log(img.height, img.width);
// },0)
