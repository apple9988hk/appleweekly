import React, { useEffect, useState, Component } from "react";
import mergeImages from "merge-images";
import axios from "axios";

export default function JImage() {
  const [fetchId, setFetchId] = useState("");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [fetched, setFetched] = useState([]);
  // const [merged, setMerged] = useState([]);
  const [src, setSrc] = useState(null);
  const [src2, setSrc2] = useState(null);
  let imageDetail = []
  const [toMerge, setToMerge] = useState(null);

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
    console.log(fetched.length);
    if (fetched.length > 0) {
      const w = 752 * 8;
      const h = 480 * Math.ceil(fetched.length / 8);
      // console.log("width:" + width.toString());
      let toMerge = fetched.map(function (d, index) {
        return {
          // src: "data:image/png;base64," + d.PixelImage,
          src: "data:image/png;base64," + d.PixelImage,
          id: d.SampleID,
          x: (index % 8) * 752,
          y: Math.floor(index / 8) * 480,
        };
      });
      // setMerged(merged);
      console.log(imageDetail);
      mergeImages(toMerge, {
        width: w,
        height: h,
      })
        .then((merged) => {
          setSrc(merged);
          setToMerge(toMerge);
        })
        .then((w, h) => {
          setWidth(w);
          setHeight(h);
        })
        .catch((err) => console.log(err));
      console.log(src);
      
    }
  }, [fetched]);
console.log(toMerge)
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
      <h1>Combined Image H-101422-1</h1>
      <div className="container">
        {src ? <img src={src} id="combined-image" alt="" /> : null}
        {/* <TextImageContainer /> */}

        { src ? <Canvas  src={src} width={752 * 8} height={ 480 * 5} toMerge={toMerge} /> : null }
        <div className="bottom-left">Bottom Left</div>
      </div>
    </div>
  );
}

// const TextImageContainer = () => {
  
//   // create new TextImage object with customize style
//   var style = {
//     font: 'serif',
//     align: 'center',
//     color: 'white',
//     size: 12,
//     background: 'black',
//     stroke: 1,
//     strokeColor: 'rgba(0, 0, 0, 0)',
//     lineHeight: '1.6em',
//     bold: true,
//     italic: true
//   };
//   var textImage = TextImage(style);

//   // var textImage = TextImage(style);

//   // var data = textImage.toDataURL("hello");

//   // console.log(data)
//   return(
//     <>hello</>
//   )
// }

const Canvas = ( {height, width, src, toMerge} ) => { // CHANGED
  const canvas = React.useRef();

  React.useEffect(() => {
    console.log('draw')
    console.log(height)
    console.log(width)
    console.log(toMerge)
    console.log(src)
    const context = canvas.current.getContext('2d');
    var image = new Image();
    image.src = src
    context.drawImage(image, 0, 0, 1240, height*1240/width)
    let i = 0;
    for (let i = 0; i < toMerge.length; i++) {
      context.font = "bold 8px verdana, sans-serif ";
      var welcomeMessage = toMerge[i].id;
      context.textAlign = "start";
      context.textBaseline = "Top";
      context.fillStyle = "#ff0000"; //<======= here
      console.log(toMerge[i])
      console.log(toMerge[i])
      context.fillText(welcomeMessage, toMerge[i].x*1240/width + 10 , toMerge[i].y * height*1240/width /height + 10);
    }
  },[]);
  return (
    <div className ="object-contain max-w-7xl mx-auto">
    <canvas
      ref={canvas}
      width={width}   // CHANGED
      height={height} // CHANGED
    />
    </ div>

  )
}

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
