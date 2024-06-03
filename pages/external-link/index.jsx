import styled from "styled-components";
import { mobile } from "../../responsive";
import { tablet, desktop } from "../../responsive";
import DashboardRight from "../../components/DashboardRight";
import UserShare from "../../components/UserShareRow";

import BackNavTitle from "../../components/BackNavTitle";

import { Button, FormContainer } from "../../StyledComponents/common";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { CircularProgress, Typography } from "@mui/material";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { setFullPageLoading } from "../../redux/fullPageLoadingRedux";
import { userRequest } from "../../requestMethods";

const Container = styled.div``;
const MainRow = styled.div`
  display: flex;
`;
const MainLeft = styled.div`
  overflow-y: scroll;
  height: 100vh;
  padding: 32px 0;
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

const Form = styled.form``;
const FormRow = styled.div``;
const Label = styled.div`
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 12px 14px 12px 14px;
  width: 100%;
  height: 48px;
  background: #f5f5f5;
  border-radius: 8px 8px 8px 8px;
  border: none;
  margin-bottom: 20px;
  &:focus {
    outline: none;
  }
`;

const FormActionRow = styled.div`
  margin: 20px 0 0 0;
`;

const ExternalLink = () => {
  const title = useRef();
  const url = useRef();
  const [externalLink, setExternalLink] = useState({});
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleClick = async (e) => {
    e.preventDefault();
    setloading(true);
    const externalLinkObject = {
      title: title.current.value,
      url: url.current.value,
    };
    try {
      const res = await userRequest.post(
        `/sections/externalLink`,
        externalLinkObject
      );
      if (res.status === 200) {
        topToast("success", "Updated successfully");
        setloading(false);
        router.push("/builder");
      }
    } catch (error) {
      setloading(false);
    }
  };

  useEffect(() => {
    dispatch(setFullPageLoading({ status: true }));
    const retrieveExternalLink = async () => {
      try {
        const res = await userRequest.get(`/sections/externalLink`);
        if (res.data.results.data) {
          setExternalLink(res.data.results.data);
          dispatch(setFullPageLoading({ status: false }));
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          localStorage.removeItem("currentUser");
          localStorage.removeItem("nokofioProfile");
          window.location.href = "/";
        } else {
          dispatch(setFullPageLoading({ status: false }));
        }
      }
    };

    retrieveExternalLink();
  }, []);

  return (
    <Container className="animate__animated animate__fadeIn">
      <MainRow>
        <MainLeft>
          <UserShare />
          <InnerLeft>
            <BackNavTitle title={"External Link"} />

            <Form onSubmit={handleClick}>
              <FormContainer>
                <FormRow>
                  <Label>Link Title</Label>
                  <Input
                    defaultValue={externalLink?.title}
                    ref={title}
                    required
                    placeholder="Watch My Video"
                  />
                </FormRow>
                <FormRow>
                  <Label>Url</Label>
                  <Input
                    defaultValue={externalLink?.url}
                    ref={url}
                    required
                    placeholder="Url e.g https://youtube.com/8sjv43klj29"
                  />
                </FormRow>
                <FormActionRow>
                  <Button disabled={loading}>
                    <Typography>Submit</Typography> &nbsp;
                    {loading && (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    )}
                  </Button>
                </FormActionRow>
              </FormContainer>
            </Form>
          </InnerLeft>
        </MainLeft>
        <MainRight>
          <DashboardRight />
        </MainRight>
      </MainRow>
    </Container>
  );
};

export default ExternalLink;
