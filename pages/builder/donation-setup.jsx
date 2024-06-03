import styled from "styled-components";
import { mobile } from "../../responsive";
import { tablet, desktop } from "../../responsive";

import DashboardRight from "../../components/DashboardRight";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { userRequest } from "../../requestMethods";

import { centerToast, topToast } from "../../toast";
import UserShare from "../../components/UserShareRow";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import { BackButton, FormContainer } from "../../StyledComponents/common";
import BackNavTitle from "../../components/BackNavTitle";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setFullPageLoading } from "../../redux/fullPageLoadingRedux";
import { logoutUser } from "../../utils";
import Layout from "../../components/Layout";
import AuthLayout from "../../components/AuthLayout";

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

const Button = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 15px;
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

const DonationSetup = () => {
  const donationTitle = useRef();
  const donationDesc = useRef();
  const donationAmount1 = useRef();
  const donationAmount2 = useRef();
  const donationTarget = useRef();
  const donationDeadline = useRef();
  const [donation, setDonation] = useState({});
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [showTarget, setShowTarget] = useState(false);
  const [showContributors, setShowContributors] = useState(false);

  // const username = JSON.parse(localStorage.getItem("nokofioProfile"))?.username;

  const handleClick = async (e) => {
    e.preventDefault();
    if (
      parseFloat(donationAmount1.current.value) >
        parseFloat(donationTarget.current.value) ||
      parseFloat(donationAmount2.current.value) >
        parseFloat(donationTarget.current.value)
    ) {
      centerToast(
        "info",
        "Oops!",
        "Donation amount is higher than donation target"
      );
      return;
    }
    setloading(true);
    const donationObject = {
      title: donationTitle.current.value,
      description: donationDesc.current.value,
      amount1: donationAmount1.current.value,
      amount2: donationAmount2.current.value,
      targetAmount: donationTarget.current.value,
      makeTargetAmountPublic: showTarget,
      showContributors: showContributors,
    };
    try {
      const res = await userRequest.post(`/sections/donation`, donationObject);
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

  const handleTargetChange = (e) => {
    setShowTarget(e.target.checked);
  };

  const handleContributorsChange = (e) => {
    setShowContributors(e.target.checked);
  };

  // useEffect(() => {
  //   const retrieveDonation = async () => {
  //     try {
  //       dispatch(setFullPageLoading({ status: true }));
  //       const res = await userRequest.get(`/sections/donation`);
  //       if (res.data.results.data) {
  //         setDonation(res.data.results.data);
  //         setShowTarget(res.data.results.data.makeTargetAmountPublic);
  //         setShowContributors(res.data.results.data.showContributors);
  //         dispatch(setFullPageLoading({ status: false }));
  //       }
  //     } catch (error) {
  //       dispatch(setFullPageLoading({ status: false }));
  //       if (error?.response?.status === 401) {
  //         logoutUser();
  //       } else {
  //       }
  //     }
  //   };

  //   retrieveDonation();
  // }, []);

  return (
    <Container className="animate__animated animate__fadeIn">
      <MainRow>
        <MainLeft>
          <UserShare />
          <InnerLeft>
            <BackNavTitle title={"Donation Setup"} />
            <Form onSubmit={handleClick}>
              <FormContainer>
                <FormRow>
                  <Label>Title</Label>
                  <Input
                    ref={donationTitle}
                    required
                    maxLength={100}
                    defaultValue={donation?.title}
                    placeholder="Enter a heartwarming title for this donation"
                  />
                </FormRow>
                <FormRow>
                  <Label>Donation Description</Label>
                  <InputTextarea
                    defaultValue={donation?.description}
                    ref={donationDesc}
                    required
                    maxLength={200}
                    placeholder="Describe the situation and give succint reason why we people should donate"
                  />
                </FormRow>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormRow>
                      <Label>Suggested amount(1)</Label>
                      <Input
                        defaultValue={donation?.amount1}
                        ref={donationAmount1}
                        required
                        pattern="[0-9]*"
                        type="number"
                        max={100}
                        placeholder="Enter first amount"
                      />
                    </FormRow>
                  </Grid>
                  <Grid item xs={6}>
                    <FormRow>
                      <Label>Suggested amount(2)</Label>
                      <Input
                        defaultValue={donation?.amount2}
                        ref={donationAmount2}
                        required
                        pattern="[0-9]*"
                        type="number"
                        max={200}
                        placeholder="Enter second amount"
                      />
                    </FormRow>
                  </Grid>
                  <Grid item xs={6}>
                    <FormRow>
                      <Label>Donation Target</Label>
                      <Input
                        style={{ marginBottom: "5px" }}
                        defaultValue={donation?.targetAmount}
                        ref={donationTarget}
                        required
                        pattern="[0-9]*"
                        type="number"
                        placeholder="Enter donation target"
                      />
                    </FormRow>
                  </Grid>
                  <Grid item xs={6}>
                    {/* <FormRow>
                      <Label>Deadline</Label>
                      <Input
                        style={{ marginBottom: "5px" }}
                        defaultValue={donation?.deadline}
                        ref={donationDeadline}
                        type="date"
                        placeholder="Enter donation deadline"
                      />
                    </FormRow> */}
                  </Grid>
                </Grid>
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
                        checked={showTarget}
                        onChange={(e) => handleTargetChange(e)}
                      />
                    }
                    label="Set Donation Target Public"
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

export default DonationSetup;

DonationSetup.getLayout = function getLayout(page) {
  return (
    <Layout>
      <AuthLayout>{page}</AuthLayout>{" "}
    </Layout>
  );
};
