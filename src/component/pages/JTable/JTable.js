import {useState, useEffect} from 'react'
import axios from 'axios'
// import Counter from "./Counter"
import FetchJ from "./FetchJ"
import FetchedJDisplay from "./FetchedJDisplay"
import JTableSingle from "./JTableSingle"

function JTable() {
  // const [post, updatePost] = useState({title: ''})

//   useEffect(() => {
//      axios.post("https://jvldata.udc.local/getPlotData", {"runNumber":"H-010319-1"})
//         .then(({ data }) => {
//             console.log(data)
//             updatePost(data)
//         })
//   })

  return (
    <div className="max-w-7xl mx-auto px-5">
        <div className ="font-bold text-3xl">
          JData
        </div>
        
        <FetchJ />
        <FetchedJDisplay />
        <JTableSingle />
        {/* <JTableCompare /> */}
      
    </div>
  )
}

export default JTable