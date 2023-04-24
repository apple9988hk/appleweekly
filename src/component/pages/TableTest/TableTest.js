import React, { useState, useEffect } from "react";

function PrizeBoxGame() {
  const [selectedBoxIndex, setSelectedBoxIndex] = useState(0);
  const [prizeBoxIndex, setPrizeBoxIndex] = useState(
    Math.floor(Math.random() * 3)
  );
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      // Check if the user pressed an arrow key
      if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
        // Move the selected box index based on the arrow key pressed
        if (event.keyCode === 37 || event.keyCode === 38) {
          setSelectedBoxIndex((prevIndex) =>
            prevIndex === 0 ? 2 : prevIndex - 1
          );
        } else {
          setSelectedBoxIndex((prevIndex) =>
            prevIndex === 2 ? 0 : prevIndex + 1
          );
        }
      }

      // Check if the user pressed the "Enter" key to select a box
      if (event.keyCode === 13) {
        // Check if the selected box index matches the prize box index
        if (selectedBoxIndex === prizeBoxIndex) {
          console.log("You win!");
        } else {
          console.log("Sorry, try again.");
        }
        setGameOver(true);
      }
    }

    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedBoxIndex, prizeBoxIndex]);

  return (
    <div>
      <h2>Select a box to win a prize!</h2>
      <div>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            style={{
              display: "inline-block",
              width: "100px",
              height: "100px",
              border: "2px solid black",
              backgroundColor: index === selectedBoxIndex ? "yellow" : "white",
              marginRight: "10px",
              textAlign: "center",
              lineHeight: "100px",
              fontSize: "24px",
              fontWeight: "bold",
              cursor: gameOver ? "default" : "pointer",
              opacity: index === prizeBoxIndex && gameOver ? 1 : 0.5,
            }}
            onClick={() => {
              if (!gameOver) {
                setSelectedBoxIndex(index);
              }
            }}
          >
            Box {index + 1}
          </div>
        ))}
      </div>
      {gameOver && (
        <button onClick={() => window.location.reload()}>Play again</button>
      )}
    </div>
  );
}

export default PrizeBoxGame;