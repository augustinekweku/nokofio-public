import styled from "styled-components";
import { tablet, desktop, mobile } from "../../responsive";

import DashboardRight from "../../components/DashboardRight";
import UserShare from "../../components/UserShareRow";

import {
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Stack,
  Chip,
  Checkbox,
} from "@mui/material";
import BackNavTitle from "../../components/BackNavTitle";
import { userRequest } from "../../requestMethods";
import { topToast } from "../../toast";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import FullPageLoader from "../../components/FullPageLoader";
import { useDispatch } from "react-redux";
import { setFullPageLoading } from "../../redux/fullPageLoadingRedux";
import { FormContainer } from "../../StyledComponents/common";
import { logoutUser } from "../../utils";
import Layout from "../../components/Layout";
import AuthLayout from "../../components/AuthLayout";

const Container = styled.div``;
const MainRow = styled.div`
  display: flex;
`;
const MainLeft = styled.div`
  padding-top: 32px;
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
  display: flex;
  align-items: center;
  padding: 10px;
  font-size: 14px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  ${mobile({ fontSize: "12px", padding: "12px" })}
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
const InputTextarea = styled.textarea`
  padding: 12px 14px 12px 14px;
  width: 100%;
  height: 128px;
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

const SupportContent = () => {
  const donationTitle = useRef();
  const donationDesc = useRef();
  const donationAmount1 = useRef();
  const donationAmount2 = useRef();
  const [supportMyContent, setSupportMyContent] = useState({});
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedSectionText, setSelectedSectionText] = useState(null);
  const [showContributors, setShowContributors] = useState(false);

  const handleChange = (event) => {
    setSelectedSectionText(event.target.value);
  };

  const handleContributorsChange = (e) => {
    setShowContributors(e.target.checked);
  };

  const handleChipClick = (value) => {
    donationTitle.current.value = value;
    setSelectedSectionText(value);
  };

  // const username = JSON.parse(localStorage.getItem("nokofioProfile"))?.username;

  const handleClick = async (e) => {
    e.preventDefault();

    setloading(true);
    const donationObject = {
      description: donationDesc.current.value,
      amount1: donationAmount1.current.value,
      amount2: donationAmount2.current.value,
      title: donationTitle.current.value,
      sectionText: selectedSectionText,
      showContributors: showContributors,
    };
    try {
      const res = await userRequest.post(
        `/sections/supportMeAmount`,
        donationObject
      );
      if (res.status === 200) {
        topToast("success", "Updated successfully");
        setloading(false);
        // router.push("/builder");
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        logoutUser();
      }
      setloading(false);
    }
  };

  useEffect(() => {
    dispatch(setFullPageLoading({ status: true }));
    const retrieveSupportMyContent = async () => {
      try {
        const res = await userRequest.get(`/sections/supportMeAmount`);
        if (res.data.results.data) {
          setSupportMyContent(res.data.results.data);
          setSelectedSectionText(res.data.results.data.sectionText);
          setShowContributors(res.data.results.data.showContributors);
          dispatch(setFullPageLoading({ status: false }));
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          logoutUser();
        } else {
          dispatch(setFullPageLoading({ status: false }));
        }
      }
    };

    retrieveSupportMyContent();
  }, []);
  return (
    <Container className="animate__animated animate__fadeIn">
      <MainRow>
        <MainLeft>
          <UserShare />
          <InnerLeft>
            <BackNavTitle title={"Accept Payments"} />
            <Form onSubmit={handleClick}>
              <FormContainer>
                <FormRow>
                  <Label>Title</Label>
                  <Input
                    ref={donationTitle}
                    required
                    maxLength={100}
                    defaultValue={supportMyContent?.title}
                    placeholder="Enter a title for this section"
                  />
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      mb: 2,
                      mt: -1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Label style={{ marginBottom: 0 }}>Suggested:</Label>
                    <Chip
                      label="Tip Me"
                      variant="outlined"
                      size="small"
                      onClick={() => handleChipClick("Tip Me")}
                    />
                    <Chip
                      label="Support My Content"
                      variant="outlined"
                      size="small"
                      onClick={() => handleChipClick("Support My Content")}
                    />
                    <Chip
                      label="Group Contributions"
                      variant="outlined"
                      size="small"
                      onClick={() => handleChipClick("Group Contributions")}
                    />
                  </Stack>
                </FormRow>
                <FormRow>
                  <Label>Description</Label>
                  <Input
                    defaultValue={supportMyContent?.description}
                    ref={donationDesc}
                    required
                    maxLength={200}
                    placeholder="Type short message for your audience"
                  />
                </FormRow>
                <FormRow>
                  <Label>Suggested amount(1)</Label>
                  <Input
                    defaultValue={supportMyContent?.amount1}
                    ref={donationAmount1}
                    type="number"
                    required
                    max={100}
                    pattern="[0-9]*"
                    placeholder="Enter first amount"
                  />
                </FormRow>
                <FormRow>
                  <Label>Suggested amount(2)</Label>
                  <Input
                    defaultValue={supportMyContent?.amount2}
                    ref={donationAmount2}
                    required
                    max={200}
                    type="number"
                    pattern="[0-9]*"
                    placeholder="Enter second amount"
                  />
                </FormRow>
                <FormRow>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: "#000000e3",
                          "&.Mui-checked": {
                            color: "#000000e3",
                          },
                        }}
                        checked={showContributors}
                        onChange={(e) => handleContributorsChange(e)}
                      />
                    }
                    label="Show Contributors"
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

export default SupportContent;

SupportContent.getLayout = function getLayout(page) {
  return (
    <Layout>
      <AuthLayout>{page}</AuthLayout>{" "}
    </Layout>
  );
};
