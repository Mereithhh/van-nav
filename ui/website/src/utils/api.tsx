import axios from "axios";
const baseUrl = "/api/";
// const baseUrl = "https://tools.mereith.com/api/";
export const FetchList =async () => {
    const {data: raw} = await axios.get(baseUrl);
    const {data} = raw;
    // 获取分类
    const catelogs = [];
    catelogs.push("全部工具")
    data.tools.forEach(item => {
        if (!catelogs.includes(item.catelog)) {
            catelogs.push(item.catelog);
        }
    });
    data.catelogs = catelogs;
    return data;
};
export default FetchList;


