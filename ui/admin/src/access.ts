/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { user?: any }) {
  const { user } = initialState || {};
  return {
    canAdmin: Boolean(user),
  };
}
