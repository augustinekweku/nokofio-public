import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import BackNavTitle from "../../components/BackNavTitle";
import { mobile } from "../../responsive";
import {
  FormContainer,
  FormOption,
  FormSelect,
  SelectContainer,
} from "../../StyledComponents/common";
import { useSelector } from "react-redux";
import { publicRequest, userRequest } from "../../requestMethods";
import { setProfileUser } from "../../redux/userRedux";
import { useDispatch } from "react-redux";
import { centerToast, topToast } from "../../toast";
import { getCookie, setCookie } from "cookies-next";
import { useEffect } from "react";
import { setFullPageLoading } from "../../redux/fullPageLoadingRedux";
import { logoutUser } from "../../utils";
import InnerLoader from "../../components/InnerLoader";
import RelativeInnerLoader from "../../components/RelativeInnerLoader";
import { useReducer } from "react";
import Layout from "../../components/Layout";
import AuthLayout from "../../components/AuthLayout";

const Container = styled.div`
  padding-left: 80px;
  padding-right: 80px;
  ${mobile({ padding: "0px 15px" })}
  background-color: #e8e8e8;
  overflow-y: scroll;
  height: 100vh;
`;

const Form = styled.form`
  margin-bottom: 25px;
`;
const FormRow = styled.div`
  margin-bottom: 20px;
`;
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
  &:focus {
    outline: none;
  }
`;

const FormActionRow = styled.div`
  margin: 20px 0 0 0;
`;

const Button = styled.button`
  cursor: pointer;

  display: flex;
  align-items: center;
  padding: 10px 20px;
  font-size: 14px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  ${mobile({ fontSize: "12px", padding: "12px" })}
`;

const ContainerLabel = styled.h4`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: left;
  padding-bottom: 10px;
