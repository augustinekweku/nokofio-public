import Grid from "@mui/material/Grid";
import styled from "styled-components";
import { useState } from "react";
import { useEffect } from "react";
import { userRequest } from "../../requestMethods";

import BackNavTitle from "../../components/BackNavTitle";
import { mobile } from "../../responsive";
import CustomDataTable from "../../components/CustomDataTable";
import { useSelector } from "react-redux";
import UserDataFilter from "../../components/UserDataFilter";
import { logoutUser } from "../../utils";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Paper } from "@mui/material";
import Layout from "../../components/Layout";
import AuthLayout from "../../components/AuthLayout";
import { ExportToCsv } from "export-to-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Article, PictureAsPdfSharp } from "@mui/icons-material";

const Container = styled.div`
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
`;
const TableImage = styled.img``;

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const user = useSelector((state) => state?.user?.user);

  const columns = [
    { field: "senderName", headerName: "Sender", width: 170 },
    {
      field: "senderPhoneNumber",
      headerName: "Phone Number",
      width: 150,
      editable: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 100,
      editable: true,
    },
    {
      field: "note",
      headerName: "Note",
      width: 190,
      editable: true,
    },
    {
      field: "anonymous",
      headerName: "Anonymous",
      width: 140,
      valueGetter: (params) => `${params.row.anonymous ? "Yes" : "No"}`,
    },
  ];
  useEffect(() => {
    setDonations(user?.donationTransactionsData);
  }, [user?.donationTransactionsData]);

  function exportToCSV() {
    if (donations?.length === 0) {
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
        "Donation Payments" +
        new Date().toLocaleDateString() +
        " - " +
        new Date().toLocaleTimeString(),
      title: "Donations " + new Date().toLocaleDateString(),
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      //  Won't work with useKeysAsHeaders present!
      // headers: ["id", "senderPhoneNumber", "amount", "note", "anonymous"],
    };
    const csvExporter = new ExportToCsv(options);
    const rows = user?.donationTransactionsData?.map((donation) => {
      return {
        id: donation.id,
        senderName: donation.senderName ? donation.senderName : "",
        senderPhoneNumber: donation.senderPhoneNumber
          ? donation.senderPhoneNumber.toString()
          : "",
        amount: donation.amount ? donation.amount : "",
        note: donation.note ? donation.note : "",
        anonymous: donation.anonymous ? "Yes" : "No",
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

    const title = "Donation Payments " + new Date().toLocaleDateString();
    // const headers = [["NAME", "PROFESSION"]];

    // const data = this.state.people.map(elt=> [elt.name, elt.profession]);

    const headers = [
      [
        "ID",
        "Sender Name",
        "Sender Phone Number",
        "Amount",
        "Note",
        "Anonymous",
      ],
    ];

    const data = user?.donationTransactionsData?.map((donation) => [
      donation.id,
      donation.senderName ? donation.senderName : "",
      donation.senderPhoneNumber ? donation.senderPhoneNumber : "",
      donation.amount ? donation.amount : "",
      donation.note ? donation.note : "",
      donation.anonymous ? "Yes" : "No",
    ]);

    let content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save(
      `DonationPayment_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}.pdf`
    );
  }

  return (
    <Container>
      <BackNavTitle title={"Donations"} />
      <Grid container>
        <div style={{ marginTop: "-10px", marginBottom: "10px" }}>
          <UserDataFilter />
        </div>
        <Grid item xs={12}>
          <Paper>
            {donations?.length > 0 ? (
              <>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", py: 2 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      exportPDF();
                    }}
                    endIcon={
                      <PictureAsPdfSharp
                        sx={{
                          color: "white",
                        }}
                      />
                    }
                  >
                    Export as PDF
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      exportToCSV();
                    }}
                    endIcon={
                      <Article
                        sx={{
                          color: "white",
                        }}
                      />
                    }
                  >
                    Export as CSV
                  </Button>
                </Box>
              </>
            ) : null}
            <div style={{ height: "500px" }}>
              {/* <CustomDataTable rowsData={donations} columnsData={columns} /> */}
              <DataGrid
                loading={user?.isLoadingDashboardData}
                rows={donations || []}
                columns={columns}
                isCellEditable={false}
              />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Donations;

Donations.getLayout = function getLayout(page) {
  return (
    <Layout>
      <AuthLayout>{page}</AuthLayout>{" "}
    </Layout>
  );
};
