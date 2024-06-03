import styled from "styled-components";
import ShareIcon from "@mui/icons-material/Share";
import VerifiedIcon from "@mui/icons-material/Verified";
import { mobile, desktop, desktopLarge, xl } from "../responsive";
import { useSelector } from "react-redux";
import { topToast } from "../toast";
import { RWebShare } from "react-web-share";
import { IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { userRequest } from "../requestMethods";
import FullPageLoader from "./FullPageLoader";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setProfileUser } from "../redux/userRedux";
import { getProfile, logoutUser, TruncateString } from "../utils";
import AppFooter from "./AppFooter";
import Swal from "sweetalert2";
import { truncateText } from "../helpers";
import { getBaseUrl } from "../helpers/constants";
import PhonePreview from "./PhonePreview";

const Container = styled.div`
  height: 100vh;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const InnerRight = styled.div``;

const InnerRightTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
  /* ${desktopLarge({ marginLeft: "10px", marginRight: "10px" })} */

  margin-top: 16px;
  margin-bottom: 44px;
`;

const RightTopHalf = styled.div``;

const RightTopHalfText = styled.div`
  font-size: 14px;
  font-weight: 500;
`;
const RightTopHalfButton = styled.button`
  background: #f5f5f5;
  border-radius: 6px;
  padding: 8px;
  border: none;
  display: flex;
  align-items: center;
`;
const PhoneContainer = styled.div`
  margin: 0 auto;
  width: 375px;
  border-radius: 25px;

  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
const PhoneContainerHeader = styled.div`
  padding: 15px 15px 0 15px;
`;
const PhoneContainerRow = styled.div`
  display: flex;
  align-items: center;
`;
const ImageContainer = styled.div`
  width: 60px;
  height: 60px;
  margin-right: 10px;
`;
const Username = styled.div`
  display: flex;
  align-items: center;
`;
const Image = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
`;
const ProfileTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin: 10px 0;
`;

const ProfileMediaWrapper = styled.div`
  position: relative;
`;
const ProfileMedia = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProfileBody = styled.div`
  padding: 10px 15px 0 15px;
`;

const SubHeading = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
`;
const LinkCard = styled.div`
  background-color: #353432;
  padding: 11px 16px;
  color: #000;
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  font-size: 14px;

  padding: 8px;

  border-radius: 8px;
  border: 1px solid #000;
  background: var(--primary-white, #fff);
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0), 2px 2px 0px 0px #000;
`;

const SpanText = styled.span`
  border: 1px solid #989898;
  color: #989898;
  padding: 5px;
  border-radius: 5px;
  margin-left: 5px;
`;

const DeleteIconWrapper = styled.div`
  background: rgba(0, 0, 0, 0);
  position: absolute;
  justify-content: center;
  align-items: center;
  display: flex;
  top: 10px;
  right: 10px;
  border-radius: 50px;
`;
const Footer = styled.div`
  width: 80%;
  margin: 0 auto;
  ${mobile({ width: "85%" })}
`;

const SocialContainer = styled.div`
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
  overflow-x: scroll;
  padding-bottom: 10px;
`;

const IconImage = styled.img`
  width: 35px;
  margin: 0 5px;
`;

