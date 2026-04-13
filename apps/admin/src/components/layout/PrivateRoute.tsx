import { ReactElement, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AdminApi } from "../../api/apiRequest";
import _ from "lodash";
import { setUser } from "../../features/userSlice";
import { useDispatch } from "react-redux";

const isAuthenticated = async (dispatch: any) => {

  try {
    const response = await AdminApi.axiosGet({
      data: {
        endpoint: "/api/users/me",
      },
    });

    if (response && response.status === 200 && !_.isEmpty(response.data)) {
      if (response.data.role === "admin") {
        dispatch(setUser(response.data));
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error during authentication check", error);
    return false;
  }
};

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState<boolean | null>(null);
  const location = useLocation();
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = await isAuthenticated(dispatch);
      setIsAuthenticatedState(authenticated);
    };

    checkAuthentication();
  }, []);

  if (isAuthenticatedState === null) {
    return <div>Loading...</div>;
  }

  if (isAuthenticatedState) {
    return children;
  }

  const redirectTo = location.pathname + location.search;
  console.log("🚀 ~ PrivateRoute ~ redirectTo:", redirectTo)
  return <Navigate to={`/login?url=${encodeURIComponent(redirectTo)}`} replace />;
};

export default PrivateRoute;
