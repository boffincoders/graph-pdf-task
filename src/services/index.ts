import axios from "axios";
import { ApiEndpoints } from "../utils/apiEndpoints";


const getGraphData = async () => {
  return await axios.get(ApiEndpoints.GRAPH_DATA).then(response => response.data).catch(error => {
    throw new Error(error)
  })
}

const generatePdf = async (data: any, image: string) => {
  return await axios.post(ApiEndpoints.GENERATE_PDF_URL, {
    jsonData: data,
    graphImageBuffer: image
  }).then(response => response.data).catch(error => {
    throw new Error(error)
  })
}


// let allServices =
export default { getGraphData, generatePdf }
