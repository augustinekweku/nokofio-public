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
  Box,
  Button,
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
import { Add, Delete, Edit } from "@mui/icons-material";
import { useReducer } from "react";
import DonationLinkDetails from "../../components/modals/PaymentLink";
import UserServices from "../../services/UserServices";
import { PAYMENT_TYPES } from "../../helpers/constants";
import PaymentLink from "../../components/modals/PaymentLink";
import { ShimmerThumbnail } from "react-shimmer-effects";
import donationServices from "../../services/donationServices";
import { ApiErrorParser } from "../../helpers";
import Swal from "sweetalert2";

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

export const AddLink = styled.div`
  border: 1px dashed #979797;
  padding: 14px 0px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 10px;
`;

const DonationLinksPage = () => {
  const [state, updateState] = useReducer(
    (state, newState) => {
      return { ...state, ...newState };
    },
    {
      openDonationLinkDetails: false,
      editObject: null,
      isLoading: false,
      paymentLinks: null,
      deleteLoading: false,
      deletingIndex: null,
    }
  );

  if (typeof window !== "undefined") {
    var userProfile = JSON.parse(localStorage.getItem("nokofioProfileData"));
  }

  async function getProfile() {
    if (userProfile?.username) {
      updateState({ isLoading: true });
      const res = await UserServices.getUserProfile(userProfile?.username);
      if (res.data.results.data) {
        updateState({
          isLoading: false,
          paymentLinks: res.data.results.data.donations,
        });
      }
    }
  }
  async function deletePaymentLink(id, title) {
    Swal.fire({
      title: "Are you sure you want to delete this link?",
      text: `"${title}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-secondary ms-1",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deletePaymentLinkConfirmed(id);
      } else {
        updateState({ deletingIndex: null });
      }
    });
  }

  async function deletePaymentLinkConfirmed(id) {
    try {
      updateState({ deleteLoading: true });
      const res = await donationServices.deleteDonationLink(id);
      updateState({ deleteLoading: false, deletingIndex: null });
      getProfile();
      topToast("success", "Payment link deleted successfully");
    } catch (error) {
      topToast("error", ApiErrorParser(error));
    } finally {
      updateState({ deleteLoading: false, deletingIndex: null });
    }
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Container className="animate__animated animate__fadeIn">
      <PaymentLink
        paymentType={PAYMENT_TYPES.donation}
        open={state.openDonationLinkDetails}
        onDismiss={() =>
          updateState({ openDonationLinkDetails: false, editObject: null })
        }
        onSuccess={() => {
          updateState({ openDonationLinkDetails: false, editObject: null });
          getProfile();
        }}
        editObject={state.editObject}
      />
      <MainRow>
        <MainLeft>
          <UserShare />
          <InnerLeft>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={2}
              mb={3}
            >
              <Box flexGrow={1}>
                <BackNavTitle title={"Donation Links"} />
              </Box>
              <Button
                onClick={() => {
                  updateState({ openDonationLinkDetails: true });
                }}
                variant={"outlined"}
                endIcon={<Add />}
              >
                Add
              </Button>
            </Box>
            <Box>
              {state.isLoading ? (
                <>
                  <ShimmerThumbnail height={100} rounded />
                  <ShimmerThumbnail height={100} rounded />
                </>
              ) : (
                <>
                  {!state.paymentLinks?.length ? (
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      height={"100%"}
                      flexDirection={"column"}
                    >
                      <Typography variant={"h6"} fontWeight={"bold"}>
                        You have no donation links yet
                      </Typography>
                      <Typography variant={"subtitle1"}>
                        Create a donation link to start receiving donations
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      {state.paymentLinks?.map((donationLink, index) => (
                        <Box
                          key={index}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          mb={2}
                          backgroundColor={"#F5F5F5"}
                          p={2}
                          borderRadius={2}
                        >
                          <Box display={"flex"} alignItems={"center"}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={"/images/svg/accept-donations.svg"}
                              alt={"custom link icon"}
                              style={{
                                marginRight: "15px",
                              }}
                            />
                            <Box>
                              <Typography
                                variant={"subtitle1"}
                                fontWeight={"bold"}
                              >
                                {donationLink?.title}
                              </Typography>
                              <Typography
                                variant={"subtitle2"}
                                color={"GrayText"}
                              >
                                {donationLink?.description}
                              </Typography>
                            </Box>
                          </Box>
                          <Box display={"flex"} alignItems={"center"} gap={2}>
                            <Typography variant="p" color={"#0466c8da"}>
                              <Edit
                                fontSize="small"
                                onClick={() => {
                                  updateState({
                                    openDonationLinkDetails: true,
                                    editObject: donationLink,
                                  });
                                }}
                              />
                            </Typography>
                            <Typography variant="p" color={"#c81b04dc"}>
                              {state.deletingIndex === index &&
                              state.deleteLoading ? (
                                <CircularProgress size={20} />
                              ) : (
                                <Delete
                                  onClick={() => {
                                    updateState({
                                      deletingIndex: index,
                                    });
                                    deletePaymentLink(
                                      donationLink?.id,
                                      donationLink?.title
                                    );
                                  }}
                                  fontSize="small"
                                />
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </>
                  )}
                </>
              )}
            </Box>
          </InnerLeft>
        </MainLeft>
        <MainRight>
          <DashboardRight />
        </MainRight>
      </MainRow>
    </Container>
  );
};

export default DonationLinksPage;

DonationLinksPage.getLayout = function getLayout(page) {
  return (
    <Layout>
      <AuthLayout>{page}</AuthLayout>{" "}
    </Layout>
  );
};
