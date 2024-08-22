import FetchLT from "./FetchLT";
import FetchLTDisplay from "./FetchLTDisplay";
import LTPlotSingle from "./LTPlotSingle";
import LTPlotContainer from "./LTPlotContainer";

function LTView() {
  return (
    <div className="max-w-7xl mx-auto px-5">
      {/* <a href="/appleweekly/LT">
        <span className="sr-only">Your Company</span>
        <img
          className="h-8 w-auto sm:h-10"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt=""
        />
      </a> */}

      {/* <FetchLT />
        <FetchLTDisplay />
        <LTPlotSingle /> */}
      <LTPlotContainer />
    </div>
  );
}

export default LTView;

// import FetchS from "./FetchS"
// import FetchSDisplay from "./FetchSDisplay"
// import SPlotSingle from "./SPlotSingle"
