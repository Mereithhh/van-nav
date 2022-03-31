import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { notification } from "antd";
import pinyin from "pinyin-match";
export const getLoginState = () => {
    const user = window.localStorage.getItem("_user");
    const token = window.localStorage.getItem("_token");
    if (user && token) {
        try {
            const {exp} = jwt_decode(token) as any;
            return !dayjs(exp*1000).isBefore(dayjs());
        }catch (err) {
            return false;
        }
    }
    return false;
}
export const logout = () => {
    window.localStorage.removeItem("_user");
    window.localStorage.removeItem("_token");
    notification.success({ message: "登出成功!" });
}

export const getOptions = (rawList : any) => {
    return rawList.map((item: any) => {
        return {
            label: item.name,
            value: item.name,
            key: item.id,
        }
    })
}
export const getFilter = (rawList : any) => {
    return rawList.map((item: any) => {
        return {
            text: item.name,
            value: item.name,
        }
    })
}

export const mutiSearch = (s: string, t: string) => {
    const source = (s as string).toLowerCase();
    const target = t.toLowerCase();
    const rawInclude = source.includes(target);
    const pinYinInlcude = Boolean(pinyin.match(source, target));
    return rawInclude || pinYinInlcude;
  };