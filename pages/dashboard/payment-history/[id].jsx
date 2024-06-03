/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import dashboardServices from "../../../services/dashboardServices";
import Layout from "../../../components/Layout";
import AuthLayout from "../../../components/AuthLayout";
import { topToast } from "../../../toast";
import { ApiErrorParser } from "../../../helpers";
import {
  Box,
  Button,
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
import DashboardChart from "../../../components/DashboardChart";
import FullPageLoader from "../../../components/FullPageLoader";
import {
  ChartBody,
  ChartContainer,
  ChartContainerLeft,
  ChartContainerRight,
  ChartContainerRightRow,
  ChartStatusIcon,
  ChartTitle,
  ChartTitleColumn,
  ChartTitleRow,
  ContainerRightRowSubtitle,
  ContainerRightRowTitle,
  FormOption,
  FormSelect,
  SelectContainer,
} from "../../../StyledComponents/common";
import styled from "styled-components";
import { mobile } from "../../../responsive";
import { PAYMENT_HISTORY_FILTERS } from "../../../helpers/constants";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getTodaysDate } from "../../../utils";
import { Article, Cancel, PictureAsPdfSharp } from "@mui/icons-material";
import { ExportToCsv } from "export-to-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import WithdrawalHistoryModal from "../../../components/WithdrawalHistoryModal";
import WithdrawalRequestModal from "../../../components/WithdrawalRequestModal";
import { DataGrid } from "@mui/x-data-grid";
import Moment from "react-moment";
const DashboardContainer = styled.div`
  padding: 15px 80px;
  ${mobile({ padding: "15px" })};
  background: #efeeee;
  height: 100vh;
  overflow-y: scroll;
`;

const columns = [
  {
    field: "senderName",
    headerName: "Sender",
    width: 150,
  },
  {
    field: "senderPhoneNumber",
    headerName: "Phone Number",
    width: 150,
  },
  {
    field: "note",
    headerName: "Note",
    width: 240,
    renderCell: (params) => (
      <Typography variant="body2">
        {params.row.note ? params.row.note : "--"}
      </Typography>
    ),
  },
  {
    field: "amount",
    headerName: "Amount",
    width: 150,
    renderCell: (params) => (
      <Typography variant="body2">
        {params.row.amount ? "GHS " + params.row.amount : "--"}
      </Typography>
    ),
  },
  {
    field: "createdAt",
    headerName: "Date",
    width: 180,
    renderCell: (params) => (
      <Typography variant="body2">
        <Moment format="MMM DD, YYYY • h:mm A">{params.row.createdAt}</Moment>
      </Typography>
    ),
  },
];

