import styled from "styled-components";

import { useEffect } from "react";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";

import { Add, Delete, Edit } from "@mui/icons-material";
import { useReducer } from "react";
import { ShimmerThumbnail } from "react-shimmer-effects";
import Swal from "sweetalert2";
import UserServices from "../services/UserServices";
import supportMyContentServices from "../services/supportMyContentServices";
import PaymentLink from "./modals/PaymentLink";
import { desktop, mobile, tablet } from "../responsive";
import { PAYMENT_TYPES } from "../helpers/constants";
import { ApiErrorParser } from "../helpers";
import { topToast } from "../toast";
import { useSelector } from "react-redux";

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

export const AddLink = styled.div`
  border: 1px dashed #979797;
  padding: 14px 0px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 10px;
`;

const AcceptPaymentsLinks = ({ onSuccess }) => {
  const [state, updateState] = useReducer(
    (state, newState) => {
      return { ...state, ...newState };
    },
    {
      openPaymentLinkDetails: false,
      editObject: null,
      paymentLinks: null,
      isLoading: false,
      deleteLoading: false,
      deletingIndex: null,
    }
  );

  const userProfile = useSelector((state) => state.user.user);

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
      const res = await supportMyContentServices.deletePaymentLink(id);
      updateState({ deleteLoading: false, deletingIndex: null });
      getProfile();
      topToast("success", "Payment link deleted successfully");
    } catch (error) {
      topToast("error", ApiErrorParser(error));
    } finally {
      updateState({ deleteLoading: false, deletingIndex: null });
    }
  }

  return (
    <Box className="animate__animated animate__fadeIn">
      <PaymentLink
        paymentType={PAYMENT_TYPES.accept_payment}
        open={state.openPaymentLinkDetails}
        onDismiss={() =>
          updateState({ openPaymentLinkDetails: false, editObject: null })
        }
        onSuccess={() => {
          updateState({ openPaymentLinkDetails: false, editObject: null });
          onSuccess();
        }}
        editObject={state.editObject}
      />

      <>
        {userProfile?.supportMeAmounts?.map((donationLink, index) => (
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
                src={"/images/svg/accept-payments.svg"}
                alt={"custom link icon"}
                style={{
                  marginRight: "15px",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Box>
                <Typography variant={"subtitle1"} fontWeight={"bold"}>
                  {donationLink?.title}
                </Typography>
                <Typography variant={"subtitle2"}>
                  {donationLink?.description}
                </Typography>
              </Box>
            </Box>
            <Box display={"flex"} alignItems={"center"} gap={2}>
              <Typography variant="p" color={"#0466c8dc"}>
                <Edit
                  fontSize="small"
                  onClick={() => {
                    updateState({
                      openPaymentLinkDetails: true,
                      editObject: donationLink,
                    });
                  }}
                  sx={{ cursor: "pointer" }}
                />
              </Typography>
              <Typography variant="p" color={"#c81b04ce"}>
                {state.deletingIndex === index && state.deleteLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Delete
                    onClick={() => {
                      updateState({
                        deletingIndex: index,
                      });
                      deletePaymentLink(donationLink?.id, donationLink?.title);
                    }}
                    fontSize="small"
                    sx={{ cursor: "pointer" }}
                  />
                )}
              </Typography>
            </Box>
          </Box>
        ))}
      </>
    </Box>
  );
};

export default AcceptPaymentsLinks;
