import { Close } from "@mui/icons-material";
import { Box, Modal, Typography } from "@mui/material";
import React from "react";
import { ModalContainer } from "../../StyledComponents/common";
import { useReducer } from "react";
import { PAYMENT_TYPES } from "../../helpers/constants";

const AddPaymentLink = ({ open, onSuccess, onDismiss }) => {
  const [state, updateState] = useReducer(
    (state, newState) => {
      const updatedState = { ...state, ...newState };
      if (updatedState.requestAmount > 0) {
        updatedState.isFormValid = true;
      } else {
        updatedState.isFormValid = false;
      }
      return updatedState;
    },
    {
      open: false,
      hideBackdrop: false,
      disableEscapeKeyDown: false,
      disablePortal: false,
      modalSize: "",
      modalTitle: "",
      modalSubtitle: "",
    }
  );
  return (
    <>
      <Modal
        open={open}
        hideBackdrop={state.hideBackdrop}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
        // onClose={() => updateState({ open: false })}
      >
        <ModalContainer
          style={{ padding: "0" }}
          size={state.modalSize}
          className="modal"
        >
          <div>
            <Box px={2} pt={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <div></div>
                <div>
                  {state.modalTitle !== "" ? (
                    <Typography variant="h6" fontWeight={"bold"}>
                      {state.modalTitle}
                    </Typography>
                  ) : null}
                </div>
                <div
                  onClick={() => {
                    onDismiss();
                  }}
                  className="pointer"
                >
                  <Close />
                </div>
              </Box>
              {state.modalSubtitle !== "" ? (
                <Typography
                  color={"GrayText"}
                  textAlign={"center"}
                  variant="subtitle1"
                >
                  {state.modalSubtitle}
                </Typography>
              ) : null}
            </Box>

            <Box px={3} pb={5}>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                mb={3}
                onClick={() => {
                  onSuccess("custom-link");
                }}
                style={{ cursor: "pointer" }}
              >
                <Box display={"flex"} alignItems={"center"}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={"/images/svg/custom-link.svg"}
                    alt={"custom link icon"}
                    style={{
                      marginRight: "15px",
                    }}
                  />
                  <Box>
                    <Typography variant={"subtitle1"} fontWeight={"bold"}>
                      Custom Link
                    </Typography>
                    <Typography variant={"subtitle2"}>
                      Add your own custom links
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="p" color={"#0466C8"}>
                  add
                </Typography>
              </Box>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                mb={3}
                onClick={() => {
                  onSuccess(PAYMENT_TYPES.accept_payment);
                }}
                style={{ cursor: "pointer" }}
              >
                <Box display={"flex"} alignItems={"center"}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={"/images/svg/accept-payments.svg"}
                    alt={"custom link icon"}
                    style={{
                      marginRight: "15px",
                    }}
                  />
                  <Box>
                    <Typography variant={"subtitle1"} fontWeight={"bold"}>
                      Accept Payments
                    </Typography>
                    <Typography variant={"subtitle2"}>
                      Accept payments from people & groups
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="p" color={"#0466C8"}>
                  add
                </Typography>
              </Box>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                mb={3}
                onClick={() => {
                  onSuccess(PAYMENT_TYPES.donation);
                }}
                sx={{ cursor: "pointer" }}
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
                    <Typography variant={"subtitle1"} fontWeight={"bold"}>
                      Accept Donation
                    </Typography>
                    <Typography variant={"subtitle2"}>
                      Accept donations via Momo
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="p" color={"#0466C8"}>
                  add
                </Typography>
              </Box>
              <Box
                display={"none"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Box display={"flex"} alignItems={"center"}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={"/images/svg/sell-tickets.svg"}
                    alt={"custom link icon"}
                    style={{
                      marginRight: "15px",
                    }}
                  />
                  <Box>
                    <Typography variant={"subtitle1"} fontWeight={"bold"}>
                      Sell
                    </Typography>
                    <Typography variant={"subtitle2"}>
                      Sell tickets to events and programs
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="p" color={"#0466C8"}>
                  add
                </Typography>
              </Box>
            </Box>
          </div>
        </ModalContainer>
      </Modal>
    </>
  );
};

export default AddPaymentLink;
