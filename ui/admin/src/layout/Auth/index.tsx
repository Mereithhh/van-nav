import { Navigate } from "react-router-dom";
import { getLoginState } from "../../utils";
import "./index.css";

export interface AuthProps {}
export const AuthLayout: React.FC<AuthProps> = (props) => {
  return <>{getLoginState() ? props.children : <Navigate to="/login" />}</>;
};
