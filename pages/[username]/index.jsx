import Head from "next/head";
import styled from "styled-components";
import { mobile, sm } from "../../responsive";
import VerifiedIcon from "@mui/icons-material/Verified";
import AppFooter from "../../components/AppFooter";
import SupportContentLink from "../../components/SupportContentLink";
import BuyTicketLink from "../../components/BuyTicketLink";
import DonateLink from "../../components/DonateLink";
import DigitalProductLink from "../../components/DigitalProductLink";
import { useEffect, useReducer } from "react";
import { publicRequest } from "../../requestMethods";
import { useState } from "react";
import FullPageLoader from "../../components/FullPageLoader";
import Link from "next/link";
import { RWebShare } from "react-web-share";
import { useRouter } from "next/router";
import { IosShare, LinkedIn } from "@mui/icons-material";
import axios from "axios";
import { centerToast, topToast } from "../../toast";
import { Tooltip, Typography } from "@mui/material";
import { getBaseUrl } from "../../helpers/constants";

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
const Header = styled.div`
  // background-color: ${(props) => props.bg};
`;

const HeaderContent = styled.div`
  width: 80%;
  margin: 0 auto;
  ${mobile({ width: "85%" })}
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
`;
const HeaderLeft = styled.div`
  display: flex;
`;
export const ImageContainer = styled.div`
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
const Username = styled.div`
  display: flex;
  align-items: center;
  padding-left: 16px;
`;
const UsernameText = styled.div`
  font-size: 22px;
  ${sm({ fontSize: "13px", maxWidth: "150px", wordBreak: "break-word" })}
  ${mobile({ fontSize: "14px", maxWidth: "120px", wordBreak: "break-word" })}
`;
const IconContainer = styled.div`
  font-size: 24px;
  margin: 0 10px;
`;
const Title = styled.h1`
  font-size: 25px;
  font-weight: 600;
  margin-bottom: 5px;
  letter-spacing: 0em;
  margin-top: 15px;
  ${mobile({ fontSize: "20px" })}
`;
const Bio = styled.p`
  font-size: 18px;
  ${mobile({ fontSize: "16px" })}
  font-weight: 300;

  line-height: 25px;
  letter-spacing: 0em;
  padding-bottom: 15px;
`;
const ProfileContent = styled.div`
  width: 80%;
  margin: 0 auto;
  ${mobile({ width: "85%" })}
  padding: 5px 0;
`;
const BioImage = styled.img`
  width: 100%;
  height: 300px;
  ${mobile({ height: "200px" })}
  object-fit: cover;
`;
const Subtitle = styled.h3`
  font-size: 20px;
  ${mobile({ fontSize: "18px" })}
  font-style: normal;
  font-weight: 600;
  padding: 20px 0 15px 0;
`;

const LinkCard = styled.div`
  background-color: #353432;
  padding: 15px 16px;
  color: #000;
  border-radius: 5px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  font-size: 14px;

  border-radius: 8px;
  border: 1px solid #000;
  background: var(--primary-white, #fff);
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0), 2px 2px 0px 0px #000;
  cursor: pointer;
  &:hover {
    transform: scale(1.009);
    transition: all 0.3s ease-in-out;
  }
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
const ShareIconContainer = styled.div`
  padding: 10px;
  background-color: #f6f6f6;
  height: 50px;
  width: 50px;
  ${mobile({ height: "40px", width: "40px" })}
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 34;
`;

const ProfileLink = styled.div`
  cursor: pointer;
  &:hover {
    transform: scale(1.035);
    transition: all 0.3s ease-in-out;
  }
`;

const ExternalLinkCard = styled.div`
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-radius: 5px;
  margin-bottom: 16px;
  background: #353432;
  border: 1px solid #353432;
  min-height: 70px;
  ${mobile({ minHeight: "66px" })}
  cursor: pointer;
  &:hover {
    transform: scale(1.009);
    transition: all 0.3s ease-in-out;
  }
`;
const LinkImgWrapper = styled.div`
  /* background: white; */
  width: 40px;
  ${mobile({ width: "40px" })}
  display: flex;
  align-items: center;
  padding: 15px 0;
`;
const LinkImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 5px;
`;
const LinkTitle = styled.p`
  padding-left: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  width: 80%;
  font-size: 15px;
  color: #fff;
  ${mobile({ fontSize: "14px" })}
