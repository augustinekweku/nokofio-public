import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";
import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useReducer } from "react";
import { userRequest } from "../requestMethods";
import { getSettlementAccount } from "../services/settlementAccountService";
import { Btn, ModalContainer } from "../StyledComponents/common";
import { centerToast, topToast } from "../toast";

import styled from "styled-components";

import { useSelector } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import { Cancel } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import Moment from "react-moment";
import { orange } from "@mui/material/colors";
import { mobile } from "../responsive";

const STEPS = {
  ENTER_DETAILS: "Enter details",
  CONFIRM_DETAILS: "Confirm details",
  WITHDRAWAL_STATUS: "Check status",
};

const columns = [
  {
    field: "amount",
    headerName: "Amount",
    width: 150,
  },
  {
    field: "created_at",
    headerName: "Date",
    width: 180,
    renderCell: (params) => (
      <Typography variant="body2">
        <Moment format="MMM DD, YYYY • h:mm A">{params.row.createdAt}</Moment>
      </Typography>
    ),
  },

  {
    field: "status",
    headerName: "Status",
    width: 150,
    renderCell: (params) =>
      params.row.status === "success" ? (
        <Box display={"flex"} alignItems={"center"}>
          <CheckCircleIcon color="success" />{" "}
          <Typography variant="p" color={"success"}>
            Success
          </Typography>
        </Box>
      ) : params.row.status === "rejected" ? (
        <Box display={"flex"} alignItems={"center"}>
          <Cancel color="error" />{" "}
          <Typography variant="p" color={"error"}>
            Rejected
          </Typography>
        </Box>
      ) : params.row.status === "pending" ? (
        <Box display={"flex"} alignItems={"center"}>
          <PendingIcon color="warning" />
          <Typography variant="p" color={orange}>
            Pending
          </Typography>
        </Box>
      ) : (
        <>{params.row.status}</>
      ),
  },
];

const WithdrawalHistoryModal = ({ id }) => {
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
      modalTitle: "Withdrawal History",
      modalSubtitle: "",
      requestLoading: false,
      loadingWithdrawalHistory: false,
      withdrawalHistory: [],
    }
  );

  useEffect(() => {
    if (state.open) {
      updateState({ loadingWithdrawalHistory: true });
      const getWithdrawals = async () => {
        try {
          const res = await userRequest.get(
            `transactions/withdrawal-requests/${id}`
          );
          if (res.status === 200) {
            updateState({
              withdrawalHistory: res?.data.results.data,
              loadingWithdrawalHistory: false,
            });
          }
        } catch (error) {
          return;
        } finally {
          updateState({ loadingWithdrawalHistory: false });
        }
      };
      getWithdrawals();
    }
  }, [state.open, id]);

  return (
    <>
      <Modal
        open={state.open}
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
            <Box p={2}>
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
                    updateState({ open: false });
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
            <Grid container>
              <Grid item xs={12}>
                <Box sx={{ height: 500, width: "100%", background: "white" }}>
                  <DataGrid
                    getRowId={(row, i) => {
                      return uuidv4();
                    }}
                    rows={state?.withdrawalHistory}
                    columns={columns}
                    loading={state.loadingWithdrawalHistory}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    disableSelectionOnClick
                  />
                </Box>
              </Grid>
            </Grid>
          </div>
        </ModalContainer>
      </Modal>

      <Button
        variant="outlined"
        sx={{
          textTransform: "capitalize",
          width: {
            xs: "100%",
            md: "auto",
          },
        }}
        onClick={() => updateState({ open: true })}
      >
        View Withdrawal History
      </Button>
    </>
  );
};

export default WithdrawalHistoryModal;
