import Head from "next/head";
import styled from "styled-components";
import { mobile, sm } from "../../responsive";
import VerifiedIcon from "@mui/icons-material/Verified";
import AppFooter from "../../components/AppFooter";

import { useEffect } from "react";
import { publicRequest } from "../../requestMethods";
import { useState } from "react";
import FullPageLoader from "../../components/FullPageLoader";
import { useRouter } from "next/router";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";

const ContainerWrapper = styled.div`
  background-color: #e8e8e8;
  overflow-x: hidden;
`;

const Container = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  width: 600px;
  margin: 0 auto;
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-top: none;
  padding-top: 10px;
  min-height: 100vh;
  ${mobile({ width: "100%" })};
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
`;

const ImageContainer = styled.div`
  height: 100px;
  width: 100px;
  ${mobile({ height: "70px", width: "70px" })}
  ${sm({ height: "70px", width: "70px" })}
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const Footer = styled.div`
  width: 80%;
  margin: 0 auto;
  ${mobile({ width: "85%" })}
`;

const SocialContainer = styled.div`
  display: flex;
  margin-top: 32px;
  margin-bottom: 48px;
`;

const IconImage = styled.img`
  width: 35px;
  margin: 0 5px;
`;

const BookAppointment = ({
  server_username,
  server_pic,
  section,
  am,
  server_bio,
  server_display_name,
}) => {
  const [profileUser, setProfileUser] = useState(null);
  const router = useRouter();
  const { username } = router.query;

  // take first 20 characters of bio
  const bioText = server_bio && server_bio.substring(0, 20);
  const message = `${server_display_name} | Nokofio`;
  const metaDesc =
    section && am
      ? `Donate GHS${am} to ${server_username}`
      : `Explore ${server_username}'s profile. ${bioText}...`;

  useEffect(() => {
    if (username) {
      const getUser = async () => {
        try {
          const res = await publicRequest.get(`/user/me?username=${username}`);
          if (res.status === 200) {
            setProfileUser(res.data.results.data);
            localStorage.setItem(
              "nokofioProfile",
              JSON.stringify(res.data.results.data)
            );
          }
        } catch (error) {
          router.push("/not-found");
        }
      };
      getUser();
    }
  }, []);

  const sites = [
    "facebook",
    "twitter",
    "whatsapp",
    "linkedin",
    "telegram",
    "copy",
  ];

  return (
    <ContainerWrapper
    // style={{ backgroundImage: "url('/images/background-1.svg')" }}
    >
      <Head>
        <title key="title">{message}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metaDesc || null} />
        <link rel="icon" href={server_pic} />
      </Head>
      {profileUser ? (
        <>
          <div className="animate__animated animate__fadeIn">
            <Container>
              <div>
                <Box px={4} pt={2}>
                  <Box display={"flex"} alignItems={"center"}>
                    <ImageContainer>
                      <Image
                        src={
                          profileUser?.profilePicture
                            ? profileUser?.profilePicture
                            : "/images/noAvatar.png"
                        }
                        alt=""
                      />
                    </ImageContainer>
                    <Typography variant="h6" fontWeight={"bolder"}>
                      {profileUser?.displayName}
                    </Typography>
                  </Box>
                </Box>

                <Footer>
                  <SocialContainer>
                    {profileUser?.socialMediaAccount?.facebook && (
                      <a
                        href={`https://facebook.com/${profileUser?.socialMediaAccount?.facebook} `}
                        target={"_blank"}
                        rel={"noreferrer"}
                      >
                        <IconImage src="/images/icons8-facebook-48.svg" />
                      </a>
                    )}
                    {profileUser?.socialMediaAccount?.youtube && (
                      <a
                        href={`https://youtube.com/${profileUser?.socialMediaAccount?.youtube} `}
                        target={"_blank"}
                        rel={"noreferrer"}
                      >
                        <IconImage src="/images/icons8-youtube-48.svg" />
                      </a>
                    )}
                    {profileUser?.socialMediaAccount?.twitter && (
                      <a
                        href={`https://twitter.com/${profileUser?.socialMediaAccount?.twitter} `}
                        target={"_blank"}
                        rel={"noreferrer"}
                      >
                        <IconImage src="/images/icons8-twitter-48.svg" />
                      </a>
                    )}
                    {profileUser?.socialMediaAccount?.instagram && (
                      <a
                        href={`https://instagram.com/${profileUser?.socialMediaAccount?.instagram} `}
                        target={"_blank"}
                        rel={"noreferrer"}
                      >
                        <IconImage src="/images/icons8-instagram-48.svg" />
                      </a>
                    )}
                    {profileUser?.socialMediaAccount?.tiktok && (
                      <a
                        href={`https://tiktok.com/${profileUser?.socialMediaAccount?.tiktok} `}
                        target={"_blank"}
                        rel={"noreferrer"}
                      >
                        <IconImage src="/images/icons8-tiktok-48.svg" />
                      </a>
                    )}
                    {profileUser?.socialMediaAccount?.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${profileUser?.socialMediaAccount?.linkedin} `}
                        target={"_blank"}
                        rel={"noreferrer"}
                      >
                        <IconImage src="/images/icons8-linkedin-48.svg" />
                      </a>
                    )}
                    {profileUser?.socialMediaAccount?.snapchat && (
                      <a
                        href={`https://snapchat.com/${profileUser?.socialMediaAccount?.snapchat} `}
                        target={"_blank"}
                        rel={"noreferrer"}
                      >
                        <IconImage src="/images/icons8-snapchat-48.svg" />
                      </a>
                    )}
                    {profileUser?.socialMediaAccount?.whatsapp && (
                      <a
                        href={`https://api.whatsapp.com/send?phone=${profileUser?.socialMediaAccount?.whatsapp}`}
                        target={"_blank"}
                        rel={"noreferrer"}
                      >
                        <IconImage src="/images/icons8-whatsapp-48.svg" />
                      </a>
                    )}
                  </SocialContainer>
                </Footer>
              </div>
              <AppFooter />
            </Container>
          </div>
        </>
      ) : (
        <>
          <FullPageLoader />
        </>
      )}
    </ContainerWrapper>
  );
};

export default BookAppointment;