`;

const Profile = ({
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
  const [ip, setIP] = useState("");
  const [close, setClose] = useState(true);
  const [donateModalClose, setDonateModalClose] = useState(true);
  const [digitalProductModalClose, setDigitalProductModalClose] = useState(true);

  // take first 20 characters of bio
  const bioText = server_bio && server_bio.substring(0, 20);
  const message = `${server_display_name} | Nokofio`;
  const metaDesc =
    section && am
      ? `Donate GHS${am} to ${server_username}`
      : `Explore ${server_username}'s profile. ${bioText}...`;

  const [state, updateState] = useReducer(
    (state, newState) => {
      return { ...state, ...newState };
    },
    {
      donationObj: null,
      supportMeObj: null,
      maintenanceMode: false,
      purpose: null,
      isCssps: false,
    }
  );

  useEffect(() => {
    if (username) {
      const getUser = async () => {
        try {
          const res = await publicRequest.get(`/user/me?username=${username}`);
          if (res.status === 200) {
            setProfileUser(res.data.results.data);
            localStorage.setItem(
              "nokofioPublicProfile",
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

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get("https://geolocation-db.com/json/");
      setIP(res.data.IPv4);
      if (res.status === 200) {
        const res = await publicRequest.post(`/user/pageview`, {
          username: username,
          ip_address: ip,
        });
      }
    };
    getData();
  }, []);

  const emitCopy = (text) => {
    topToast("success", "Link copied to clipboard");
  };
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
            {!close ? (
              <SupportContentLink
                setClose={() => {
                  setClose(true);
                  updateState({ supportMeObj: null });
                }}
                onContributionSucess={() => {
                  setClose(true);
                  updateState({ supportMeObj: null });
                }}
                supportMeObj={state.supportMeObj}
              />
            ) : null}
            {!donateModalClose ? (
              <DonateLink
                setDonateModalClose={() => {
                  setDonateModalClose(true);
                  updateState({ donationObj: null });
                }}
                onSucess={() => {
                  setDonateModalClose(true);
                  updateState({ donationObj: null });
                }}
                donationObj={state.donationObj}
              />
            ) : null}
            {!digitalProductModalClose ? (
              <DigitalProductLink
                setDigitalProductModalClose={setDigitalProductModalClose}
                productProfit={[
                  {
                    wassceProfit: profileUser?.wassceProfit,
                    beceProfit: profileUser?.beceProfit,
                    csspsProfit: profileUser?.csspsProfit,
                    checkProfit: profileUser?.checkProfit,
                  }
                ]}
                purpose={state.purpose}
                isCssps={state.isCssps}
              />
            ) : null}
            <Container>
              <div>
                <Header bg={"white"}>
                  <HeaderContent>
                    <HeaderRow>
                      <HeaderLeft>
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
                        <Username>
                          <UsernameText>
                            @{`${profileUser?.username}`}
                          </UsernameText>
                          {profileUser?.verificationBadge ? (
                            <VerifiedIcon
                              sx={{ marginLeft: "3px", color: "#40A0ED" }}
                              fontSize="small"
                            />
                          ) : null}
                        </Username>
                      </HeaderLeft>
                      <RWebShare
                        data={{
                          url: `${getBaseUrl()}/${username}`,
                        }}
                        sites={sites}
                        onClick={() => emitCopy()}
                      >
                        <Tooltip title="Share Profile">
                          <ShareIconContainer>
                            <IosShare sx={{ fontSize: "18px" }} />
                          </ShareIconContainer>
                        </Tooltip>
                      </RWebShare>
                    </HeaderRow>
                    <Title>{profileUser?.pageTitle}</Title>
                    <Bio>{profileUser?.bio}</Bio>
                  </HeaderContent>
                </Header>
                <ProfileContent>
                  {profileUser?.banner ? (
                    <>
                      <BioImage
                        src={
                          profileUser?.banner
                            ? profileUser?.banner
                            : "/images/no-thumbnail.jpg"
                        }
                        alt=""
                        srcSet=""
                      />
                    </>
                  ) : null}

                  {!profileUser?.donations?.length &&
                  !profileUser?.supportMeAmounts?.length &&
                  !profileUser?.externalLinks?.length &&
                  !profileUser?.hasDigitalProduct ? (
                    <Typography
                      my={6}
                      variant={"h6"}
                      sx={{ textAlign: "center", fontWeight: "bold" }}
                    >
                      No links added yet 😔
                    </Typography>
                  ) : (
                    <>
                      <Subtitle>Links</Subtitle>
                      {profileUser?.hasDigitalProduct ? (
                        <>
                                                   
                        <LinkCard
                          onClick={() => {
                            updateState({ purpose: "check" });
                            if (state.maintenanceMode) {
                              return centerToast(
                                "info",
                                "Sorry, this feature is currently unavailable.",
                                "System is currently in maintenance mode, please try again later"
                              );
                            }
                            setDigitalProductModalClose(false);
                          }}
                        >
                          {/*  eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={"/images/waeclogo.jpg"}
                            alt={"waec logo"}
                            style={{
                              marginRight: "10px",
                              width: "25px",
                            }}
                          />
                          Instant BECE/WASSCE Result Checking - PDF
                        </LinkCard>
                        <LinkCard
                          onClick={() => {
                            updateState({ purpose: "buy" });
                            if (state.maintenanceMode) {
                              return centerToast(
                                "info",
                                "Sorry, this feature is currently unavailable.",
                                "System is currently in maintenance mode, please try again later"
                              );
                            }
                            setDigitalProductModalClose(false);
                          }}
                        >
                          {/*  eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={"/images/waeclogo.jpg"}
                            alt={"waec logo"}
                            style={{
                              marginRight: "10px",
                              width: "25px",
                            }}
                          />
                          Buy Results Checker BECE/WASSCE/PLACEMENT
                        </LinkCard> 
                        <LinkCard
                          onClick={() => {
                            updateState({ purpose: "check", isCssps: true });
                            if (state.maintenanceMode) {
                              return centerToast(
                                "info",
                                "Sorry, this feature is currently unavailable.",
                                "System is currently in maintenance mode, please try again later"
                              );
                            }
                            setDigitalProductModalClose(false);
                          }}
                        >
                           {/*eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={"/images/waeclogo.jpg"}
                            alt={"waec logo"}
                            style={{
                              marginRight: "10px",
                              width: "25px",
                            }}
                          />
                          Check School Placement - Instant
                        </LinkCard>
                        </>
                        
                      ) : null}

                      {profileUser?.donations?.length ? (
                        <>
                          {profileUser?.donations.map((donation, index) => (
                            <LinkCard
                              key={index}
                              className="animate__animated animate__fadeIn"
                              onClickCapture={() => {
                                if (state.maintenanceMode) {
                                  return centerToast(
                                    "info",
                                    "Sorry, this feature is currently unavailable.",
                                    "System is currently in maintenance mode, please try again later"
                                  );
                                }
                                updateState({ donationObj: donation });
                                setDonateModalClose(false);
                              }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={"/images/svg/accept-donations.svg"}
                                alt={"donation icon"}
                                style={{
                                  marginRight: "10px",
                                  width: "25px",
                                }}
                              />
                              {donation?.title}
                            </LinkCard>
                          ))}
                        </>
                      ) : null}
                      {profileUser?.supportMeAmounts?.length ? (
                        <>
                          {profileUser?.supportMeAmounts.map(
                            (donation, index) => (
                              <LinkCard
                                key={index}
                                className="animate__animated animate__fadeIn"
                                onClickCapture={() => {
                                  if (state.maintenanceMode) {
                                    return centerToast(
                                      "info",
                                      "Sorry, this feature is currently unavailable.",
                                      "System is currently in maintenance mode, please try again later"
                                    );
                                  }
                                  updateState({ supportMeObj: donation });
                                  setClose(false);
                                }}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={"/images/svg/accept-payments.svg"}
                                  alt={"donation icon"}
                                  style={{
                                    marginRight: "10px",
                                    width: "25px",
                                  }}
                                />
                                {donation?.title}
                              </LinkCard>
                            )
                          )}
                        </>
                      ) : null}
                      {profileUser?.externalLinks?.length ? (
                        <>
                          {profileUser?.externalLinks.map((link, index) => (
                            //if external link url starts with http:// or https:// then use it as it is else add https:// to it
                            //this is to prevent the link from breaking if the user does not add https:// to the link
                            <a
                              href={
                                link?.url.startsWith("http://") ||
                                link?.url.startsWith("https://")
                                  ? link?.url
                                  : `https://${link?.url}`
                              }
                              target={"_blank"}
                              rel={"noreferrer"}
                              key={index}
                              passhref={"true"}
                            >
                              <LinkCard className="animate__animated animate__fadeIn">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={
                                    link?.thumbnail
                                      ? link?.thumbnail
                                      : "/images/svg/custom-link.svg"
                                  }
                                  alt={" icon"}
                                  style={{
                                    marginRight: "10px",
                                    width: "25px",
                                    objectFit: "contain",
                                  }}
                                />
                                {link?.title}
                              </LinkCard>
                            </a>
                          ))}
                        </>
                      ) : null}
                    </>
                  )}
                </ProfileContent>
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
                        href={`https://wa.me/${profileUser?.socialMediaAccount?.whatsapp}`}
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

export const getServerSideProps = async (context) => {
  const username = context?.query?.username;
  const section = context?.query?.section;
  const am = context?.query?.am;

  try {
    const res = await publicRequest.get(`/user/me2?username=${username}`);
    if (res.status === 200) {
      var from_server_pic = res.data.results.data.profilePicture;
      var server_user = res.data.results.data;
      var from_server_bio = res.data.results.data.bio;
      var from_server_display_name = res.data.results.data.displayName;
      if (am && section) {
        return {
          props: {
            section: section,
            am: am,
            server_user: server_user,
            server_username: username,
            server_pic: from_server_pic,
            server_bio: from_server_bio,
            server_display_name: from_server_display_name,
          },
        };
      } else if (section) {
        return {
          props: {
            section: section,
            server_user: server_user,
            server_username: username,
            server_pic: from_server_pic,
            server_bio: from_server_bio,
            server_display_name: from_server_display_name,
          },
        };
      } else {
        return {
          props: {
            server_user: server_user,
            server_username: username,
            server_pic: from_server_pic,
            server_bio: from_server_bio,
            server_display_name: from_server_display_name,
          },
        };
      }
    }
  } catch (error) {
    return {
      props: {
        section: null,
        am: null,
        server_user: null,
        server_username: null,
        server_pic: null,
        server_bio: null,
        server_display_name: null,
      },
    };
  }
};

export default Profile;
