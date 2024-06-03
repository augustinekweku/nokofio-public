import styled from "styled-components";
import { mobile, desktop } from "../../responsive";

import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import Link from "next/link";

import UserDataFilter from "../../components/UserDataFilter";
import DashboardChart from "../../components/DashboardChart";
import { useEffect, useReducer } from "react";
import digitalProductService from "../../services/digitalProductService";
import Layout from "../../components/Layout";
import AuthLayout from "../../components/AuthLayout";
import { setFullPageLoading } from "../../redux/fullPageLoadingRedux";
import dashboardServices from "../../services/dashboardServices";
import { topToast } from "../../toast";
import { ApiErrorParser } from "../../helpers";
import FullPageLoader from "../../components/FullPageLoader";
import { userRequest } from "../../requestMethods";
import WithdrawalRequestModal from "../../components/WithdrawalRequestModal";
import { useRouter } from "next/router";
import { ChevronRight } from "@mui/icons-material";
import WithdrawalHistoryModal from "../../components/WithdrawalHistoryModal";

const DashboardContainer = styled.div`
  padding: 15px 80px;
  ${mobile({ padding: "15px" })};
  background: #e8e8e8;
  height: 100vh;
  overflow-y: scroll;
`;

const Dashboard = ({ nokofio_user }) => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [state, updateState] = useReducer(
    (state, newState) => {
      return { ...state, ...newState };
    },
    {
      loading: false,
      dashboardData: null,
      totalBalance: 0,
      isLoadingTotalBalance: false,
    }
  );
  const router = useRouter();

  useEffect(() => {
    const getDashboardData = async () => {
      updateState({ loading: true });
      try {
        const { data } = await dashboardServices.getLinksData("all");
        updateState({ dashboardData: data.results.data });
        updateState({ loading: false });
      } catch (error) {
        topToast("error", ApiErrorParser(error));
      } finally {
        updateState({ loading: false });
      }
    };
    getDashboardData();
  }, []);

  useEffect(() => {
    const getTotalBalance = async () => {
      try {
        updateState({ isLoadingTotalBalance: true });
        const res = await userRequest.get("transactions/total-amount-earned");
        updateState({ totalBalance: res?.data?.results?.totalAmountEarned });

        //store in local storage
        localStorage.setItem(
          "totalBalance",
          res?.data?.results?.totalAmountEarned
        );
      } catch (error) {
        updateState({ isLoadingTotalBalance: false });
      } finally {
        updateState({ isLoadingTotalBalance: false });
      }
    };
    getTotalBalance();
  }, []);

  return (
    <Grid>
      {!state.loading ? (
        <>
          <Box
            container
            sx={{
              marginTop: {
                xs: "70px",
              },
              textAlign: "center",
            }}
          >
            {state?.isLoadingTotalBalance ? (
              <CircularProgress size={"small"} color="inherit" />
            ) : (
              <>
                <Typography variant="h4" color={"#0466C8"} fontWeight={"bold"}>
                  {" "}
                  GHS {state.totalBalance ? state.totalBalance : " 0.00"}
                </Typography>{" "}
              </>
            )}
            <Typography variant="body2">Total Balance in GHS</Typography>
          </Box>
          <Grid
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            container
            mt={3}
            px={2}
          >
            <Grid item xs={12} md={11} lg={11}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography fontWeight={"bold"}>Title</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={"bold"}>Amount </Typography>{" "}
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={"bold"}> Views</Typography>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.dashboardData?.donationSections.map(
                      (item, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            router.push(
                              `/dashboard/payment-history/${item.id}`
                            );
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {item.title}
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={"bold"}>
                              {item?.totalAmountDonated
                                ? "GHS " + item?.totalAmountDonated
                                : "0.00"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={"bold"}>
                              {item?.clicks ? "GHS" + item?.clicks : "0"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              alignItems={"center"}
                              display={"flex"}
                              fontWeight={"bold"}
                            >
                              <ChevronRight />
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                    {state.dashboardData?.supportMyContentSections.map(
                      (item, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {item.title}
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={"bold"}>
                              {item?.totalAmountGiven
                                ? "GHS " + item?.totalAmountGiven
                                : "0.00"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={"bold"}>
                              {item?.clicks ? "GHS" + item?.clicks : "0"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              alignItems={"center"}
                              display={"flex"}
                              fontWeight={"bold"}
                            >
                              <ChevronRight />
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                    {!state.dashboardData ? (
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row" colSpan={4}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "column",
                              height: "100%",
                              width: "100%",
                              fontWeight: "bold",

                              my: 2,
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/images/nokofio-not-found.svg"
                              alt="no data"
                              style={{
                                width: "80px",
                                objectFit: "contain",
                                margin: "10px 0",
                              }}
                            />
                            No Data
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <FullPageLoader />
        </>
      )}
    </Grid>
  );
};

export default Dashboard;

Dashboard.getLayout = function getLayout(page) {
  return (
    <Layout>
      <AuthLayout>{page}</AuthLayout>{" "}
    </Layout>
  );
};
