import Link from "next/link";
import styled from "styled-components";
import { Box, CircularProgress, Modal, Typography } from "@mui/material";
import {
  Btn,
  CloseButton,
  ModalContainer,
  ModalContent,
  ModalTop,
  TopRight,
} from "../StyledComponents/common";
import { useEffect, useReducer, useState } from "react";
import { useRef } from "react";
import { topToast } from "../toast";
import CancelIcon from "@mui/icons-material/Cancel";
import { mobile } from "../responsive";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { removeZeroFromFirstIndex } from "../helpers";
import {
  API_URL_V1,
  API_URL_V2,
  CHECKERPRICES,
} from "../helpers/constants";

const LinkCardWrapper = styled.div`
  position: relative;
  padding: 10px 28px;
  display: flex;
  width: 100%;
  min-height: 70px;
  ${mobile({ padding: "24px 5px" })}

  background-color: #ffffff;
  /* cursor: pointer; */
  border-radius: 8px;
  margin-bottom: 15px;
`;

const CardInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const CardInnerLeftWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-grow: 1;
`;
const CardInnerLeftIcon = styled.div`
  margin-right: 20px;
  color: black;
  display: flex;
  align-items: center;
`;

const CardInnerLeftInfo = styled.div`
  word-wrap: anywhere;
`;
const CardTitle = styled.div`
  display: flex;
  align-items: center;
  color: black;
  font-size: 16px;
  font-weight: 400;
`;

const LinkThumbnail = styled.img`
  width: 30px;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;
const Form = styled.form``;
const FormRow = styled.div``;
const Label = styled.div`
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  margin-bottom: 6px;
  color: #98a2b3;
`;

const Input = styled.input`
  padding: 12px 14px 12px 14px;
  width: 100%;
  height: 48px;
  background: #f5f5f5;
  border-radius: 8px 8px 8px 8px;
  border: none;
  margin-bottom: 20px;
  &:focus {
    outline: none;
  }
`;

const Required = styled.sup`
  color: red;
`;

const ResultsChecking = ({ onSuccess }) => {
  const profileUser = useSelector((state) => state.user.user);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const checkProfit = useRef();
  const dispatch = useDispatch();
  const [saleObj, updateSaleObj] = useReducer(
    (state, newState) => {
      const newObj = { ...state, ...newState };
      if (newObj.checkProfit == "" || isNaN(newObj.checkProfit)) {
        newObj.checkProfit = 0;
      }

      if (newObj.checkProfit > 5) {
        alert("Profit cannot be more than GHC 5");
        newObj.checkProfit = 5;
      }
      return newObj;
    },
    { checkProfit: 0}
  );

  const handleClose = () => {
    setOpen(false);
  };
  if (typeof window !== "undefined") {
    var TOKEN = JSON.parse(localStorage.getItem("currentUser"))?.accessToken;
  }

  const saveProfit = async (e) => {
    e.preventDefault();
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("x-access-token", TOKEN);
    myHeaders.append("Content-Type", "multipart/form-data");

    var formData = new FormData();
    formData.append("checkProfit", saleObj.checkProfit);
    try {
      axios({
        method: "POST",
        url: `${API_URL_V1}/user/profileBio`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token": TOKEN,
        },
      }).then(async function (response) {
        if (response.status === 200) {
          topToast("success", "Profit margin added successfully");
          setOpen(false);
          setLoading(false);
          onSuccess();
        }
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileUser) {
      updateSaleObj({
        checkProfit: profileUser.checkProfit,
      });
    }
  }, []);

  return (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalContainer>
          <ModalTop justifyContent={"space-between"}>
            <div>
              <b>Add Profit</b>
              <Typography variant="body2" fontSize={"small"} color={"gray"}>
                Set your profit margin. Profit cannot be more than GHC 5
              </Typography>
            </div>
            <TopRight>
              <CloseButton>
                <CancelIcon onClick={handleClose} />
              </CloseButton>
            </TopRight>
          </ModalTop>
          <ModalContent>
            <div style={{ padding: "20px 0" }}>
              <form onSubmit={saveProfit}>
                <FormRow>
                  <Label>
                    INSTANT RESULT & PLACEMENT CHECKING <br />
                    Base: GHC ${CHECKERPRICES.CHECKING.unit_price} <br />
                    Selling: GH₵{" "}
                    {CHECKERPRICES.CHECKING.unit_price +
                      parseFloat(saleObj.checkProfit)}{" "}
                    <Required>*</Required>
                  </Label>

                  <Input
                    defaultValue={profileUser?.checkProfit}
                    placeholder="Type profit here"
                    required
                    value={removeZeroFromFirstIndex(saleObj.checkProfit)}
                    ref={checkProfit}
                    onChange={(e) => {
                      updateSaleObj({ checkProfit: e.target.value });
                    }}
                  />
                </FormRow>
                <Btn
                  style={{ marginTop: "20px" }}
                  bg={"#000"}
                  color={"white"}
                  block
                  type="submit"
                  disabled={loading}
                >
                  Save &nbsp;
                  {loading && (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  )}
                </Btn>
              </form>
            </div>
          </ModalContent>
        </ModalContainer>
      </Modal>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        mb={2}
        backgroundColor={"#F5F5F5"}
        p={2}
        borderRadius={2}
        onClick={() => setOpen(true)}
        sx={{ cursor: "pointer" }}
      >
        <Box display={"flex"} alignItems={"center"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={"/images/waeclogo.jpg"}
            alt={"waec logo"}
            style={{
              marginRight: "15px",
              width: "40px",
              borderRadius: "8px",
            }}
          />
          <Box>
            <Typography variant={"subtitle1"} fontWeight={"bold"}>
              Intant BECE/PLACEMENT/WASSCE Results Checking - PDF
            </Typography>
            <Typography variant={"subtitle2"} color={"GrayText"}>
              Set your Profit
            </Typography>
          </Box>
        </Box>
        <Box display={"flex"} alignItems={"center"} gap={2}></Box>
      </Box>
    </>
  );
};

export default ResultsChecking;