const DashboardRight = () => {
  const profileUser = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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

  const deleteThumbnail = async () => {
    Swal.fire({
      title: "Are you sure you want to remove thumbnail?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const res = await userRequest.post(`/user/profileBio`, {
            thumbnail: "",
          });
          if (res.status === 200) {
            setLoading(false);
            const newProfileObj = await getProfile();
            dispatch(setProfileUser({ ...profileUser, ...newProfileObj }));
            topToast("success", "Thumbnail  removed successfully");
          }
        } catch (error) {
          setLoading(false);
          if (error.response.status === 401) {
            logoutUser();
          }
        }
      }
    });
  };

  return (
    <Container>
      {loading ? <FullPageLoader /> : null}
      <InnerRight>
        <InnerRightTop>
          <RightTopHalf>
            <RightTopHalfText>
              <SpanText>
                nokofio.me/{truncateText(profileUser?.username, 8)}
              </SpanText>
            </RightTopHalfText>
          </RightTopHalf>
          <RightTopHalf>
            <RWebShare
              data={{
                text: "Check me out on Nokofio.",
                url: `${getBaseUrl()}/${profileUser?.username}`,
                title: "Share profile via",
              }}
              sites={sites}
              onClick={() => emitCopy()}
            >
              <RightTopHalfButton>
                {" "}
                <ShareIcon /> &nbsp; <Typography>Share</Typography>
              </RightTopHalfButton>
            </RWebShare>
          </RightTopHalf>
        </InnerRightTop>
        <PhoneContainer className="d-none">
          <PhoneContainerHeader>
            <PhoneContainerRow>
              <ImageContainer>
                <Image
                  alt=""
                  src={
                    profileUser?.profilePicture
                      ? profileUser?.profilePicture
                      : "/images/noAvatar.png"
                  }
                ></Image>
              </ImageContainer>
              <Username>
                @{profileUser?.username} &nbsp;{" "}
                {profileUser?.verificationBadge && (
                  <VerifiedIcon sx={{ height: "18px", color: "#40A0ED" }} />
                )}
              </Username>
            </PhoneContainerRow>
            <ProfileTitle>{profileUser?.pageTitle}</ProfileTitle>
            <SubHeading>{profileUser?.bio}</SubHeading>
          </PhoneContainerHeader>
          <ProfileMediaWrapper>
            <ProfileMedia
              src={
                profileUser?.banner
                  ? profileUser?.banner
                  : "/images/no-thumbnail.jpg"
              }
            />
            <DeleteIconWrapper>
              <IconButton
                size="small"
                sx={{
                  marginBottom: "5px",
                }}
                onClick={deleteThumbnail}
              >
                <CloseIcon
                  sx={{
                    background: "#000000a1",
                    color: "white",
                    borderRadius: "50px",
                    padding: "2px",
                  }}
                  fontSize="inherit"
                />
              </IconButton>
            </DeleteIconWrapper>
          </ProfileMediaWrapper>

          <ProfileBody>
            <SubHeading>Links</SubHeading>
            {profileUser?.donations?.length ? (
              <>
                {profileUser?.donations.map((donation, index) => (
                  <LinkCard
                    key={index}
                    className="animate__animated animate__fadeIn"
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
                {profileUser?.supportMeAmounts.map((donation, index) => (
                  <LinkCard
                    key={index}
                    className="animate__animated animate__fadeIn"
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
                ))}
              </>
            ) : null}
            {profileUser?.externalLinks?.length ? (
              <>
                {profileUser?.externalLinks.map((link, index) => (
                  <LinkCard
                    key={index}
                    className="animate__animated animate__fadeIn"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        link?.thumbnail
                          ? link?.thumbnail
                          : "/images/svg/custom-link.svg"
                      }
                      alt={"donation icon"}
                      style={{
                        marginRight: "10px",
                        width: "25px",
                        objectFit: "contain",
                      }}
                    />
                    {link?.title}
                  </LinkCard>
                ))}
              </>
            ) : null}
          </ProfileBody>
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
              {profileUser?.socialMediaAccount?.whatsapp && (
                <a
                  href={`https://wa.me/${profileUser?.socialMediaAccount?.whatsapp} `}
                  target={"_blank"}
                  rel={"noreferrer"}
                >
                  <IconImage src="/images/icons8-whatsapp-48.svg" />
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
                  href={`https://linkedin.com/in/${profileUser?.socialMediaAccount?.snapchat} `}
                  target={"_blank"}
                  rel={"noreferrer"}
                >
                  <IconImage src="/images/icons8-snapchat-48.svg" />
                </a>
              )}
            </SocialContainer>
          </Footer>
          <AppFooter />
        </PhoneContainer>
        <PhoneContainer>
          <PhonePreview />
        </PhoneContainer>
      </InnerRight>
    </Container>
  );
};

export default DashboardRight;
