import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";
import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useReducer } from "react";
import { userRequest } from "../requestMethods";
import { getSettlementAccount } from "../services/settlementAccountService";
import { Btn, ModalContainer } from "../StyledComponents/common";
import { centerToast, topToast } from "../toast";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import { Cancel } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import Moment from "react-moment";
import { orange } from "@mui/material/colors";

const columns = [
  {
    field: "senderName",
    headerName: "Sender Name",
    width: 190,
    renderCell: (params) => (
      <Typography textTransform={"capitalize"} variant="body2">
        {params.row.senderName || "Anonymous"}
      </Typography>
    ),
  },
  {
    field: "amount",
    headerName: "Amount",
    width: 150,
  },
  {
    field: "note",
    headerName: "Comment",
    width: 230,
  },
];

const ShowAllContributorsModal = ({ contributors }) => {
  const [state, updateState] = useReducer(
    (state, newState) => {
      const updatedState = { ...state, ...newState };

      return updatedState;
    },
    {
      open: false,
      hideBackdrop: false,
      disableEscapeKeyDown: false,
      disablePortal: false,
      modalSize: "",
      modalTitle: "All Contributors",
      modalSubtitle: "",
    }
  );

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
                    <Typography variant="h6">{state.modalTitle}</Typography>
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
                    rows={contributors}
                    columns={columns}
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
        variant="text"
        sx={{ textTransform: "capitalize", color: "#0466C8" }}
        onClick={() => updateState({ open: true })}
      >
        See all contributors
      </Button>
    </>
  );
};

export default ShowAllContributorsModal;
