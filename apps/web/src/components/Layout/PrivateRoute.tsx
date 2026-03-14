import _ from "lodash";
import { ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/userSlice";
import { UserApi } from "../../api/userApi";

const isAuthenticated = async (dispatch: any) => {

  try {
    const userInfo = await UserApi.getInfo()

    const hasUser = !_.isEmpty(userInfo);
    if(hasUser){
      dispatch(setUser(userInfo))
    }

    return !_.isEmpty(userInfo);
  } catch (error) {
    console.error("Error during authentication check", error);
    return false;
  }
};

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuthentication = async () => {
      await isAuthenticated(dispatch);
    };

    checkAuthentication();
  }, []);

  // if (isAuthenticatedState === null) {
  //   return <div>Loading...</div>;
  // }

  // if (isAuthenticatedState) {
    return children;
  // }

  // return <Navigate to={`/login?url=${encodeURIComponent(redirectTo)}`} replace />;
};

export default PrivateRoute;
