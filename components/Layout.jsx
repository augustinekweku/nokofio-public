// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";

import { Provider } from "react-redux";
import store from "../redux/store";

// import Navbar from "./Navbar";
// import { Provider, useDispatch, useSelector } from "react-redux";
// import FullPageLoader from "./FullPageLoader";
// import store from "../redux/store";

const Layout = ({ children }) => {
  // const [user, setUser] = useState(null);
  // const dispatch = useDispatch();
  // const router = useRouter();
  // const cookies = parseCookies();
  // const cookiesObj = { cookies };
  // const fullPageLoader = useSelector((state) => state.fullPageLoader);
  // const fullPageLoaderMsg = useSelector(
  //   (state) => state.fullPageLoader?.fullPageLoading.message
  // );

  // useEffect(() => {
  //   if (cookiesObj.cookies.nokofio_user) {
  //     const user = cookiesObj.cookies.nokofio_user;
  //     setUser(user);
  //   }
  // }, [cookiesObj.cookies.nokofio_user]);

  return (
    <>
      {/* {cookiesObj?.cookies?.nokofio_user &&
      router.pathname !== "/" &&
      router.pathname !== "/not-found" &&
      router.pathname !== "/[username]" &&
      router.pathname !== "/forgot-password" &&
      router.pathname !== "/reset-password/[username]/[token]" ? (
        <Navbar />
      ) : null}
      {fullPageLoader?.fullPageLoading.status == true ? (
        <FullPageLoader fullPageLoaderMsg={fullPageLoaderMsg} />
      ) : null} */}
      {children}
    </>
  );
};

export default Layout;
