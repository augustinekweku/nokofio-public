import { Close } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { FormContainer, ModalContainer } from "../../StyledComponents/common";
import styled from "styled-components";
import { useReducer } from "react";
import { mobile } from "../../responsive";

import { centerToast, topToast } from "../../toast";
import {
  testUserRequest,
  userRequest,
  userRequestV2,
} from "../../requestMethods";
import { ApiErrorParser, logoutUserAndRedirect } from "../../helpers";
import { useEffect } from "react";
import { PAYMENT_TYPES } from "../../helpers/constants";

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

const PaymentLink = ({
  paymentType,
  open,
  editObject,
  onDismiss,
  onSuccess,
}) => {
  const [state, updateState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      title: editObject?.title || "",
      sectionText: editObject?.sectionText || "",
      description: "",
      amount1: "",
      amount2: "",
      donationTarget: "",
      donationDeadline: "",
      showTarget: false,
      showContributors: false,
      isLoading: false,
      modalSize: "lg",
      modalTitle: `Add ${
        paymentType == PAYMENT_TYPES.donation ? "Donation" : "Payment"
      } Link`,
      modalSubtitle: "",
      allowCustomAmount: editObject?.allowCustomAmount || false,
      allowAnonymous: editObject?.allowAnonymous || false,
      acceptEcedi: editObject?.acceptEcedi || false,
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    if (
      paymentType == PAYMENT_TYPES.donation &&
      (parseFloat(state.amount1) > parseFloat(state.donationTarget) ||
        parseFloat(state.amount2) > parseFloat(state.donationTarget))
    ) {
      alert("Donation amount is higher than donation target");
      return;
    }
    updateState({ isLoading: true });

    const donationObject =
      paymentType == PAYMENT_TYPES.donation
        ? {
            title: state.title,
            description: state.description,
            amount1: parseFloat(state.amount1),
            amount2: parseFloat(state.amount2),
            targetAmount: parseFloat(state.donationTarget),
            makeTargetAmountPublic: state.showTarget,
            showContributors: state.showContributors,
            allowCustomAmount: state.allowCustomAmount,
            allowAnonymous: state.allowAnonymous,
            acceptEcedi: state.acceptEcedi,
          }
        : {
            title: state.title,
            sectionText: state.sectionText,
            description: state.description,
            amount1: parseFloat(state.amount1),
            amount2: parseFloat(state.amount2),
            showContributors: state.showContributors,
            allowCustomAmount: state.allowCustomAmount,
            allowAnonymous: state.allowAnonymous,
            acceptEcedi: state.acceptEcedi,
          };

    if (paymentType == PAYMENT_TYPES.donation) {
      editObject?.id ? (donationObject["donationId"] = editObject?.id) : null;
    } else {
      editObject?.id
        ? (donationObject["supportMeAmountId"] = editObject?.id)
        : null;
    }
    try {
      const res =
        paymentType == PAYMENT_TYPES.donation
          ? await userRequestV2.post(`/sections/donation`, donationObject)
          : await userRequestV2.post(
              `/sections/supportMeAmount`,
              donationObject
            );
      if (res.status === 200) {
        topToast("success", res.data.message || "Success");
        updateState({ isLoading: false });
        // router.push("/builder");
      }
      initState();
      onSuccess(paymentType);
    } catch (error) {
      topToast("error", ApiErrorParser(error));
      if (error?.response?.status === 401) {
        logoutUserAndRedirect();
      }
      updateState({ isLoading: false });
    }
  };

  const handleTargetChange = (e) => {
    updateState({ showTarget: e.target.checked });
  };

  const handleContributorsChange = (e) => {
    updateState({ showContributors: e.target.checked });
  };

  const handleAllowCustomAmountChange = (e) => {
    updateState({ allowCustomAmount: e.target.checked });
  };

  const handleAllowAnonymousChange = (e) => {
    updateState({ allowAnonymous: e.target.checked });
  };

  const handleAcceptEcediChange = (e) => {
    updateState({ acceptEcedi: e.target.checked });
  };

  useEffect(() => {
    if (editObject && open) {
      updateState({
        title: editObject?.title || "",
        sectionText: editObject?.sectionText || "",
        description: editObject?.description || "",
        amount1: editObject?.amount1 || "",
        amount2: editObject?.amount2 || "",
        donationTarget: parseFloat(editObject?.targetAmount) || 0.0,
        showTarget: !!editObject?.makeTargetAmountPublic,
        showContributors: !!editObject?.showContributors,
        allowAnonymous: !!editObject?.allowAnonymous,
        acceptEcedi: !!editObject?.acceptEcedi,
        allowCustomAmount: !!editObject?.allowCustomAmount,
        modalSize: "lg",
        modalTitle: "Update Payment Link",
        modalSubtitle: "",
      });
    }
    if (!editObject && open) {
      initState();
    }
  }, [open]);

  function initState() {
    updateState({
      title: "",
      sectionText: "",
      description: "",
      amount1: "",
      amount2: "",
      donationTarget: "",
      showTarget: false,
      showContributors: false,
      acceptEcedi: false,
      allowAnonymous: true,
      allowCustomAmount: true,
      isLoading: false,
      modalSize: "lg",
      modalTitle: `Add ${
        paymentType == PAYMENT_TYPES.donation ? "Donation" : "Payment"
      } Link`,
      modalSubtitle: "",
    });
  }

  return (
    <>
      <Modal
        open={open}
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
              <Box px={3} pb={5}>
                <Form onSubmit={handleClick}>
                  <Box>
                    <FormRow>
                      <Label>Title</Label>
                      <Input
                        required
                        maxLength={100}
                        value={state.title}
                        placeholder="Enter a heartwarming title for this donation"
                        onChange={(e) => {
                          updateState({
                            title: e.target.value,
                            sectionText: e.target.value,
                          });
                        }}
                      />
                      {paymentType == PAYMENT_TYPES.accept_payment ? (
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            mb: 2,
                            mt: -1,
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            overflowX: "scroll",
                            pb: 1,
                          }}
                        >
                          <Label style={{ marginBottom: 0 }}>Suggested:</Label>
                          <Chip
                            label="Tip Me"
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              updateState({
                                title: "Tip Me",
                                sectionText: "Tip Me",
                              });
                            }}
                          />
                          <Chip
                            label="Support My Content"
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              updateState({
                                title: "Support My Content",
                                sectionText: "Support My Content",
                              });
                            }}
                          />
                          <Chip
                            label="Group Contributions"
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              updateState({
                                title: "Group Contributions",
                                sectionText: "Group Contributions",
                              });
                            }}
                          />
                        </Stack>
                      ) : null}
                    </FormRow>
                    <FormRow>
                      <Label>Donation Description</Label>
                      <InputTextarea
                        required
                        value={state?.description}
                        onChange={(e) => {
                          updateState({ description: e.target.value });
                        }}
                        maxLength={200}
                        placeholder="Describe the situation and give succint reason why we people should donate"
                      />
                    </FormRow>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <FormRow>
                          <Label>Suggested amount(1)</Label>
                          <Input
                            required
                            value={state?.amount1}
                            onChange={(e) => {
                              updateState({ amount1: e.target.value });
                            }}
                            pattern="[0-9]*"
                            type="number"
                            max={5000}
                            placeholder="Enter first amount"
                          />
                        </FormRow>
                      </Grid>
                      <Grid item xs={6}>
                        <FormRow>
                          <Label>Suggested amount(2)</Label>
                          <Input
                            required
                            value={state?.amount2}
                            pattern="[0-9]*"
                            type="number"
                            onChange={(e) => {
                              updateState({ amount2: e.target.value });
                            }}
                            max={5000}
                            placeholder="Enter second amount"
                          />
                        </FormRow>
                      </Grid>
                      {paymentType == PAYMENT_TYPES.donation ? (
                        <Grid item xs={6}>
                          <FormRow>
                            <Label>Donation Target</Label>
                            <Input
                              style={{ marginBottom: "5px" }}
                              value={state?.donationTarget}
                              pattern="[0-9]*"
                              onChange={(e) => {
                                updateState({ donationTarget: e.target.value });
                              }}
                              type="number"
                              placeholder="Enter donation target"
                            />
                          </FormRow>
                        </Grid>
                      ) : null}
                    </Grid>
                    {paymentType == PAYMENT_TYPES.donation ? (
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
                              checked={state.showTarget}
                              onChange={(e) => handleTargetChange(e)}
                            />
                          }
                          label="Set Donation Target Public"
                        />
                      </FormRow>
                    ) : null}
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
                            checked={state.showContributors}
                            onChange={(e) => handleContributorsChange(e)}
                          />
                        }
                        label="Show Contributors"
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
                            checked={state.allowCustomAmount}
                            onChange={(e) => handleAllowCustomAmountChange(e)}
                          />
                        }
                        label="Enable Custom Amount Field"
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
                            checked={state.allowAnonymous}
                            onChange={(e) => handleAllowAnonymousChange(e)}
                          />
                        }
                        label="Enable Anonymous Giving"
                      />
                    </FormRow>
                    <FormActionRow>
                      <Button disabled={state.isLoading}>
                        <Typography>Submit</Typography> &nbsp;
                        {state.isLoading && (
                          <CircularProgress size={20} sx={{ color: "white" }} />
                        )}
                      </Button>
                    </FormActionRow>
                  </Box>
                </Form>
              </Box>
            </Box>
          </div>
        </ModalContainer>
      </Modal>
    </>
  );
};

export default PaymentLink;
