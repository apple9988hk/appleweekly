import FetchOJ from "./FetchOJ"
import FetchedOJDisplay from "./FetchedOJDisplay"
import OJTable from "./OJTable"

function OJData() {
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
          Plot Data Table
          H-052722-Y
        </div>
        
        <FetchOJ />
        <FetchedOJDisplay />
        <OJTable />

        {/* <JTableSingle /> */}
        {/* <JTableCompare /> */}
      
    </div>
  )
}

export default OJData