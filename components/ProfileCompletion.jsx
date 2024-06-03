import styled from "styled-components";
import CancelIcon from "@mui/icons-material/Cancel";
import { Checkbox, Grid, LinearProgress } from "@mui/material";
import { DivFlex } from "../StyledComponents/common";
import { mobile } from "../responsive";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import { userRequest } from "../requestMethods";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Container = styled.div`
  position: fixed;
  width: 324px;
  ${mobile({ width: "70%" })}
  right: 24px;
  bottom: 24px;
  background: #ffffff;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 16px;
  z-index: 1;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Title = styled.h4`
  color: #202223;
`;
const Body = styled.div``;
const LinearProgressContainer = styled.div`
  position: relative;
  margin: 10px 0;
`;
const Progress = styled.div`
  margin-bottom: 20px;
`;
const Percent = styled.div``;
const CheckboxSvg = styled.img``;
const ItemDiv = styled(DivFlex)`
  margin-top: 10px;
  ${mobile({ fontSize: "14px" })}
`;

const ProfileCompletion = () => {
  const profileUser = useSelector((state) => state.user.user);
  const [completionPercentage, setCompletionPercentage] = useState(101);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [verified, setVerified] = useState(false);
  const profileCompletionContainer = useRef();
  const router = useRouter();

  if (typeof window !== "undefined") {
    var accountVerified = JSON.parse(
      localStorage.getItem("currentUser")
    )?.accountVerified;
  }

  const hideContainer = () => {
    profileCompletionContainer.current.style.display = "none";
  };

  useEffect(() => {
    const getCompletionStatus = async () => {
      try {
        const getSettlementAccountRes = await userRequest.get(
          `/settlementAccount`
        );
        var data = getSettlementAccountRes.data.results.data;
        if (data.accountType) {
          setPaymentMethod(true);
        }
        let accountVerification = accountVerified ? 20 : 0;
        let profilePic =
          profileUser?.profilePicture == null ||
          profileUser?.profilePicture == ""
            ? 0
            : 20;
        let bio = profileUser?.bio == null || profileUser?.bio == "" ? 0 : 20;
        let displayName =
          profileUser?.displayName == null || profileUser?.displayName == ""
            ? 0
            : 10;
        let pageTitle =
          profileUser?.pageTitle == null || profileUser?.pageTitle == ""
            ? 0
            : 10;
        let paymentMethod = data?.accountType ? 20 : 0;
        setCompletionPercentage(
          accountVerification +
            profilePic +
            bio +
            displayName +
            pageTitle +
            paymentMethod
        );
        setVerified(accountVerified);
        // console.log(
        //   accountVerification +
        //     " " +
        //     profilePic +
        //     " " +
        //     bio +
        //     " " +
        //     displayName +
        //     " " +
        //     pageTitle +
        //     " " +
        //     thumbnail +
        //     " " +
        //     paymentMethod
        // );
      } catch (error) {}
    };
    getCompletionStatus();
  }, [
    profileUser.bio,
    profileUser.displayName,
    profileUser.pageTitle,
    profileUser.profilePicture,
    accountVerified,
    completionPercentage,
  ]);

  return (
    <div ref={profileCompletionContainer}>
      {completionPercentage < 100 ? (
        <Container>
          <Header>
            <div></div>
            <Title>Finish the basics</Title>
            <CancelIcon
              onClick={hideContainer}
              sx={{ color: "#202223", cursor: "pointer" }}
            />
          </Header>
          <Body>
            <p
              style={{
                textAlign: "center",
                marginTop: "15px",
                marginBottom: "20px",
              }}
            >
              Complete these to help nokofio work for you better
            </p>
            <Progress>
              <Grid container sx={{ alignItems: "center" }}>
                <Grid item xs={10}>
                  <LinearProgressContainer>
                    <LinearProgress
                      variant="determinate"
                      value={completionPercentage}
                      color="neutral"
                      sx={{
                        height: "10px",
                        borderRadius: "5px",
                      }}
                    />
                  </LinearProgressContainer>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{ display: "flex", justifyContent: "end" }}
                >
                  <Percent>{completionPercentage}%</Percent>
                </Grid>
              </Grid>
            </Progress>
            <ItemDiv
              onClick={() => router.push("/builder/bio")}
              className="pointer"
            >
              <CheckboxSvg
                src={
                  profileUser?.profilePicture
                    ? "/images/svg/checkbox-on.svg"
                    : "/images/svg/checkbox-off.svg"
                }
              />
              &nbsp; Add Profile Image
            </ItemDiv>
            <ItemDiv
              onClick={() => router.push("/builder/bio")}
              className="pointer"
            >
              <CheckboxSvg
                src={
                  profileUser?.displayName
                    ? "/images/svg/checkbox-on.svg"
                    : "/images/svg/checkbox-off.svg"
                }
              />
              &nbsp; Add a Display name
            </ItemDiv>
            <ItemDiv
              onClick={() => router.push("/builder/bio")}
              className="pointer"
            >
              <CheckboxSvg
                src={
                  profileUser?.bio
                    ? "/images/svg/checkbox-on.svg"
                    : "/images/svg/checkbox-off.svg"
                }
              />
              &nbsp; Add a bio description
            </ItemDiv>
            <ItemDiv
              onClick={() => router.push("/settings")}
              className="pointer"
            >
              <CheckboxSvg
                src={
                  paymentMethod
                    ? "/images/svg/checkbox-on.svg"
                    : "/images/svg/checkbox-off.svg"
                }
              />
              &nbsp; Set up payment method
            </ItemDiv>
            <ItemDiv
              onClick={() => router.push("/settings#verify_email")}
              className="pointer"
            >
              <CheckboxSvg
                src={
                  verified
                    ? "/images/svg/checkbox-on.svg"
                    : "/images/svg/checkbox-off.svg"
                }
              />
              &nbsp; Verify your email
            </ItemDiv>
          </Body>
        </Container>
      ) : null}
    </div>
  );
};

export default ProfileCompletion;
