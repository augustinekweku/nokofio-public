import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  Modal,
  OutlinedInput,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import { ApiErrorParser, formatCurrency } from "../helpers";
import { userRequest } from "../requestMethods";
import { getSettlementAccount } from "../services/settlementAccountService";
import { Btn, ModalContainer } from "../StyledComponents/common";
import { centerToast, topToast } from "../toast";
import CloseIcon from "@mui/icons-material/Close";

const STEPS = {
  ENTER_DETAILS: "Enter details",
  CONFIRM_DETAILS: "Confirm details",
  WITHDRAWAL_STATUS: "Check status",
};

const PERCENTAGE_FEE = 0.01; // 1% fee

const WithdrawalRequestModal = ({ id, totalBalanceLeft }) => {
  const [modalState, updateModalState] = useReducer(
    (state, newState) => {
      const updatedState = { ...state, ...newState };
      if (
        updatedState.requestAmount === "" ||
        updatedState.requestAmount == 0 ||
        !updatedState.accountName
      ) {
        updatedState.isFormValid = false;
      } else {
        updatedState.isFormValid = true;
      }
      return updatedState;
    },
    {
      open: false,
      hideBackdrop: false,
      disableEscapeKeyDown: false,
      accountName: "",
      accountNumber: "",
      requestAmount: "",
      disablePortal: false,
      modalSize: "",
      modalTitle: "Withdraw Funds",
      modalSubtitle: "Enter amount you want to withdraw",
      step: STEPS.ENTER_DETAILS,
      isFormValid: false,
      requestLoading: false,
      totalBalance: 0,
      isLoadingTotalBalance: false,
      errorMsg: "",
      loadingAccountDetails: false,
    }
  );

  useEffect(() => {
    if (!modalState.open) return;
    const getSettlementAcct = async () => {
      try {
        updateModalState({ loadingAccountDetails: true });
        const res = await getSettlementAccount();
        if (res.code === 200) {
          updateModalState({
            accountName: res.results.data.accountName,
            accountNumber: res.results.data.accountNumber,
          });
        }
      } catch (error) {
        topToast("error", ApiErrorParser(error));
      } finally {
        updateModalState({ loadingAccountDetails: false });
      }
    };
    getSettlementAcct();
  }, [modalState.accountName, modalState.accountNumber, modalState.open]);

  const makeWithdrawalRes = async () => {
    if (
      parseFloat(modalState.requestAmount) > parseFloat(modalState.totalBalance)
    ) {
      centerToast("error", "Sorry", "Insufficient funds");
      return;
    }
    updateModalState({ requestLoading: true });
    try {
      const res = await userRequest.post(`transactions/withdrawal-requests`, {
        amount: (
          parseFloat(modalState?.requestAmount) -
          parseFloat(modalState?.requestAmount) * PERCENTAGE_FEE
        ).toFixed(2),
        id,
      });
      if (res.status === 200) {
        updateModalState({
          step: STEPS.WITHDRAWAL_STATUS,
          modalTitle: "Withdrawal Status",
          modalSubtitle: "Your withdrawal request has been received",
          requestLoading: false,
        });
        topToast("success", res.data.message);
        //reload current page
        setTimeout(() => {
          location.reload();
        }, 5000);
      }
    } catch (error) {
      initState();
      centerToast(
        "error",
        error.response.data?.message,
        error.response.data?.errors
      );
    } finally {
      updateModalState({ requestLoading: false });
    }
  };

  useEffect(() => {
    if (!modalState.open) return;
    updateModalState({ totalBalance: totalBalanceLeft });
  }, [modalState.open]);

  const initState = () => {
    updateModalState({
      open: false,
      hideBackdrop: false,
      disableEscapeKeyDown: false,
      requestAmount: "",
      disablePortal: false,
      modalSize: "",
      modalTitle: "Withdraw Funds",
      modalSubtitle: "Enter amount you want to withdraw",
      step: STEPS.ENTER_DETAILS,
      isFormValid: false,
      requestLoading: false,
      errorMsg: "",
      errorAlert: false,
    });
  };

  useEffect(() => {
    if (!modalState.open) return;
    updateModalState({
      open: true,
      hideBackdrop: false,
      disableEscapeKeyDown: false,
      disablePortal: false,
      modalTitle: "Withdraw Funds",
      modalSubtitle: "Enter amount you want to withdraw",
      step: STEPS.ENTER_DETAILS,
      isFormValid: false,
      requestLoading: false,
      errorMsg: "",
      errorAlert: false,
      requestAmount: "",
    });
  }, [modalState.open]);

  return (
    <>
      <Modal
        open={modalState.open}
        hideBackdrop={modalState.hideBackdrop}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
        keepMounted={true}
        // onClose={() => updateModalState({ open: false })}
      >
        <ModalContainer
          style={{ padding: "0" }}
          size={modalState.modalSize}
          className="modal"
        >
          <div>
            <Box p={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <div></div>
                <div>
                  {modalState.modalTitle !== "" ? (
                    <Typography variant="h6" fontWeight={"bold"}>
                      {modalState.modalTitle}
                    </Typography>
                  ) : null}
                </div>
                <div
                  onClick={() => {
                    initState();
                  }}
                  className="pointer"
                >
                  <Close />
                </div>
              </Box>
              {modalState.modalSubtitle !== "" ? (
                <Typography
                  color={"GrayText"}
                  textAlign={"center"}
                  variant="subtitle1"
                >
                  {modalState.modalSubtitle}
                </Typography>
              ) : null}
            </Box>

            {!modalState.accountNumber && !modalState.loadingAccountDetails ? (
              <Typography
                color={"red"}
                textAlign={"center"}
                variant="subtitle1"
              >
                Please set up your{" "}
                <Link
                  style={{
                    color: "#3f51b5 !important",
                  }}
                  href={"/settings"}
                >
                  Settlement account
                </Link>{" "}
                to withdraw funds
              </Typography>
            ) : null}

            {modalState.step === STEPS.ENTER_DETAILS ? (
              <Box p={4}>
                <Typography variant="subtitle1" mb={2}>
                  Available Balance:{" "}
                  {modalState.isLoadingTotalBalance ? (
                    <CircularProgress size={20} />
                  ) : (
                    <span
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      {modalState.totalBalance
                        ? formatCurrency(modalState.totalBalance)
                        : "0.00"}
                    </span>
                  )}
                </Typography>
                {modalState.errorMsg ? (
                  <Collapse in={modalState.errorAlert}>
                    <Alert
                      severity="error"
                      action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            updateModalState({ errorAlert: false });
                          }}
                        >
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      }
                      sx={{ mb: 2 }}
                    >
                      {modalState.errorMsg}
                    </Alert>
                  </Collapse>
                ) : null}

                <FormControl sx={{ mb: 2, width: "100%" }} variant="outlined">
                  <Typography variant="caption" mb={0.5}>
                    Account Name
                  </Typography>
                  <OutlinedInput
                    size="small"
                    disabled
                    // sx={{width: "100%"}}
                    value={modalState.accountName}
                    id="outlined-adornment-weight"
                    endAdornment={
                      <InputAdornment position="end">
                        <LockOutlined />
                      </InputAdornment>
                    }
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      "aria-label": "weight",
                    }}
                  />
                </FormControl>
                <FormControl sx={{ mb: 2, width: "100%" }} variant="outlined">
                  <Typography variant="caption" mb={0.5}>
                    Account Number
                  </Typography>
                  <OutlinedInput
                    size="small"
                    disabled
                    value={modalState?.accountNumber}
                    // sx={{width: "100%"}}
                    id="outlined-adornment-weight"
                    endAdornment={
                      <InputAdornment position="end">
                        <LockOutlined />
                      </InputAdornment>
                    }
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      "aria-label": "weight",
                    }}
                  />
                </FormControl>
                <FormControl sx={{ mb: 2, width: "100%" }} variant="outlined">
                  <Typography variant="caption" mb={0.5}>
                    Enter Request Amount
                  </Typography>
                  <OutlinedInput
                    size="small"
                    // sx={{width: "100%"}}
                    type="number"
                    id="outlined-adornment-weight"
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    value={modalState.requestAmount}
                    onChange={(e) => {
                      updateModalState({
                        requestAmount: parseFloat(e.target.value),
                      });
                    }}
                  />
                </FormControl>
                <Button
                  variant="contained"
                  sx={{ mt: 3, py: 1.5, textTransform: "capitalize" }}
                  fullWidth
                  disabled={!modalState.isFormValid}
                  onClick={() => {
                    if (modalState.requestAmount > modalState.totalBalance) {
                      updateModalState({
                        errorMsg: "Insufficient balance",
                        errorAlert: true,
                      });
                      return;
                    }
                    updateModalState({ step: STEPS.CONFIRM_DETAILS });
                  }}
                >
                  Request Funds
                </Button>
              </Box>
            ) : null}

            {modalState.step === STEPS.CONFIRM_DETAILS ? (
              <>
                <Divider sx={{ width: "100%" }} />
                <Box px={3} py={2}>
                  <Box mb={2} display={"flex"} justifyContent={"space-between"}>
                    <Box lineHeight={0.5}>
                      <Typography variant="body2" color={"GrayText"}>
                        Account Details
                      </Typography>
                    </Box>
                    <Box lineHeight={0.1} textAlign="end">
                      <Typography variant="body2" fontWeight={"semi-bold"}>
                        {modalState?.accountName}
                      </Typography>{" "}
                      <br />
                      <Typography variant="body2" color={"GrayText"}>
                        {modalState?.accountNumber}
                      </Typography>
                    </Box>
                  </Box>
                  <Box mb={2} display={"flex"} justifyContent={"space-between"}>
                    <Box lineHeight={0.5}>
                      <Typography variant="body2" color={"GrayText"}>
                        Request Amount
                      </Typography>
                    </Box>
                    <Box lineHeight={0.1}>
                      <Typography variant="body2" fontWeight={"semi-bold"}>
                        GHS {modalState?.requestAmount}
                      </Typography>{" "}
                    </Box>
                  </Box>
                  <Box mb={2} display={"flex"} justifyContent={"space-between"}>
                    <Box lineHeight={0.5}>
                      <Typography variant="body2" color={"GrayText"}>
                        Fees ({PERCENTAGE_FEE * 100}%)
                      </Typography>
                    </Box>
                    <Box lineHeight={0.1}>
                      <Typography variant="body2" fontWeight={"semi-bold"}>
                        GHS {modalState?.requestAmount * PERCENTAGE_FEE}
                      </Typography>{" "}
                    </Box>
                  </Box>
                  <Divider />
                  <Box my={2} display={"flex"} justifyContent={"space-between"}>
                    <Box lineHeight={0.5}>
                      <Typography variant="body2" color={"GrayText"}>
                        Total
                      </Typography>
                    </Box>
                    <Box lineHeight={0.1}>
                      <Typography variant="body2" fontWeight={"semibold"}>
                        GHS{" "}
                        {(
                          modalState?.requestAmount -
                          modalState?.requestAmount * PERCENTAGE_FEE
                        ).toFixed(2)}
                      </Typography>{" "}
                    </Box>
                  </Box>

                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    gap={2}
                    mt={4}
                  >
                    <Button
                      variant="outlined"
                      sx={{ textTransform: "capitalize", px: 7 }}
                      onClick={() => {
                        initState();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ textTransform: "capitalize", px: 7 }}
                      onClick={() => {
                        makeWithdrawalRes();
                      }}
                    >
                      Confirm &nbsp;
                      {modalState.requestLoading ? (
                        <CircularProgress sx={{ color: "white" }} size={20} />
                      ) : null}
                    </Button>
                  </Box>
                </Box>
              </>
            ) : null}
            {modalState.step === STEPS.WITHDRAWAL_STATUS ? (
              <>
                <Box p={4}>
                  <Box textAlign={"center"} pb={5}>
                    <img
                      src="/images/svg/success.svg"
                      alt=""
                      width="100"
                      height="100"
                    />
                    <Typography variant="h6" fontWeight={""} mb={1}>
                      Withdrawal Request Successful
                    </Typography>
                    <Typography variant="body2" color={"GrayText"}>
                      It will take 24 hours for your request to be processed.
                      Thank you
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    sx={{ py: 2, mt: 2, width: "100%" }}
                    onClick={() => {
                      initState();
                    }}
                  >
                    Done
                  </Button>
                </Box>
              </>
            ) : null}
          </div>
        </ModalContainer>
      </Modal>

      <Button
        fullWidth
        onClick={() => updateModalState({ open: true })}
        variant={"contained"}
        sx={{
          textTransform: "capitalize",
          fontWeight: "bold",
          width: {
            xs: "100%",
            md: "auto",
          },
        }}
      >
        Withdraw Funds
      </Button>
    </>
  );
};

export default WithdrawalRequestModal;
