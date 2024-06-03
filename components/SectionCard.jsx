import styled from "styled-components";

import ReorderIcon from "@mui/icons-material/Reorder";
import { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import { userRequest, publicRequest } from "../requestMethods";
import { topToast } from "../toast";

import clsx from "clsx";
import { setProfileUser } from "../redux/userRedux";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import FullPageLoader from "./FullPageLoader";
import { Chip, Typography } from "@mui/material";
import { mobile } from "../responsive";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

const Container = styled.div`
  margin-bottom: 16px;
`;
const SectionCardWrapper = styled.div`
  position: relative;
  padding: 24px 28px;
  ${mobile({ padding: "24px 5px" })}
  display: flex;
  width: 100%;
  height: 90px;

  background-color: #ffffff;
  /* cursor: pointer; */
  border-radius: 8px;
`;
const CardInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const CardInnerLeftWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-grow: 1;
`;
const CardInnerLeftIcon = styled.div`
  color: black;
`;
const CardSubtitle = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: black;
`;
const CardInnerLeftInfo = styled.div``;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  color: black;
  font-size: 16px;
  font-weight: 500;
`;
const CardInnerRightWrapper = styled.div``;
const CardInnerRight = styled.div`
  display: flex;
  align-items: center;
`;
const CardInnerRightIcon = styled.div`
  margin: 0 8px;
  padding: 11px 11px;
  background: #f5f5f5;
  border-radius: 50%;
`;
const DisabledDiv = styled.div`
  position: absolute;
  background: #00000040;
  height: 100%;
  top: 0;
  left: 0;
  width: 100%;
  border-radius: 8px;
  cursor: not-allowed;
  z-index: 2;
`;
const SectionCard = ({ cardDetail }) => {
  const [isHidden] = useState(false);
  const profileUser = useSelector((state) => state.user.user);
  const [toggleStatus, setToggleStatus] = useState(false);
  const [sectionId, setSectionId] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setloading] = useState(false);

  // const hideCard = () => {
  //   isHidden ? setIsHidden(false) : setIsHidden(true);
  //   console.log("object");
  // };

  const handleChange = async (event) => {
    setloading(true);
    try {
      const res = await userRequest.post(`/sections/toggle`, {
        sectionId: sectionId,
        enablePublicView: event.target.checked,
      });
      setToggleStatus(!event.target.checked);
      getProfile();
      setloading(false);

      topToast("success", "Updated successfully");
    } catch (error) {
      // console.log("error", error);
      setloading(false);
      topToast("error", "Something went wrong");
      if (error.response.status === 401) {
        // Destroy
        location.href = "/login";
        window.location.href = "/";
      }
      if (error.response.status === 404) {
        topToast("error", error.response.data.message);
        router.push(`${cardDetail.url}`);
      }
    }
  };

  useEffect(() => {
    const setCardStatuses = () => {
      setSectionId(cardDetail.id);
      if (cardDetail.title === "Donations") {
        setToggleStatus(profileUser?.donation?.title ? true : false);
      }
      if (cardDetail.title === "Accept Payments") {
        setToggleStatus(profileUser?.supportMeAmount ? true : false);
      }
      if (cardDetail.title === "Social Media Links") {
        setToggleStatus(profileUser?.socialMediaAccount ? true : false);
      }
      if (cardDetail.title === "External Link") {
        setToggleStatus(
          profileUser?.isExternalLinkActive
            ? profileUser.isExternalLinkActive
            : false
        );
      }
      if (cardDetail.title === "Ticket") {
        setToggleStatus(!!profileUser?.events?.length > 0);
      }
      if (cardDetail.title === "Shop Setup") {
        setToggleStatus(!!profileUser?.products?.length);
      }
    };
    setCardStatuses();
  }, [
    profileUser?.events?.length,
    profileUser?.socialMediaAccount,
    profileUser?.supportMeAmount,
    profileUser?.donation?.title,
    cardDetail.id,
    cardDetail.title,
    profileUser.isExternalLinkActive,
    profileUser?.products?.length,
  ]);

  const getProfile = async () => {
    const usercookie = getCookie("nokofio_user");
    const user = JSON.parse(usercookie);
    try {
      const res = await publicRequest.get(`/user/me?username=${user.username}`);
      const donationRes = await userRequest.get(`donation/transactions/amount`);
      const donationTransactionsRes = await userRequest.get(
        `donation/transactions/`
      );

      if (
        res.status === 200 &&
        donationRes.status === 200 &&
        donationTransactionsRes.status === 200
      ) {
        const profileUserObj = {
          ...res.data.results.data,
          amountDonated: donationRes.data,
          donationsCount: donationTransactionsRes.data.results.data.length,
        };
        dispatch(setProfileUser(profileUserObj));
      }
    } catch (error) {
      if (error.response.status === 401) {
        // Destroy
        location.href = "/login";
      }
    }
  };

  useEffect(() => {
    const getSectionStatus = async () => {
      try {
        // const res = await userRequest.post(`/sections/toggle`, donationObject);
        // console.log("res", res);
      } catch (error) {}
    };
    return () => {};
  }, []);

  return (
    <Container>
      {loading ? <FullPageLoader /> : null}
      <SectionCardWrapper
        className={clsx(
          cardDetail.isChecked ? "" : "d-none",
          isHidden ? "hide" : ""
        )}
      >
        {cardDetail.status === "coming-soon" ? (
          <DisabledDiv></DisabledDiv>
        ) : null}
        <CardInner>
          <Link sx={{ color: "black" }} href={cardDetail.url} legacyBehavior>
            <CardInnerLeftWrapper>
              <CardInnerLeftIcon>
                <ReorderIcon
                  sx={{
                    ml: {
                      xs: "10px",
                      lg: "0px",
                    },
                    mr: {
                      xs: "10px",
                    },
                  }}
                />
              </CardInnerLeftIcon>
              <CardInnerLeftInfo>
                <Typography variant="body1" fontWeight={"bold"}>
                  {cardDetail.title} &nbsp;
                  {cardDetail.status === "coming-soon" ? (
                    <Chip
                      color="primary"
                      label={
                        <Typography sx={{ fontSize: "10px" }}>
                          Coming soon!
                        </Typography>
                      }
                      size="small"
                    />
                  ) : null}
                </Typography>
                <Typography
                  variant="body2"
                  fontSize={"small"}
                  color={"GrayText"}
                  lineHeight={1.2}
                >
                  {" "}
                  {cardDetail.subtitle}
                </Typography>
              </CardInnerLeftInfo>
            </CardInnerLeftWrapper>
          </Link>
          <CardInnerRightWrapper>
            {cardDetail.toggle && cardDetail.status !== "coming-soon" ? (
              <CardInnerRight>
                <CardInnerRightIcon>
                  <Switch
                    onChange={handleChange}
                    size="small"
                    checked={toggleStatus}
                  />
                </CardInnerRightIcon>
              </CardInnerRight>
            ) : null}
          </CardInnerRightWrapper>
        </CardInner>
      </SectionCardWrapper>
    </Container>
  );
};

export default SectionCard;
