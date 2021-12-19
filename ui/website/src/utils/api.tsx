import axios from "axios";
const baseUrl = "https://api.mereith.com";
export const FetchList =async () => {
    const response = await axios.get(baseUrl+"/tool");
    return response.data;
};
export default FetchList;
