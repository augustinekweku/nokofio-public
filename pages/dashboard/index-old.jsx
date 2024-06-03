import styled from "styled-components";
import { mobile, desktop } from "../../responsive";

import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import Link from "next/link";

import UserDataFilter from "../../components/UserDataFilter";
import DashboardChart from "../../components/DashboardChart";
import WithdrawalRequestCard from "../../components/WithdrawalRequestCard";
import { useEffect, useReducer } from "react";
import digitalProductService from "../../services/digitalProductService";
import Layout from "../../components/Layout";
import AuthLayout from "../../components/AuthLayout";
import { setFullPageLoading } from "../../redux/fullPageLoadingRedux";
import dashboardServices from "../../services/dashboardServices";

const DashboardContainer = styled.div`
  padding: 15px 80px;
  ${mobile({ padding: "15px" })};
  background: #e8e8e8;
  height: 100vh;
  overflow-y: scroll;
`;
const TextDiv = styled.div`
  font-size: 32px;
  font-weight: 600;
  line-height: 45px;
  text-transform: capitalize;
`;
const TextUsername = styled.span`
  font-size: 32px;
  font-weight: 600;
  line-height: 45px;
  text-transform: capitalize;
`;

const DateText = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  display: flex;
  align-items: center;
`;

const CardsRow = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column", alignItems: "center" })}
  ${desktop({ flexDirection: "row", alignItems: "center" })}
`;
const CardColumn = styled.div`
  margin-bottom: 16px;
  height: 100%;
`;
const CardWrapper = styled.div`
  background: #ffffff;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  text-align: center;
  padding: 24px 32px;
  cursor: pointer;
`;
const SummaryCardTitle = styled.div`
  font-size: 19px;
  font-weight: 700;
  line-height: 24px;
`;
const SummaryCardNumber = styled.div`
  font-weight: 500;
  font-size: 30px;
`;

const Dashboard = ({ nokofio_user }) => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [state, updateState] = useReducer(
    (state, newState) => {
      return { ...state, ...newState };
    },
    {
      totalDigitalProductAmountSold: null,
      totalDigitalProductAmountSoldLoading: false,
    }
  );

  useEffect(() => {
    const getTotalAmountSold = async () => {
      try {
        updateState({ totalDigitalProductAmountSoldLoading: true });
        const { data } = await digitalProductService.getTotalAmountSold("30");
        updateState({ totalDigitalProductAmountSold: data });
        updateState({ totalDigitalProductAmountSoldLoading: false });
      } catch (error) {
        updateState({ totalDigitalProductAmountSoldLoading: false });
      }
    };
    getTotalAmountSold();
  }, []);

  useEffect(() => {
    const getDashboardData = async () => {
      dispatch(setFullPageLoading({ status: true }));
      try {
        const { data } = await dashboardServices.getLinksData("30");
        dispatch(setFullPageLoading({ status: false }));
      } catch (error) {
        dispatch(setFullPageLoading({ status: false }));
      } finally {
        dispatch(setFullPageLoading({ status: false }));
      }
    };
    getDashboardData();
  }, [dispatch]);

  return (
    <DashboardContainer>
      <TextDiv>
        Hi,{" "}
        <TextUsername className="animate__animated animate__fadeIn">
          {user?.username}
        </TextUsername>{" "}
      </TextDiv>
      <Box mt={2}>
        <WithdrawalRequestCard />
      </Box>
      <UserDataFilter />
      <CardsRow>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} md={6} lg={3} item>
            <CardColumn>
              <Link className="card_link" href="/dashboard/donations" legacyBehavior>
                <CardWrapper>
                  <SummaryCardTitle>Donation</SummaryCardTitle>
                  <SummaryCardNumber>
                    {user?.isLoadingDashboardData ? (
                      <>
                        <CircularProgress color="inherit" />
                      </>
                    ) : (
                      <>
                        {user?.dashboardData?.totalAmountDonated >= 0 ? (
                          "GHS " + user?.dashboardData?.totalAmountDonated
                        ) : (
                          <>
                            <CircularProgress color="inherit" />
                          </>
                        )}
                      </>
                    )}
                  </SummaryCardNumber>
                </CardWrapper>
              </Link>
            </CardColumn>
          </Grid>
          <Grid xs={12} sm={6} md={6} lg={3} item>
            <CardColumn>
              <Link
                className="card_link"
                href="/dashboard/support-content-donations"
                legacyBehavior>
                <CardWrapper>
                  <SummaryCardTitle>General Payments</SummaryCardTitle>
                  <SummaryCardNumber>
                    {user?.isLoadingDashboardData ? (
                      <>
                        <CircularProgress color="inherit" />
                      </>
                    ) : (
                      <>
                        {user?.dashboardData?.totalAmountSupportMe >= 0 ? (
                          "GHS " + user?.dashboardData?.totalAmountSupportMe
                        ) : (
                          <>
                            <CircularProgress color="inherit" />
                          </>
                        )}
                      </>
                    )}
                  </SummaryCardNumber>
                </CardWrapper>
              </Link>
            </CardColumn>
          </Grid>
          <Grid xs={12} sm={6} md={6} lg={3} item>
            <CardColumn>
              <Link className="card_link" href="#" legacyBehavior>
                <CardWrapper>
                  <SummaryCardTitle>Page Views</SummaryCardTitle>
                  <SummaryCardNumber>
                    {user?.isLoadingDashboardData ? (
                      <>
                        <CircularProgress color="inherit" />
                      </>
                    ) : (
                      <>
                        {user?.dashboardData?.pageVisits >= 0 ? (
                          user?.dashboardData?.pageVisits
                        ) : (
                          <>
                            <CircularProgress color="inherit" />
                          </>
                        )}
                      </>
                    )}
                  </SummaryCardNumber>
                </CardWrapper>
              </Link>
            </CardColumn>
          </Grid>
          {user?.hasDigitalProduct ? (
            <Grid xs={12} sm={6} md={6} lg={3} item>
              <CardColumn>
                <Link className="card_link" href="/dashboard/wholesales" legacyBehavior>
                  <CardWrapper>
                    <SummaryCardTitle>Wholesale</SummaryCardTitle>
                    <SummaryCardNumber>
                      {user?.isLoadingDashboardData ? (
                        <>
                          <CircularProgress color="inherit" />
                        </>
                      ) : (
                        <>
                          {user?.dashboardData?.totalAmountDigitalProduct >=
                          0 ? (
                            "GHS " +
                            user?.dashboardData?.totalAmountDigitalProduct
                          ) : (
                            <>
                              <CircularProgress color="inherit" />
                            </>
                          )}
                        </>
                      )}
                    </SummaryCardNumber>
                  </CardWrapper>
                </Link>
              </CardColumn>
            </Grid>
          ) : null}
          <Grid xs={12} sm={6} md={6} lg={3} item className="d-none">
            <CardColumn style={{ opacity: "0.6" }}>
              <Link className="card_link" href="#" legacyBehavior>
                <CardWrapper>
                  <SummaryCardTitle>Shop</SummaryCardTitle>
                  <SummaryCardTitle style={{ marginTop: "20px" }}>
                    Coming soon!!
                  </SummaryCardTitle>
                </CardWrapper>
              </Link>
            </CardColumn>
          </Grid>
        </Grid>
      </CardsRow>
      <Grid container className="">
        <Grid item xs={12}>
          <DashboardChart />
        </Grid>
      </Grid>
    </DashboardContainer>
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
