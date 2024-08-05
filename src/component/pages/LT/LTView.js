import FetchLT from "./FetchLT";
import FetchLTDisplay from "./FetchLTDisplay";
import LTPlotSingle from "./LTPlotSingle";
import LTPlotContainer from "./LTPlotContainer";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function LTView() {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-5">
      <div className="font-bold text-5xl">
        <Link to="/LT?plotlist=" className="hover:cursor-pointer">LT View</Link>
      </div>

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
