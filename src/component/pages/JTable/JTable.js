import {useState, useEffect} from 'react'
import axios from 'axios'

function JTable() {
  const [post, updatePost] = useState({title: ''})

//   useEffect(() => {
//      axios.post("https://jvldata.udc.local/getPlotData", {"runNumber":"H-010319-1"})
//         .then(({ data }) => {
//             console.log(data)
//             updatePost(data)
//         })
//   })

  return (
    <div className="max-w-7xl mx-auto">
        hello
       {/* <p>{post.title}</p> */}
       {/* ... */}
    </div>
  )
}

export default JTable