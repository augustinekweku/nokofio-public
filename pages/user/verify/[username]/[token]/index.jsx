import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import FullPageLoader from "../../../../../components/FullPageLoader";
import { publicRequest } from "../../../../../requestMethods";
import { centerToast } from "../../../../../toast";

const Index = () => {
  const router = useRouter();
  const { username, token } = router.query;
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      setloading(true);
      try {
        const res = await publicRequest.post(
          `/auth/verify/${username}/${token}`
        );
        if (res.status === 200) {
          setloading(true);
          centerToast("success", "Congrats", "Your Account is Now Verified");
          router.push("/login");
        }
      } catch (error) {
        if (error.response.status === 400) {
          centerToast("error", "Oops!", "Link is invalid or has expired");
          router.push("/login");
        } else {
          centerToast("error", "Oops", "Something went wrong");
          router.push("/login");
        }
      }
    };
    verifyEmail();
  }, [token, username, router]);

  return <div>{loading && <FullPageLoader />}</div>;
};

export default Index;
