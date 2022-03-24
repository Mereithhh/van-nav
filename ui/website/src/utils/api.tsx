import axios from "axios";
const baseUrl = "/api/";
// const baseUrl = "https://tools.mereith.com/api/";
export const FetchList =async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};
export default FetchList;
