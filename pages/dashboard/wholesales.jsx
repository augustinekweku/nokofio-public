import Grid from "@mui/material/Grid";
import styled from "styled-components";
import { useState } from "react";
import { useEffect } from "react";
import { userRequest } from "../../requestMethods";

import BackNavTitle from "../../components/BackNavTitle";
import { mobile } from "../../responsive";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import WithdrawalRequestCard from "../../components/WithdrawalRequestCard";
import Layout from "../../components/Layout";
import AuthLayout from "../../components/AuthLayout";

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

const TopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  ${mobile({ flexDirection: "column" })}
`;

const TopHeading = styled.h1`
  font-size: 32px;
  font-weight: 500;
  line-height: 45px;
  ${mobile({ fontSize: "24px" })}
`;

const Donations = ({ nokofio_user }) => {
  const [wholesaleTransactions, setWholesaleTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state?.user?.user);
  const router = useRouter();

  const columns = [
    {
      field: "voucher_type",
      headerName: "Voucher Type",
      width: 150,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 150,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
    },
    {
      field: "time_of_purchase",
      headerName: "Date",
      width: 150,
      valueGetter: (params) => `${params.row.time_of_purchase}`,
    },
    {
      field: "buy_source",
      headerName: "Source",
      width: 150,
    },
  ];

  useEffect(() => {
    const getSales = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get(
          `https://broxpin.herokuapp.com/voucher/get-wholeseller-sales?username=${user.username}`
        );
        if (res.status === 200) {
          setLoading(false);
          setWholesaleTransactions(res.data.message);
        }
      } catch (error) {
        setLoading(false);
        if (error.response.status === 401) {
          localStorage.removeItem("currentUser");
          window.location.href = "/";
        }
      }
    };
    getSales();
  }, []);

  return (
    <Container>
      <BackNavTitle title={"Digital Product"} />
      <WithdrawalRequestCard />
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ height: 400, width: "100%", background: "white" }}>
            <DataGrid
              rows={wholesaleTransactions}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
            />
          </Box>
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
