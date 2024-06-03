import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styled from "styled-components";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { getTodaysDate } from "../utils";
import { useState } from "react";
import { useSelector } from "react-redux";
import InnerLoader from "./InnerLoader";

const ChartContainer = styled.div`
  background: #ffffff;
  border: 1px solid #dfe0eb;
  border-radius: 8px;
  margin-top: 20px;
  display: flex;
`;
const ChartContainerLeft = styled.div`
  padding: 32px;
  flex: 4;
`;
const ChartContainerRight = styled.div`
  flex: 1;
  border-left: 1px solid #dfe0eb;
`;
const ChartContainerRightRow = styled.div`
  border-bottom: 1px solid #dfe0eb;
  padding: 32px;
`;

const ContainerRightRowTitle = styled.h5`
  color: #9fa2b4;
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  text-align: center;
`;

const ContainerRightRowSubtitle = styled.h6`
  font-size: 24px;
  font-weight: 700;
  line-height: 30px;
  text-align: center;
`;

const ChartTitle = styled.div`
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const ChartTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 30px;
`;

const ChartTitleColumn = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`;

const ChartStatusIcon = styled.span`
  display: flex;
  align-items: center;
  font-weight: 500;
`;

const ChartBody = styled.div`
  height: 100%;
`;

// const data = [
//   {
//     name: "Jan",
//     views: 10,
//     donations: 4,
//     supportMyContent: 3,
//   },
//   {
//     name: "Feb",
//     views: 15,
//     donations: 12,
//     supportMyContent: 6,
//   },
//   {
//     name: "Mar",
//     views: 25,
//     donations: 15,
//     supportMyContent: 11,
//   },
//   {
//     name: "Apr",
//     views: 54,
//     donations: 20,
//     supportMyContent: 30,
//   },
//   {
//     name: "May",
//     views: 40,
//     donations: 22,
//     supportMyContent: 29,
//   },
//   {
//     name: "Jun",
//     views: 55,
//     donations: 32,
//     supportMyContent: 20,
//   },
//   {
//     name: "Jul",
//     views: 65,
//     donations: 44,
//     supportMyContent: 30,
//   },
//   {
//     name: "Aug",
//     views: 30,
//     donations: 23,
//     supportMyContent: 12,
//   },
//   {
//     name: "Sep",
//     views: 27,
//     donations: 21,
//     supportMyContent: 18,
//   },
//   {
//     name: "Oct",
//     views: 58,
//     donations: 39,
//     supportMyContent: 28,
//   },
//   {
//     name: "Nov",
//     views: 77,
//     donations: 56,
//     supportMyContent: 30,
//   },
//   {
//     name: "Dec",
//     views: 65,
//     donations: 44,
//     supportMyContent: 30,
//   },
// ];

const DashboardChart = () => {
  const user = useSelector((state) => state?.user?.user);
  let donationsChartData = user?.dashboardData?.donationTrend;
  let supportMyContentChartData = user?.dashboardData?.suportMeTrend;

  return (
    <>
      <ChartContainer>
        <ChartContainerLeft>
          <ChartTitleRow>
            <ChartTitleColumn>
              <ChartTitle>Donation Trends</ChartTitle>
              {" as of "}
              {getTodaysDate()}
            </ChartTitleColumn>
            <ChartTitleColumn style={{ display: "flex", flexDirection: "row" }}>
              <ChartStatusIcon style={{ color: "#b9a62f" }}>
                <HorizontalRuleIcon fontSize="large" /> Donations
              </ChartStatusIcon>
            </ChartTitleColumn>
          </ChartTitleRow>
          {user?.isLoadingDashboardData ? (
            <>
              <InnerLoader />
            </>
          ) : (
            <>
              <ChartBody>
                <ResponsiveContainer width="100%" height="80%">
                  <AreaChart
                    width={730}
                    height={250}
                    data={donationsChartData}
                    className="chart_box"
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#82ca9d"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#82ca9d"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis
                      label={{
                        value: "Amount in GHS",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#b9a62f"
                      fillOpacity={0.4}
                      fill="#b9a62f"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartBody>
            </>
          )}
        </ChartContainerLeft>
        <ChartContainerRight className="d-none">
          <ChartContainerRightRow>
            <ContainerRightRowTitle>Resolved</ContainerRightRowTitle>
            <ContainerRightRowSubtitle>449</ContainerRightRowSubtitle>
          </ChartContainerRightRow>
          <ChartContainerRightRow>
            <ContainerRightRowTitle>Resolved</ContainerRightRowTitle>
            <ContainerRightRowSubtitle>449</ContainerRightRowSubtitle>
          </ChartContainerRightRow>
          <ChartContainerRightRow>
            <ContainerRightRowTitle>Resolved</ContainerRightRowTitle>
            <ContainerRightRowSubtitle>449</ContainerRightRowSubtitle>
          </ChartContainerRightRow>
          <ChartContainerRightRow>
            <ContainerRightRowTitle>Resolved</ContainerRightRowTitle>
            <ContainerRightRowSubtitle>449</ContainerRightRowSubtitle>
          </ChartContainerRightRow>
        </ChartContainerRight>
      </ChartContainer>
      <ChartContainer>
        <ChartContainerLeft>
          <ChartTitleRow>
            <ChartTitleColumn>
              <ChartTitle>Support My Content</ChartTitle>
              {" as of "}
              {getTodaysDate()}
            </ChartTitleColumn>
            <ChartTitleColumn style={{ display: "flex", flexDirection: "row" }}>
              <ChartStatusIcon style={{ color: "#82ca8e" }}>
                <HorizontalRuleIcon fontSize="large" /> Support My Content
              </ChartStatusIcon>
            </ChartTitleColumn>
          </ChartTitleRow>
          {user?.isLoadingDashboardData ? (
            <>
              <InnerLoader />
            </>
          ) : (
            <>
              <ChartBody>
                <ResponsiveContainer width="100%" height="80%">
                  <AreaChart
                    width={730}
                    height={250}
                    data={supportMyContentChartData}
                    className="chart_box"
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#82ca9d"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#82ca9d"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis
                      label={{
                        value: "Amount in GHS",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#82ca8e"
                      fillOpacity={0.4}
                      fill="#82ca8e"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartBody>
            </>
          )}
        </ChartContainerLeft>
        <ChartContainerRight className="d-none">
          <ChartContainerRightRow>
            <ContainerRightRowTitle>Resolved</ContainerRightRowTitle>
            <ContainerRightRowSubtitle>449</ContainerRightRowSubtitle>
          </ChartContainerRightRow>
          <ChartContainerRightRow>
            <ContainerRightRowTitle>Resolved</ContainerRightRowTitle>
            <ContainerRightRowSubtitle>449</ContainerRightRowSubtitle>
          </ChartContainerRightRow>
          <ChartContainerRightRow>
            <ContainerRightRowTitle>Resolved</ContainerRightRowTitle>
            <ContainerRightRowSubtitle>449</ContainerRightRowSubtitle>
          </ChartContainerRightRow>
          <ChartContainerRightRow>
            <ContainerRightRowTitle>Resolved</ContainerRightRowTitle>
            <ContainerRightRowSubtitle>449</ContainerRightRowSubtitle>
          </ChartContainerRightRow>
        </ChartContainerRight>
      </ChartContainer>
    </>
  );
};

export default DashboardChart;