`;

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [loadingAcct, setLoadingAcct] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [state, updateState] = useReducer(
    (state, newState) => {
      const updatedState = { ...state, ...newState };
      // validate form
      if (updatedState.accountType === "MOMO") {
        if (
          updatedState.accountName !== "" &&
          updatedState.networkName !== "" &&
          updatedState.accountNumber !== ""
        ) {
          updatedState.isSettlementAccountFormValid = true;
        } else {
          updatedState.isSettlementAccountFormValid = false;
        }
      } else if (updatedState.accountType === "BANK") {
        if (
          updatedState.accountName !== "" &&
          updatedState.accountNumber !== ""
        ) {
          updatedState.isSettlementAccountFormValid = true;
        } else {
          updatedState.isSettlementAccountFormValid = false;
        }
      }
      return updatedState;
    },
    {
      settlementAcct: {},
      networkName: "",
      walletName: "",
      accountName: "",
      bankName: "",
      accountType: "",
      accountNumber: "",
      isSettlementAccountFormValid: false,
    }
  );
  const username = useRef();
  const profileUser = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const currentPassword = useRef();
  const newPassword = useRef();
  const newPassword2 = useRef();
  const user_email_ref = useRef();
  const [isLoadingSettlementAccount, setIsLoadingSettlementAccount] =
    useState(false);
  if (typeof window !== "undefined") {
    var user_email = JSON.parse(localStorage.getItem("currentUser"))?.email;
    var user_phoneNumber = JSON.parse(
      localStorage.getItem("currentUser")
    )?.phoneNumber;
  }

  if (typeof window !== "undefined") {
    var accountVerified = JSON.parse(
      localStorage.getItem("currentUser")
    )?.accountVerified;
  }

  const saveSettlementAccount = async (e) => {
    e.preventDefault();
    setLoadingAcct(true);
    try {
      const res = await userRequest.post(`/settlementAccount`, {
        accountType: state.accountType,
        accountName: state.accountName,
        networkName: state.networkName,
        bankName: state.bankName,
        accountNumber: state.accountNumber,
        walletId: state.walletId,
      });
      if (res.status === 200) {
        topToast("success", "Updated successfully");
        setLoadingAcct(false);
      }
    } catch (error) {
      setLoadingAcct(false);
    }
  };
  const sendVerificationLink = async (e) => {
    e.preventDefault();
    setSendingVerification(true);
    try {
      const res = await userRequest.post(`/auth/verify/verificationToken`, {
        email: user_email,
      });
      if (res.status === 200) {
        topToast("success", "Verification link sent successfully");
        setSendingVerification(false);
      }
    } catch (error) {
      if (error.response.status === 400) {
        centerToast("error", "Sorry!", error.response.data.message);
        setSendingVerification(false);
      }
      setSendingVerification(false);
    }
  };

  const changeUsername = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userRequest.post(`user/username`, {
        username: username.current.value,
      });
      if (res.status === 200) {
        if (getCookie("nokofio_user")) {
          const user = JSON.parse(getCookie("nokofio_user"));
          user.username = username.current.value;
          setCookie("nokofio_user", JSON.stringify(user));
        }
        getProfile();
        topToast("success", "Updated successfully");
        setLoading(false);
      }
    } catch (error) {
      if (error.response.status === 400) {
        centerToast("error", "Sorry", error.response.data.message);
      }
      setLoading(false);
    }
  };

  const getProfile = async () => {
    try {
      const res = await publicRequest.get(
        `/user/me?username=${username.current.value}`
      );
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
      }
      if (error.response.status === 404) {
      }
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);
    if (newPassword.current.value !== newPassword2.current.value) {
      topToast("error", "Passwords do not match");
      setLoadingPassword(false);
      return;
    } else {
      try {
        const res = await userRequest.post(`auth/changePassword`, {
          password: currentPassword.current.value,
          newPassword: newPassword.current.value,
        });
        if (res.status === 200) {
          topToast("success", "Updated successfully");
          setLoadingPassword(false);
        }
      } catch (error) {
        setLoadingPassword(false);
        if (error.response.status === 401) {
          logoutUser();
        } else if (error.response.status === 400) {
          topToast("error", `${error.response.data.message}`);
        } else {
          topToast("error", "Something went wrong");
        }
      }
    }
  };

  useEffect(() => {
    const getSettlementAccount = async () => {
      setIsLoadingSettlementAccount(true);
      try {
        const getSettlementAccountRes = await userRequest.get(
          `/settlementAccount`
        );
        if (
          getSettlementAccountRes.status === 200 &&
          getSettlementAccountRes.data.results.data.accountType
        ) {
          let data = getSettlementAccountRes.data.results.data;
          updateState({
            accountType: data.accountType,
            accountName: data.accountName,
            networkName: data.networkName,
            bankName: data.bankName,
            accountNumber: data.accountNumber,
            walletId: data.walletId,
          });
          setIsLoadingSettlementAccount(false);
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          logoutUser();
        }
      } finally {
        setIsLoadingSettlementAccount(false);
      }
    };

    getSettlementAccount();
  }, []);

  return (
    <Container>
      <Grid container>
        <Grid item xs={12}>
          <BackNavTitle title={"Settings"} />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Form
            onSubmit={saveSettlementAccount}
            style={{ position: "relative" }}
          >
            {isLoadingSettlementAccount ? <RelativeInnerLoader /> : null}
            <ContainerLabel>Settlement Account</ContainerLabel>
            <FormContainer>
              <FormRow>
                <Label>Wallet Type</Label>
                <SelectContainer className="select-container">
                  <FormSelect
                    value={state.accountType}
                    onChange={(e) =>
                      updateState({ accountType: e.target.value })
                    }
                    required
                  >
                    <FormOption value={""}>Choose Wallet Type</FormOption>
                    <FormOption value={"ECEDI"}>eCedi</FormOption>
                    <FormOption value={"MOMO"}>Mobile Money</FormOption>
                    <FormOption value={"BANK"}>Bank Account</FormOption>
                  </FormSelect>
                </SelectContainer>
              </FormRow>
              {state?.accountType === "MOMO" ? (
                <FormRow>
                  <Label>Wallet Provider</Label>
                  <SelectContainer>
                    <FormSelect
                      value={state.networkName}
                      onChange={(e) =>
                        updateState({ networkName: e.target.value })
                      }
                    >
                      <FormOption value={""}>Choose Mobile Network</FormOption>
                      <FormOption value={"MTN"}>MTN</FormOption>
                      <FormOption value={"VODA"}>Vodafone</FormOption>
                      <FormOption value={"TIGO"}>AirtelTigo</FormOption>
                    </FormSelect>
                  </SelectContainer>
                </FormRow>
              ) : null}
              {state?.accountType === "BANK" ? (
                <FormRow>
                  <Label>BANK NAME</Label>
                  <Input
                    defaultValue={state?.bankName}
                    onChange={(e) => updateState({ bankName: e.target.value })}
                    placeholder="Enter Bank Name"
                    pattern="[0-9]*"
                    type="text"
                    required
                  />
                </FormRow>
              ) : null}
              {state?.accountType !== "ECEDI" ? (
                <>
                  <FormRow>
                    <Label>Account Number</Label>
                    <Input
                      defaultValue={state?.accountNumber}
                      onChange={(e) =>
                        updateState({ accountNumber: e.target.value })
                      }
                      placeholder="Enter Number"
                      pattern="[0-9]*"
                      type="text"
                      required
                    />
                  </FormRow>
                  <FormRow>
                    <Label>Account Name</Label>
                    <Input
                      defaultValue={state?.accountName}
                      placeholder="Enter Account  Name"
                      type="text"
                      onChange={(e) =>
                        updateState({ accountName: e.target.value })
                      }
                      required
                    />
                  </FormRow>
                </>
              ) : (
                <>
                  <FormRow>
                    <Label>Wallet ID</Label>
                    <Input
                      defaultValue={state?.walletId}
                      placeholder="Enter Wallet ID"
                      type="text"
                      onChange={(e) =>
                        updateState({ walletId: e.target.value })
                      }
                      required
                    />
                  </FormRow>
                </>
              )}
              <FormActionRow>
                <Button
                  type="submit"
                  disabled={loadingAcct || !state.isSettlementAccountFormValid}
                >
                  <Typography>Submit</Typography> &nbsp;
                  {loadingAcct && (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  )}
                </Button>
              </FormActionRow>
            </FormContainer>
          </Form>
        </Grid>
        <Grid item xs={12} md={6}>
          <Form onSubmit={changePassword}>
            <ContainerLabel>Change Password</ContainerLabel>
            <FormContainer>
              <FormRow>
                <Label>Current Password</Label>
                <Input
                  ref={currentPassword}
                  required
                  placeholder="Enter Current Password"
                />
              </FormRow>
              <FormRow>
                <Label>New Password</Label>
                <Input
                  ref={newPassword}
                  minLength={6}
                  required
                  placeholder="Enter New Password"
                />
              </FormRow>
              <FormRow>
                <Label>Repeat New Password</Label>
                <Input
                  ref={newPassword2}
                  minLength={6}
                  required
                  placeholder="Enter New Password"
                />
              </FormRow>
              <FormActionRow>
                <Button type="submit" disabled={loadingPassword}>
                  <Typography>Submit</Typography> &nbsp;
                  {loadingPassword && (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  )}
                </Button>{" "}
              </FormActionRow>
            </FormContainer>
          </Form>
        </Grid>
        <Grid item xs={12} md={6}>
          <Form onSubmit={changeUsername}>
            <Box display={"flex"} gap={1}>
              <ContainerLabel>Account</ContainerLabel>
              <Label>
                (You can change username, to change email or phone number
                contact support)
              </Label>
            </Box>
            <FormContainer>
              <FormRow>
                <Label>Username</Label>
                <Input
                  ref={username}
                  maxLength={20}
                  defaultValue={profileUser?.username}
                  placeholder="Enter New Username"
                />
              </FormRow>
              <FormRow>
                <Label>Email</Label>
                <Input
                  disabled
                  maxLength={20}
                  defaultValue={user_email}
                  placeholder="email"
                />
              </FormRow>
              <FormRow>
                <Label>Phone Number</Label>
                <Input
                  disabled
                  maxLength={20}
                  defaultValue={profileUser?.user_phoneNumber}
                  placeholder="phone number"
                />
              </FormRow>

              <FormActionRow>
                <Button type="submit" disabled={loading}>
                  <Typography>Submit</Typography> &nbsp;
                  {loading && (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  )}
                </Button>{" "}
              </FormActionRow>
            </FormContainer>
          </Form>
        </Grid>
        {!accountVerified ? (
          <Grid item xs={12} md={6} id="verify_email">
            <Form onSubmit={sendVerificationLink}>
              <ContainerLabel>Verify Email</ContainerLabel>
              <FormContainer>
                <FormRow>
                  <Label>Email</Label>
                  <Input
                    ref={user_email_ref}
                    defaultValue={user_email}
                    placeholder="Email Address"
                    readOnly
                  />
                </FormRow>

                <FormActionRow>
                  <Button type="submit" disabled={loading}>
                    <Typography>Send Link</Typography> &nbsp;
                    {sendingVerification && (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    )}
                  </Button>{" "}
                </FormActionRow>
              </FormContainer>
            </Form>
          </Grid>
        ) : null}
      </Grid>
    </Container>
  );
};

export default Settings;

Settings.getLayout = function getLayout(page) {
  return (
    <Layout>
      <AuthLayout>{page}</AuthLayout>{" "}
    </Layout>
  );
};
