import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import React, { useReducer } from "react";
import { useEffect } from "react";
import { userRequest } from "../requestMethods";
import WithdrawalHistoryModal from "./WithdrawalHistoryModal";
import WithdrawalRequestModal from "./WithdrawalRequestModal";

const WithdrawalRequestCard = () => {
  const router = useRouter();
  const [state, updateState] = useReducer(
    (state, newState) => {
      return { ...state, ...newState };
    },
    {
      totalBalance: 0,
      isLoadingTotalBalance: false,
    }
  );
  useEffect(() => {
    const getTotalBalance = async () => {

      //Todo: get total balance

    };
    getTotalBalance();
  }, []);

  return (
    <>
      <Card variant="outlined" sx={{ marginBottom: "30px", p: 3 }}>
        <Grid container alignItems={"center"}>
          <Grid item xs={12} md={6}>
            <Typography variant="caption">Total Balance in GHS</Typography>
            <Typography variant="h4">
              GHS{" "}
              {state.isLoadingTotalBalance ? (
                <CircularProgress size={"small"} color="inherit" />
              ) : (
                state.totalBalance
              )}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            display={"flex"}
            sx={{ justifyContent: { md: "end" } }}
          >
            <Box
              display={"flex"}
              sx={{
                flexDirection: { xs: "column", md: "row" },
                flexGrow: { xs: 1, md: 0 },
                mt: { xs: 2 },
              }}
              gap={2}
            >
              <WithdrawalHistoryModal />
              <WithdrawalRequestModal />
            </Box>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default WithdrawalRequestCard;