const PaymentHistory = () => {
  const [state, updateState] = useReducer(
    (state, newState) => {
      return { ...state, ...newState };
    },
    {
      loading: false,
      PaymentHistoryData: null,
      filterDate: PAYMENT_HISTORY_FILTERS.all_time,
    }
  );

  const router = useRouter();
  const { id, fDate = PAYMENT_HISTORY_FILTERS.all_time } = router.query;

  useEffect(() => {
    if (!id) return;
    const getPaymentHistoryData = async () => {
      updateState({ loading: true });
      try {
        const { data } = await dashboardServices.getPaymentHistoryById(
          id,
          fDate
        );
        updateState({ PaymentHistoryData: data.results.data });
        updateState({ loading: false });
      } catch (error) {
        topToast("error", ApiErrorParser(error));
      } finally {
        updateState({ loading: false });
      }
    };
    getPaymentHistoryData();
  }, [id, fDate]);

  function exportToCSV() {
    if (state.PaymentHistoryData?.paymentHistory.length === 0) {
      alert("No data to export");
      return;
    }
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: true,
      filename:
        "General Payments" +
        new Date().toLocaleDateString() +
        " - " +
        new Date().toLocaleTimeString(),
      title: "Payments " + new Date().toLocaleDateString(),
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      //  Won't work with useKeysAsHeaders present!
      // headers: ["id", "senderPhoneNumber", "amount", "note", "anonymous"],
    };
    const csvExporter = new ExportToCsv(options);
    const rows = state.PaymentHistoryData?.paymentHistory?.map((donation) => {
      return {
        Sender: donation.senderName ? donation.senderName : "",
        "Phone Number": donation.senderPhoneNumber
          ? donation.senderPhoneNumber.toString()
          : "",
        Amount: donation.amount ? donation.amount : "",
        Note: donation.note ? donation.note : "",
        Date: dayjs(donation.createdAt).format("DD/MM/YYYY HH:mm").toString(),
      };
    });
    csvExporter?.generateCsv(rows);
  }

  function exportPDF() {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(10);

    const title = `${state.PaymentHistoryData?.title} Payments`;
    const subTitle = new Date().toLocaleDateString();
    // const headers = [["NAME", "PROFESSION"]];

    // const data = this.state.people.map(elt=> [elt.name, elt.profession]);

    const headers = [
      ["Sender Name", "Sender Phone Number", "Amount", "Note", "Date"],
    ];

    const data = state.PaymentHistoryData?.paymentHistory?.map((donation) => [
      donation.senderName ? donation.senderName : "--",
      donation.senderPhoneNumber ? donation.senderPhoneNumber : "--",
      donation.amount ? "GHS" + donation.amount : "--",
      donation.note ? donation.note : "--",
      dayjs(donation.createdAt).format("DD/MM/YYYY"),
    ]);

    let content = {
      startY: 65,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.text(subTitle, marginLeft, 55);
    doc.autoTable(content);
    doc.save(
      `Payments_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}.pdf`
    );
  }

  return (
    <>
      {state.loading ? (
        <FullPageLoader />
      ) : (
        <>
          <DashboardContainer className="hide-scrollbar">
            <Grid container className="">
              <Grid item xs={12}>
                <Box
                  container
                  sx={{
                    marginTop: {
                      xs: "40px",
                    },
                    textAlign: "center",
                  }}
                >
                  <>
                    <Typography
                      variant="h5"
                      color={"#0466C8"}
                      fontWeight={"bold"}
                    >
                      {state.PaymentHistoryData?.title}
                    </Typography>{" "}
                  </>
                  <Typography variant="body2">
                    Amount Remaining :{" "}
                    <Typography variant="span" fontWeight={"bold"}>
                      {" "}
                      GHS{" "}
                      {state.PaymentHistoryData?.totalBalanceLeft
                        ? state.PaymentHistoryData.totalBalanceLeft.toFixed(2)
                        : " 0.00"}
                    </Typography>
                  </Typography>
                  <Typography variant="body2">
                    Amount Withdrawn :{" "}
                    <Typography variant="span" fontWeight={"bold"}>
                      {" "}
                      GHS{" "}
                      {state.PaymentHistoryData?.totalWithdrawalAmount
                        ? state.PaymentHistoryData?.totalWithdrawalAmount.toFixed(
                            2
                          )
                        : " 0.00"}
                    </Typography>
                  </Typography>
                  <Typography variant="body2">
                    Amount Accumulated :{" "}
                    <Typography variant="span" fontWeight={"bold"}>
                      {" "}
                      GHS{" "}
                      {state.PaymentHistoryData?.totalAmountDonated
                        ? state.PaymentHistoryData.totalAmountDonated.toFixed(2)
                        : " 0.00"}
                    </Typography>
                  </Typography>

                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    sx={{
                      flexDirection: {
                        xs: "column",
                        md: "row",
                      },
                    }}
                    gap={2}
                    mt={2}
                  >
                    <WithdrawalHistoryModal id={id} />
                    <WithdrawalRequestModal id={id} totalBalanceLeft={state.PaymentHistoryData?.totalBalanceLeft} />
                  </Box>
                </Box>

                <Box mt={4}>
                  {state.PaymentHistoryData?.paymentHistory.length > 0 ? (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          py: 1,
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          style={{ marginRight: "10px", fontWeight: "bold" }}
                          onClick={() => {
                            exportPDF();
                          }}
                          endIcon={
                            <PictureAsPdfSharp
                              sx={{
                                color: "black",
                              }}
                            />
                          }
                        >
                          Export as PDF
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          style={{ marginRight: "10px", fontWeight: "bold" }}
                          onClick={() => {
                            exportToCSV();
                          }}
                          endIcon={
                            <Article
                              sx={{
                                color: "black",
                              }}
                            />
                          }
                        >
                          Export as CSV
                        </Button>
                      </Box>
                    </>
                  ) : null}
                  {/* <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography fontWeight={"bold"}>Sender</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={"bold"}>
                              Phone number{" "}
                            </Typography>{" "}
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={"bold"}>Note </Typography>{" "}
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={"bold"}> Amount</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={"bold"}>Date</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {state.PaymentHistoryData?.paymentHistory.map(
                          (item, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                <Typography>{item.senderName}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {item.senderPhoneNumber}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {item.note ? item.note : "--"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {item?.amount ? "GHS " + item?.amount : "--"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {dayjs(item?.createdAt).format(
                                    "MMM DD, YYYY • h:mm A"
                                  )}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )
                        )}

                        {!state.PaymentHistoryData?.paymentHistory.length ? (
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row" colSpan={5}>
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
                  </TableContainer> */}

                  <Box
                    sx={{
                      height: 500,
                      width: "100%",
                      background: "white",
                    }}
                  >
                    <DataGrid
                      getRowId={(row, i) => {
                        return uuidv4();
                      }}
                      rows={state.PaymentHistoryData?.paymentHistory || []}
                      columns={columns}
                      loading={state.loading}
                      pageSize={10}
                      rowsPerPageOptions={[10]}
                      disableSelectionOnClick
                    />
                  </Box>
                </Box>
                <Box mt={3}>
                  <SelectContainer style={{ width: "160px", height: "35px" }}>
                    <FormSelect
                      value={fDate}
                      onChange={(e) => {
                        router.push({
                          query: {
                            ...router.query,
                            fDate: e.target.value,
                          },
                        });
                      }}
                    >
                      <FormOption value={PAYMENT_HISTORY_FILTERS.today}>
                        Today
                      </FormOption>
                      <FormOption value={PAYMENT_HISTORY_FILTERS.last_7_days}>
                        Last 7 days
                      </FormOption>
                      <FormOption value={PAYMENT_HISTORY_FILTERS.last_30_days}>
                        Last 30 days
                      </FormOption>
                      <FormOption value={PAYMENT_HISTORY_FILTERS.last_90_days}>
                        Last 90 days
                      </FormOption>
                      <FormOption value={PAYMENT_HISTORY_FILTERS.all_time}>
                        All
                      </FormOption>
                    </FormSelect>
                  </SelectContainer>
                </Box>
                <Box>
                  <ChartContainer>
                    <ChartContainerLeft>
                      <ChartTitleRow>
                        <ChartTitleColumn>
                          <ChartTitle>Payment Trends</ChartTitle>
                          {" as of "}
                          {getTodaysDate()}
                        </ChartTitleColumn>
                        <ChartTitleColumn
                          style={{ display: "flex", flexDirection: "row" }}
                        >
                          <ChartStatusIcon style={{ color: "#b9a62f" }}>
                            <HorizontalRuleIcon fontSize="large" /> Payments
                          </ChartStatusIcon>
                        </ChartTitleColumn>
                      </ChartTitleRow>

                      <>
                        <ChartBody>
                          <ResponsiveContainer width="100%" height="80%">
                            <AreaChart
                              width={730}
                              height={250}
                              data={state.PaymentHistoryData?.trend}
                              className="chart_box"
                              margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                              }}
                            >
                              <defs>
                                <linearGradient
                                  id="colorPv"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
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
                    </ChartContainerLeft>
                    <ChartContainerRight className="d-none">
                      <ChartContainerRightRow>
                        <ContainerRightRowTitle>
                          Resolved
                        </ContainerRightRowTitle>
                        <ContainerRightRowSubtitle>
                          449
                        </ContainerRightRowSubtitle>
                      </ChartContainerRightRow>
                      <ChartContainerRightRow>
                        <ContainerRightRowTitle>
                          Resolved
                        </ContainerRightRowTitle>
                        <ContainerRightRowSubtitle>
                          449
                        </ContainerRightRowSubtitle>
                      </ChartContainerRightRow>
                      <ChartContainerRightRow>
                        <ContainerRightRowTitle>
                          Resolved
                        </ContainerRightRowTitle>
                        <ContainerRightRowSubtitle>
                          449
                        </ContainerRightRowSubtitle>
                      </ChartContainerRightRow>
                      <ChartContainerRightRow>
                        <ContainerRightRowTitle>
                          Resolved
                        </ContainerRightRowTitle>
                        <ContainerRightRowSubtitle>
                          449
                        </ContainerRightRowSubtitle>
                      </ChartContainerRightRow>
                    </ChartContainerRight>
                  </ChartContainer>
                </Box>
              </Grid>
            </Grid>
          </DashboardContainer>
        </>
      )}
    </>
  );
};

PaymentHistory.getLayout = function getLayout(page) {
  return (
    <Layout>
      <AuthLayout>{page}</AuthLayout>{" "}
    </Layout>
  );
};

export default PaymentHistory;
