import React from "react";
import {
  BackButton,
  HeaderLeft,
  HeaderRight,
  HeaderRow,
  Heading,
} from "../StyledComponents/common";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";

const BackNavTitle = ({ title }) => {
  const router = useRouter();
  return (
    <>
      <HeaderRow>
        {router.pathname !== "/builder" ? (
          <HeaderLeft>
            <BackButton onClick={() => router.back()}>
              <ArrowBackIcon />
            </BackButton>
          </HeaderLeft>
        ) : null}
        <HeaderRight>
          <Typography variant="h6" fontWeight={"bold"}>
            {title}
          </Typography>
        </HeaderRight>
      </HeaderRow>
    </>
  );
};

export default BackNavTitle;
