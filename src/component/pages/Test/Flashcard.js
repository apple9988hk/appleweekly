import React from "react";

// function Flashcard({ english, chinese, imageSrc }) {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-4">
//       <div className="mb-4 h-15">
//         <img  src={"apple.jpg"} alt="Apple" className="w-full rounded-lg" />
//       </div>
//       <div className="text-center">
//         <p className="text-gray-700 text-lg font-bold">Apple</p>
//         <p className="text-gray-500 text-sm">蘋果</p>
//       </div>
//     </div>
//   );
// // }
// function Flashcard({ english, chinese, imageSrc }) {
//   const [isFlipped, setIsFlipped] = useState(false);

//   const handleFlip = () => {
//     setIsFlipped(!isFlipped);
//   };

//   return (
//     <div className={`bg-white rounded-lg shadow-md p-4 ${isFlipped ? 'flipped' : ''}`}>
//       <div className="front mb-4">
//         <img src={imageSrc} alt={english} className="w-full rounded-lg" />
//         <button onClick={handleFlip} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400 absolute bottom-4 right-4">Flip</button>
//       </div>
//       <div className="back text-center">
//         <p className="text-gray-700 text-lg font-bold">{chinese}</p>
//         <p className="text-gray-500 text-sm">{english}</p>
//         <button onClick={handleFlip} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400 absoluteYes, you can add a button to flip the card over and display additional content on the back of the card. Here's an updated version of the `Flashcard` component that includes a flip button:

// ```jsx
// import React, { useState } from 'react';

// function Flashcard({ english, chinese, imageSrc }) {
//   const [isFlipped, setIsFlipped] = useState(false);

//   const handleFlip = () => {
//     setIsFlipped(!isFlipped);
//   };

//   return (
//     <div className={`bg-white rounded-lg shadow-md p-4 ${isFlipped ? 'flipped' : ''}`}>
//       <div className="front mb-4">
//         <img src={imageSrc} alt={english} className="w-full rounded-lg" />
//         <button onClick={handleFlip} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400 absolute bottom-4 right-4">Flip</button>
//       </div>
//       <div className="back text-center">
//         <p className="text-gray-700 text-lg font-bold">{chinese}</p>
//         <p className="text-gray-500 text-sm">{english}</p>
//         <button onClick={handleFlip} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400 absolutebottom-4 right-4">Flip</button>
//       </div>
//     </div>
//   );
// }

// export default Flashcard;

const FlashCard = () => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl mx-auto">
      <figure className="px-10 pt-10">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/265px-Red_Apple.jpg"
          alt="Shoes"
          className="rounded-xl"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">Shoes!</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className="card-actions">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

const FlashCard2 = () => {
  return (
    <div className="card w-96 glass">
  <figure><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/265px-Red_Apple.jpg" alt="car!"/></figure>
  <div className="card-body">
    <h2 className="card-title">Life hack</h2>
    <p>How to park your car at your garage?</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Learn now!</button>
    </div>
  </div>
</div>
  )
}

function FlashcardContainer() {
  return (
    <div className= "p-5 mx-auto bg-slate-500">
      <FlashCard />
      <br/>
      <FlashCard2 />
    </div>
  );
}

  /* //   <Flashcard
  //   english="Apple"
  //   chinese="苹果"
  //   imageSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/265px-Red_Apple.jpg"
  // />
  // ) */

export default FlashcardContainer;
