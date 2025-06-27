import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
function useAuth() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return accessToken == "0";
  const token = jwtDecode(localStorage.getItem("accessToken"));
  return token.role;
}
function SellerRoute() {
  const isAuth = useAuth();
  return isAuth == "technician" ? <Outlet /> : <Navigate to="/login" />;
}
export default SellerRoute;
