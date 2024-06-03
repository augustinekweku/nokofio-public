import React, { useEffect } from "react";
import { logoutUserAndRedirect } from "../helpers";

const Logout = () => {
  useEffect(() => {
    logoutUserAndRedirect();
  }, []);

  return <div></div>;
};

export default Logout;
