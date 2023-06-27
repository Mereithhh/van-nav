export const isLogin = () => {
  return localStorage.getItem('_token') ? true : false
}