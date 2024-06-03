import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import styled from "styled-components";
import { Container } from "@mui/material";
import { Btn } from "../StyledComponents/common";
import Link from "next/link";
import HomeMenu from "./HomeMenu";
import { mobile } from "../responsive";
const LogoImage = styled.img``;

const HomeLoginBtn = styled(Btn)`
  padding: 12px 24px;
  ${mobile({ padding: "12px" })}
`;

export default function PublicNavbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        sx={{ padding: "10px 0", background: "#151515" }}
        position="static"
      >
        <Container sx={{ padding: { xs: "0px 16px" } }} maxWidth="xl">
          <Toolbar>
            <Box
              className="d-none"
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              <HomeMenu />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <LogoImage src="/images/Logo-white.png" alt="" width="120" />
            </Box>
            <Box
              sx={{
                display: { xs: "flex", md: "flex", gap: 10 },
                flexDirection: { xs: "row" },
              }}
            >
              <Link
                href="/login"
                sx={{ display: { xs: "none", md: "flex" } }}
                legacyBehavior
              >
                <HomeLoginBtn fw="600" color="inherit">
                  LOGIN
                </HomeLoginBtn>
              </Link>
              <Link href="/register" legacyBehavior>
                <HomeLoginBtn bg="#fbb516" color="#151515" fw="600">
                  REGISTER
                </HomeLoginBtn>
              </Link>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
