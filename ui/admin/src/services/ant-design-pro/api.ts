// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
const baseUrl = "/api";
export const  queryAllData = async () => {
    const res = await request(
      `${baseUrl}/admin/all`,
      {  method: 'GET' },
    );
    return res?.data;
}

export const login = async (data: any) => {
  const res = await request(
    `${baseUrl}/login`,
    {  method: 'POST',data },
  );
  return res?.data;
}

export const updateUser = async (data: any) => {
  const res = await request(
    `${baseUrl}/admin/user`,
    {  method: 'PUT',data },
  );

  return res?.message;
}
export const updateCatelog = async (data: any) => {
  const res = await request(
    `${baseUrl}/admin/catelog/${data?.id}`,
    {  method: 'PUT',data },
  );

  return res?.message;
}
export const updateTool = async (data: any) => {
  const res = await request(
    `${baseUrl}/admin/tool/${data?.id}`,
    {  method: 'PUT',data },
  );

  return res?.message;
}
export const addTool = async (data: any) => {
  const res = await request(
    `${baseUrl}/admin/tool`,
    {  method: 'POST',data },
  );

  return res?.message;
}
export const addCatelog = async (data: any) => {
  const res = await request(
    `${baseUrl}/admin/catelog`,
    {  method: 'POST',data },
  );

  return res?.message;
}
export const removeCatelog = async (id: any) => {
  const res = await request(
    `${baseUrl}/admin/catelog/${id}`,
    {  method: 'DELETE' },
  );
  return res?.message;
}
export const removeTool = async (id: any) => {
  const res = await request(
    `${baseUrl}/admin/tool/${id}`,
    {  method: 'DELETE' },
  );
  return res?.message;
}

