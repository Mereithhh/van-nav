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
    catelogs.push("管理后台");
    data.tools.push({
        id: 999999999999,
        catelog: "管理后台",
        name: "本站管理后台",
        desc: "本导航站的管理后台哦",
        url: "admin",
        logo: "https://pic.mereith.com/img/admin-fill.png",
    })
    data.catelogs = catelogs;
    return data;
};
export default FetchList;


