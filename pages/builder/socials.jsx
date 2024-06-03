import styled from "styled-components";
import { mobile } from "../../responsive";
import { tablet, desktop } from "../../responsive";
import DashboardRight from "../../components/DashboardRight";
import UserShare from "../../components/UserShareRow";
import { useState } from "react";
import { useRef } from "react";
import { CircularProgress } from "@mui/material";
import { userRequest } from "../../requestMethods";
import { topToast } from "../../toast";
import { useEffect } from "react";
import { getProfile, logoutUser } from "../../utils";
import BackNavTitle from "../../components/BackNavTitle";
import { FormContainer } from "../../StyledComponents/common";
import { useDispatch, useSelector } from "react-redux";
import { setProfileUser } from "../../redux/userRedux";
import Layout from "../../components/Layout";
import AuthLayout from "../../components/AuthLayout";

const Container = styled.div``;
const MainRow = styled.div`
  display: flex;
`;
const MainLeft = styled.div`
  overflow-y: scroll;
  height: 100vh;
  padding-bottom: 32px;
  flex: 2;
  background-color: #e8e8e8;
  ${mobile({ width: "100%", paddingTop: "0px", height: "100vh" })}
  ${tablet({ width: "100%", paddingTop: "0px", height: "100vh" })}
`;

const MainRight = styled.div`
  flex: 1;
  ${mobile({ display: "none" })}
  ${tablet({ display: "none" })}
    ${desktop({ display: "block" })}
`;
const InnerLeft = styled.div`
  padding-left: 80px;
  padding-right: 80px;
  ${mobile({ padding: "0px 15px" })}
`;
const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
  margin-top: 20px;
`;
const HeaderLeft = styled.div``;
const HeaderRight = styled.div``;
const Heading = styled.h1`
  font-size: 32px;
  font-weight: 600;
  ${mobile({ fontSize: "24px" })}
`;

const Button = styled.button`
  cursor: pointer;
  padding: 15px;
  font-size: 14px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  ${mobile({ fontSize: "12px", padding: "12px" })}
`;

const Form = styled.form``;
const FormRow = styled.div``;

const UsernameInput = styled.input`
  padding: 12px 14px 12px 14px;
  width: 100%;
  height: 48px;
  background: #f5f5f5;
  border-radius: 0px 8px 8px 0px;
  border: none;
  &:focus {
    outline: none;
  }
`;
const InnerField = styled.div`
  margin-right: -14px;
  padding-left: 14px;
  background: #f5f5f5;
  padding-top: 12px;
  padding-bottom: 12px;
  z-index: 2;
`;

const FieldRow = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;
const FormActionRow = styled.div`
  margin: 20px 0 0 0;
`;

const Socials = () => {
  const [loading, setloading] = useState(false);
  const [socials, setSocials] = useState({});
  const profileUser = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const facebook = useRef();
  const instagram = useRef();
  const twitter = useRef();
  const linkedin = useRef();
  const snapchat = useRef();
  const tiktok = useRef();
  const youtube = useRef();
  const whatsapp = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    const socialsObj = {
      facebook: facebook.current.value,
      instagram: instagram.current.value,
      twitter: twitter.current.value,
      linkedin: linkedin.current.value,
      snapchat: snapchat.current.value,
      tiktok: tiktok.current.value,
      youtube: youtube.current.value,
      whatsapp: whatsapp.current.value,
    };
    try {
      const res = await userRequest.post(
        `/sections/socialMediaAccount`,
        socialsObj
      );
      if (res.status === 200) {
        setloading(false);
        topToast("success", "Social Media links updated successfully");
        const newProfileObj = await getProfile();
        dispatch(setProfileUser({ ...profileUser, ...newProfileObj }));
      }
    } catch (error) {
      setloading(false);
      if (error.response.status === 401) {
        logoutUser();
      }
    }
  };

  const getSocialMediaLinks = async () => {
    try {
      const res = await userRequest.get(`/sections/socialMediaAccount`);
      if (res.status === 200) {
        setSocials(res.data);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        logoutUser();
      } else {
      }
    }
  };

  useEffect(() => {
    getSocialMediaLinks();
  }, [socials.facebook]);

  return (
    <Container>
      <MainRow>
        <MainLeft>
          <UserShare />
          <InnerLeft>
            <BackNavTitle title={"Socials"} />

            <FormContainer>
              <Form onSubmit={handleSubmit}>
                <FormRow>
                  <FieldRow>
                    <InnerField>facebook.com/</InnerField>
                    <UsernameInput
                      ref={facebook}
                      defaultValue={socials?.facebook}
                      placeholder="facebook"
                    />
                  </FieldRow>
                </FormRow>

                <FormRow>
                  <FieldRow>
                    <InnerField>instagram.com/</InnerField>
                    <UsernameInput
                      ref={instagram}
                      defaultValue={socials?.instagram}
                      placeholder="instagram"
                    />
                  </FieldRow>
                </FormRow>
                <FormRow>
                  <FieldRow>
                    <InnerField>twitter.com/</InnerField>
                    <UsernameInput
                      ref={twitter}
                      defaultValue={socials?.twitter}
                      placeholder="twitter"
                    />
                  </FieldRow>
                </FormRow>
                <FormRow>
                  <FieldRow>
                    <InnerField>linkedin.com/in/</InnerField>
                    <UsernameInput
                      ref={linkedin}
                      defaultValue={socials?.linkedin}
                      placeholder="username"
                    />
                  </FieldRow>
                </FormRow>
                <FormRow>
                  <FieldRow>
                    <InnerField>snapchat.com/</InnerField>
                    <UsernameInput
                      ref={snapchat}
                      defaultValue={socials?.snapchat}
                      placeholder="username"
                    />
                  </FieldRow>
                </FormRow>
                <FormRow>
                  <FieldRow>
                    <InnerField>tiktok.com/@</InnerField>
                    <UsernameInput
                      ref={tiktok}
                      defaultValue={socials?.tiktok}
                      placeholder="tiktok"
                    />
                  </FieldRow>
                </FormRow>
                <FormRow>
                  <FieldRow>
                    <InnerField>WhatsApp_Number: </InnerField>
                    <UsernameInput
                      ref={whatsapp}
                      defaultValue={socials?.whatsapp}
                      placeholder=" WhatsApp Number"
                    />
                  </FieldRow>
                </FormRow>
                <FormRow>
                  <FieldRow>
                    <InnerField>youtube.com/</InnerField>
                    <UsernameInput
                      ref={youtube}
                      defaultValue={socials?.youtube}
                      placeholder="youtube"
                    />
                  </FieldRow>
                </FormRow>
                <FormActionRow>
                  <Button type="submit" disabled={loading}>
                    {" Submit"} &nbsp;
                    {loading && (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    )}
                  </Button>{" "}
                </FormActionRow>
              </Form>
            </FormContainer>
          </InnerLeft>
        </MainLeft>
        <MainRight>
          <DashboardRight />
        </MainRight>
      </MainRow>
    </Container>
  );
};

export default Socials;

Socials.getLayout = function getLayout(page) {
  return (
    <Layout>
      <AuthLayout>{page}</AuthLayout>{" "}
    </Layout>
  );
};
