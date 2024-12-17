import axios from "axios";
import { getJumpTarget, initServerJumpTargetConfig } from "./setting";

axios.interceptors.request.use(
    (config) => {
        // 从localStorage获取token并添加到请求头
        const token = window.localStorage.getItem("_token");
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and redirect to login
            window.localStorage.removeItem("_token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
const baseUrl = "/api/";
// const baseUrl = "https://tools.mereith.com/api/";

const selfJumpIcon = `data:image/png;base64,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`
const blankJumpIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADICAYAAACksw7kAAAAAXNSR0IArs4c6QAACgdJREFUeF7tnQ1y2zYQRuWr9CJpT+bkZElP1s7aokMpFIkFsB+XwONMx9MJiJ+HfV4Aoui3GxcEIFBM4K24JAUhAIEbwhAEEHAQQBgHLIpCAGGIAQg4CCCMAxZFIYAwxAAEHAQQxgGLohBAGGIAAg4CCOOARVEIIAwxAAEHAZUwfzv6RNE6Ar/qbuMuD4HewpgY9t+3+09PXyjbh8Aizo97dYjUh+tHLb2E+X673d479ouq+hEwYUwexOnAtFUYROkwCcIqTBybM65KArXCIEol8AS3kXEaJsErjO1PbOnFJr4BepJbTZx/kvTlMt3wCENWucy0ujpq0rC/KURWKgyyFAK9aDGkKZy4EmGQpRDmxYtxIFAwgUfCIEsBxIGKIM3BZO4JgywDmeAYCtLswHolDLI4ImzAouxpXkzqljB2ZPxzwCBgSOUEOHJ2CGOy8DlLeXCNWpKl2cbMPmcYlmKjhn/duI4OhepqvfBdayAsxS48kUFdJ8s8gV0Lw1IsKOouXi3SrCZwLcx/F59Yuh9DAGE2hGE5FhNso9TKXuY+kwsIlmOjhHbMOMgyK2HILjFBNlKtCIMwI8WzZCwsy+7f6eezF0m8Xb4RhEGYywexcgA8X3YXRrHhZw0cG9qKfSjCIExsFAtrVwjDLz2EEYZ0bFMIE8v3q3bbyLEkE8EObAZhAuGuq0YYEejgZhAmGPBSPcKIQAc3gzDBgBFGBFjUDMKIQJNhRKCDm0GYYMBkGBFgUTMIIwJNhhGBDm4GYYIBk2FEgEXNIIwINBlGBDq4GYQJBkyGEQEWNYMwItBkGBHo4GYQJhgwGUYEWNQMwohAk2FEoIObQZhgwOoMw3cpYicUYWL5ftWuyjAIEzuhCBPLF2FEfFXNIIyINBlGBDq4GYQJBsweRgRY1AzCiECTYUSgg5tBmGDAZBgRYFEzCCMCTYYRgQ5uBmGCAZNhRIBFzSCMCDQZRgQ6uBmECQZMhhEBFjWDMCLQZBgR6OBmECYYMBlGBFjUzFWEsX4u1y8Rm67NkGG64jytsuzCbP1JFRPG3td8KXEQ5rQY79pwdmH2/uDwpV5yjjBd4/a0yjILU/IHuy4jDcKcFuNdG84sTOnL7m1pZl8DSX0hTOrpKe5cZmH2lmPPA0y/r0GY4phMXbBk2dM6gNplk0eYpY9pv3CIMK1hlOP+0YQxqrWChs4IwoTilVU+ojAppUEYWUyHNjSqMAYt1WEAwoTGsazy9SfoUY3WfsBYs4fZOgxIcYKGMFHhRb1GoPfp3emHAQhDYEcS6C3M6fsahIkMF+qOEOZUaRCGoI4kECXMadIgTGS4UHekMKecoCEMQR1JIFqYRRrZ1wQQJjJcqFshzEJZcoKGMAR1JAGlMJJ9DcJEhgt1K55AeKYc+gwawhDUkQTOECY00yBMZLhQd+mXxyJIhTyDhjARU0WdRuCs7LKm310ahCG4exMwUb7dnyPrXXdtfd1O0BBmewqWp38VTwHXBkGm+7IJssWmizQI84g2wzIikwij9aX5BA1hPkMCUUZT4/V4mqRBmP7f2Zgn9K470mppEOZ2O/Po87ohd/2eV52gzS6M+tGN64fZWCNwvwdtdmHYu4wlQO1oik/QZheG5VhtiI13X9G+BmE+N/1cEDACh9IgDMKgyiOB3cMAhEEYhPmTwMvDAIRBGIR5TeCPw4DZhenxVkYCbmwCD/sahBl7shldHwJfmQZh+gCllvEJfEiDMONPNCPsQ+BjaYYwfWBSyxwE3hBmjolmlH0I/IUwfUBSyxwEEGaOeWaUnQhMvyTj4ctOkTRBNR+PzMy+JEOYCSK9wxC/ni9DGB6N6RBPQ1fx8DAmwiDM0NHeYXAPz5MhDMJ0iKkhq9h8zB9hEGbIaG8c1MsvkiEMwjTG1nC3737rEmEQZriIbxgQX1E+gMexckN0DXZr0ZtjZs8wvGZpsKivGI7rhX4Ic7u9V0DmljEIuGSxIc8uDG++HCPwa0ZxuF/ZqnR2YYwJ+5iacLv2PVWykGF+Tzovw7i2AJ7eV8uCML8xszTzhNx1yzbJgjCPE2/S2AEAr469rhB7PW+WBWFe4zVp7D/7240ZLiRum4UusiBM2yRw9yeBtczLEX0mwbvJgjCEfBSBLCePXWVBmKhwoV4jcLY0RY+6eKeKz2G8xChfSuDMx45CZCHDlE495WoInCGM+1EX78DIMF5ilC8loP5sK1wWMkzp1FOuhoBSGIksCFMTBtxTSkAlTPeTsL0BsiQrnX7K1RCIfkZPKgsZpiYEuMdDIFIYuSwI45l6ytYQiBLmFFkQpiYEuMdDIEKY02RBGM/U5y67PGkd2ct/7S9wORvoLcypsiCMc/YTF1d8SFgTrD0fjwn79N4zr5ySeWjlLTu6MClkIcPkFcDbs1GFkX0gWQqcDFNKKne5EYVJJwsZJrcEnt6NJkzNfsnDq7osGaYaXaobswpTc0qWVhYyTKqYb+rMKMKklgVhmmI01c1XF8b2KyaL/Ux9sSRLPT3FncsqTEm/0meV9SwgTHFMpi5YEpitA6gJ7L1+1dTXOobm+xGmGWGKCrIKY3Csb/Z+N3t8xySxy5Ze6ZdfWzOLMCnivbkTmYVpHlymChAm02zU9wVh6tm57kQYF660hRFGNDUIIwId3AzCBANeqkcYEejgZhAmGDDCiACLmkEYEWgyjAh0cDMIEwyYDCMCLGoGYUSgyTAi0MHNIEwwYDKMCLCoGYQRgSbDiEAHN4MwwYDJMCLAomYQRgSaDCMCHdwMwgQDJsOIAIuaQRgRaDKMCHRwMwgTDJgMIwIsagZhRKDJMCLQwc0gTDBgMowIsKgZhBGBJsOIQAc3gzDBgMkwIsCiZhBGBJoMIwId3AzCBAMmw4gAi5pBGBFoMowIdHAzCBMMmAwjAixqBmFEoMkwItDBzSBMMGAyjAiwqBmEEYFWZRh7Laj9FV6uGALLq1hjav+sNc3fmYwc5FHdKmGO+sG/5yeAMLfbzYRRpPP84UAPjwggDMIcxQj/viKAMAiDEA4CthqZ/jII9nc7fk5PAgBHBBDmnmEMVM1fuz0CzL+PQ8BOOW1JNv21/NZg4z99KOwCQJg7HoRBlBICbPifhGFZVhI285Zh/7IhDMuyeYXYGznLsRWd598cbP6R5pkAy7EdYcgyCPNMgOXYjjDsZRBmTeDH/dEpqGzsYRYoZBnCwwiwd9mIg1fpFmmQhr2LQxgrijTzSkN2eTH3Rxs6e8bMnjXjmocAsuzM9ZEwdivSzCOLjZSlWKMwSDOPMMhyMNclGYbTs/GFsWWYHSHbT64OGQZpxg0jPmtxzK0nw6yr5QTNATlxUWRxTk6tMGQcJ+hExU0Su+yXHpeTQKswS3N29Px+/x+OoZ2TICi+vBfOfrJPaQDeS5h1FxZh7Ke9YI5LS2D9wkQE6cz+f24kwClVvFcwAAAAAElFTkSuQmCC`
export const FetchList = async () => {
    const { data: raw } = await axios.get(baseUrl);
    const { data } = raw;
    // 获取分类
    const catelogs = [];
    catelogs.push("全部工具")
    data.catelogs.forEach(item => {
        catelogs.push(item.name)
    })
    if (!data.tools) {
        data.tools = []
    }
    data.tools.forEach(item => {
        if (!catelogs.includes(item.catelog)) {
            catelogs.push(item.catelog);
        }
    });
    if (!data.setting?.hideAdmin) {
        data.tools.push({
            id: 999999999999,
            catelog: "管理后台",
            name: "本站管理后台",
            desc: "本导航站的管理后台哦",
            url: "admin",
            logo: `data:image/png;base64,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`,
        })
    }
    if (data.setting) {
        initServerJumpTargetConfig(data.setting)
    }

    const jumpTarget = getJumpTarget();

    data.tools.push({
        id: 999099999978,
        catelogs: "偏好设置",
        name: jumpTarget === "blank" ? "新建窗口" : "原地跳转",
        desc: `点击切换跳转方式`,
        url: "toggleJumpTarget",
        logo: jumpTarget === "blank" ? blankJumpIcon : selfJumpIcon
    })

    data.catelogs = catelogs;
    return data;
};




export const login = async (username: string, password: string) => {
    const { data } = await axios.post("/api/login", {
        name: username,
        password,
    });
    return data;
};

export const fetchAdminData: () => Promise<any> = async () => {
    const { data } = await axios.get("/api/admin/all");
    return data?.data || {};
};
export const fetchImportTools = async (payload: any) => {
    const { data } = await axios.post(`/api/admin/importTools`, payload);
    return data?.data || {};
};
export const fetchExportTools = async () => {
    const { data } = await axios.get(`/api/admin/exportTools`);
    return data?.data;
};
// 工具管理接口：删除、修改、新增
export const fetchDeleteTool = async (id: number) => {
    const { data } = await axios.delete(`/api/admin/tool/${id}`);
    return data?.data || {};
};
export const fetchUpdateTool = async (payload: any) => {
    const { data } = await axios.put(`/api/admin/tool/${payload.id}`, payload);
    return data?.data || {};
};
export const fetchAddTool = async (payload: any) => {
    const { data } = await axios.post(`/api/admin/tool`, payload);
    return data?.data || {};
};
// 分类管理接口；新增、修改、删除
export const fetchAddCateLog = async (payload: any) => {
    const { data } = await axios.post(`/api/admin/catelog`, payload);
    return data?.data || {};
};
export const fetchUpdateCateLog = async (payload: any) => {
    const { data } = await axios.put(`/api/admin/catelog/${payload.id}`, payload);
    return data?.data || {};
};
export const fetchDeleteCatelog = async (id: number) => {
    const { data } = await axios.delete(`/api/admin/catelog/${id}`);
    return data?.data || {};
};

export const fetchUpdateSetting = async (payload: any) => {
    const { data } = await axios.put(`/api/admin/setting`, payload);
    return data?.data || {};
};

export const fetchUpdateUser = async (payload: any) => {
    const { data } = await axios.put(`/api/admin/user`, payload);
    return data?.data || {};
};

export const fetchAddApiToken = async (payload: any) => {
    const { data } = await axios.post(`/api/admin/apiToken`, payload);
    return data?.data || {};
};
export const fetchDeleteApiToken = async (id: number) => {
    const { data } = await axios.delete(`/api/admin/apiToken/${id}`);
    return data?.data || {};
};
export const fetchUpdateToolsSort = async (updates: { id: number; sort: number }[]) => {
    const { data } = await axios.put(`/api/admin/tools/sort`, updates);
    return data?.data || {};
};