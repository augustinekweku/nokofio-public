import styled from "styled-components";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useSelector } from "react-redux";
import { desktop, desktopLarge, mobile } from "../responsive";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { setProfileUser } from "../redux/userRedux";
import { getProfile, logoutUser } from "../utils";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { topToast } from "../toast";
import { userRequest } from "../requestMethods";
import { useState } from "react";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import TikTokIcon from "../components/Icons/TiktokIcon";
import { LinkedIn } from "@mui/icons-material";

const Container = styled.div``;

const PhoneContainer = styled.div`
  margin: 0 auto;
  border: 5px solid #000;
  border-radius: 25px;
  overflow: scroll;
  background-color: #fff;
  ${mobile({ height: "80vh" })}
  ${desktop({ width: "330px", height: "620px" })}
  ${desktopLarge({ width: "360px", height: "650px" })}
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
const PhoneContainerHeader = styled.div`
  padding: 15px 15px;
`;
const PhoneContainerRow = styled.div`
  display: flex;
  align-items: center;
`;
const ImageContainer = styled.div`
  width: 60px;
  height: 60px;
  margin-right: 10px;
  /* ${mobile({ height: "50px", width: "50px" })} */
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;
const ProfileTitle = styled.div`
  font-size: 25px;
  font-weight: 600;
  margin: 10px 0;
  ${mobile({ fontSize: "15px", margin: "7px 0 " })}
`;

const ProfileMediaWrapper = styled.div`
  position: relative;
`;
const ProfileMedia = styled.img`
  width: 100%;
  height: 220px;
  ${mobile({ height: "180px" })}
  object-fit: cover;
`;

const ProfileBody = styled.div`
  padding: 15px 15px;
`;

const SubHeading = styled.div`
  font-size: 15px;
  margin-bottom: 10px;
  ${mobile({ fontSize: "12px" })}
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

const Username = styled.div`
  display: flex;
  align-items: center;
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
  margin-top: 32px;
  margin-bottom: 48px;
  width: 100%;
  overflow-x: scroll;
  padding-bottom: 10px;
`;

const IconImage = styled.img`
  width: 25px;
  margin: 0 5px;
`;

const PhonePreview = () => {
  const profileUser = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const deleteThumbnail = async () => {
    if (confirm("Are you sure you want to remove thumbnail?") == true) {
      setLoading(true);
      try {
        const res = await userRequest.post(`/user/profileBio`, {
          thumbnail: "",
        });
        if (res.status === 200) {
          setLoading(false);
          const newProfileObj = await getProfile();
          dispatch(setProfileUser({ ...profileUser, ...newProfileObj }));
          alert("Thumbnail removed successfully");
        }
      } catch (error) {
        setLoading(false);
        if (error.response.status === 401) {
          logoutUser();
        }
      }
    }
  };
  return (
    <Container>
      <PhoneContainer>
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
              {profileUser?.username}{" "}
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
          {profileUser?.hasDigitalProduct ? (
            <>
            <LinkCard>
              {/*  eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={"/images/waeclogo.jpg"}
                alt={"waec logo"}
                style={{
                  marginRight: "10px",
                  width: "25px",
                }}
              />
              Buy Results Checker BECE/WASSCE
            </LinkCard>
            <LinkCard>
            {/*  eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={"/images/waeclogo.jpg"}
              alt={"waec logo"}
              style={{
                marginRight: "10px",
                width: "25px",
              }}
            />
            Intant Results Checking
          </LinkCard>
          </>
          ) : null}
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
                href={`https://tiktok.com/@${profileUser?.socialMediaAccount?.tiktok} `}
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
      </PhoneContainer>
    </Container>
  );
};

export default PhonePreview;
