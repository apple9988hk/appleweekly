import React, { useState, useRef } from "react";
import Lottie from "lottie-react";
import animationData from "./celebrationAnimation.json";
import Confetti from "react-confetti";
import party from "party-js";

// https://party.js.org/docs/ref/variations

const BackgroundImageComponent = () => {
  const containerStyle = {
    background: "url(apple.jpg) center/cover no-repeat",
    width: "500px",
    height: "300px",
  };

  return <div style={containerStyle}>{/* Content goes here */}</div>;
};

const MyComponent = () => {
  const playerRef = useRef(null);
  const [isShow, setIsShow] = useState(false);

  function handleClick() {
    setIsShow(true);
    // playerRef.current.setSpeed(100);
    playerRef.current.goToAndPlay();
  }

  const [isConfettiActive, setIsConfettiActive] = useState(false);

  const startConfetti = () => {
    setIsConfettiActive(true);

    // Stop the confetti after a certain duration
    setTimeout(() => {
      setIsConfettiActive(false);
    }, 3000); // Change the duration as needed
  };

  const handleConfetti = (event) => {
    // console.log(event)
    const { clientX, clientY } = event;
    // var e = new[] event
    party.confetti(new party.Circle(clientX, clientY, 3), {
      count: party.variation.range(50, 120),
    });
  };

  return (
    <div className="relative">
      <BackgroundImageComponent />
      <button className="btn" onClick={handleClick}>
        {" "}
        show{" "}
      </button>
      {isShow && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Lottie
            className="absolute"
            autoplay={true}
            loop={true}
            animationData={animationData}
            lottieRef={playerRef}
            speed={1}
          />
        </div>
      )}

      <button className="btn" onClick={startConfetti}>
        Start Confetti
      </button>

      <button className="btn" onClick={(event) => handleConfetti(event)}>
        Start Confetti2
      </button>
      {isConfettiActive && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
        // <Confetti
        //   drawShape={(ctx) => {
        //     ctx.beginPath();
        //     for (let i = 0; i < 22; i++) {
        //       const angle = 0.35 * i;
        //       const x = (0.2 + 1.5 * angle) * Math.cos(angle);
        //       const y = (0.2 + 1.5 * angle) * Math.sin(angle);
        //       ctx.lineTo(x, y);
        //     }
        //     ctx.stroke();
        //     ctx.closePath();
        //   }}
        // />
      )}
    </div>
  );
};

export default MyComponent;
