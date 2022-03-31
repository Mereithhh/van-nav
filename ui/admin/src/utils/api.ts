import axios from "axios";
axios.defaults.headers.common = {
  Authorization: window.localStorage.getItem("_token") ?? "",
};
export const login = async (username: string, password: string) => {
  const { data } = await axios.post("/api/login", {
    name: username,
    password,
  });
  return data;
};

export const fetchTools: () => Promise<any> = async () => {
  const { data } = await axios.get("/api/admin/all");
  return data?.data || {};
};
export const fetchImportTools = async (payload: any) => {
  const { data } = await axios.post(`/api/admin/importTools`, payload);
  return data?.data || {};
};
export const fetchExportTools = async () => {
  const { data } = await axios.get(`/api/admin/exportTools`);
  return data?.data ;
};
export const fetchDeleteTool = async (id: number) => {
  const { data } = await axios.delete(`/api/admin/tool/${id}`);
  return data?.data || {};
};
export const fetchUpdateTool = async (payload: any) => {
  const { data } = await axios.put(`/api/admin/tool/${payload.id}`,payload);
  return data?.data || {};
};
export const fetchAddTool = async (payload: any) => {
  const { data } = await axios.post(`/api/admin/tool`,payload);
  return data?.data || {};
};
export const fetchAddCateLog = async (payload: any) => {
  const { data } = await axios.post(`/api/admin/catelog`,payload);
  return data?.data || {};
};
export const fetchDeleteCatelog = async (id: number) => {
  const { data } = await axios.delete(`/api/admin/catelog/${id}`);
  return data?.data || {};
};

export const fetchUpdateSetting = async (payload: any) => {
  const { data } = await axios.put(`/api/admin/setting`,payload);
  return data?.data || {};
};

export const fetchUpdateUser = async (payload: any) => {
  const { data } = await axios.put(`/api/admin/user`,payload);
  return data?.data || {};
};

