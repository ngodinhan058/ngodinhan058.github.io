import { Navigate, Outlet } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PrivateRoute() {
  const token = sessionStorage.getItem("accessToken");
  if (!token) {
    toast.error("Access Denied", {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
    });
  }
  return token ? <Outlet /> : <Navigate to="/login" replace />;
  // return <Outlet />;
}

export default PrivateRoute;
