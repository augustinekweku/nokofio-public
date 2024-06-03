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
  BECE_SELLING_PRICE,
  CHECKERPRICES,
  CSSPS_SELLING_PRICE,
  WASSCE_SELLING_PRICE,
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

const ResultsChecker = ({ onSuccess }) => {
  const profileUser = useSelector((state) => state.user.user);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const beceProfit = useRef();
  const wassceProfit = useRef();
  const csspsProfit = useRef();
  const dispatch = useDispatch();
  const [saleObj, updateSaleObj] = useReducer(
    (state, newState) => {
      const newObj = { ...state, ...newState };
      if (newObj.wassceProfit == "" || isNaN(newObj.wassceProfit)) {
        newObj.wassceProfit = 0;
      }
      if (newObj.beceProfit == "" || isNaN(newObj.beceProfit)) {
        newObj.beceProfit = 0;
      }
      if (newObj.csspsProfit == "" || isNaN(newObj.csspsProfit)) {
        newObj.csspsProfit = 0;
      }
      if (newObj.wassceProfit > 5) {
        alert("Profit cannot be more than GHC 5");
        newObj.wassceProfit = 5;
      }
      if (newObj.beceProfit > 5) {
        alert("Profit cannot be more than GHC 5");
        newObj.beceProfit = 5;
      }
      if (newObj.csspsProfit > 5) {
        alert("Profit cannot be more than GHC 5");
        newObj.csspsProfit = 5;
      }
      return newObj;
    },
    { wassceProfit: 0, beceProfit: 0, csspsProfit: 0 }
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
    formData.append("beceProfit", saleObj.beceProfit);
    formData.append("wassceProfit", saleObj.wassceProfit);
    formData.append("csspsProfit", saleObj.csspsProfit);

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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileUser) {
      updateSaleObj({
        wassceProfit: profileUser.wassceProfit,
        beceProfit: profileUser.beceProfit,
        csspsProfit: profileUser.csspsProfit,
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
                    BECE <br />
                    Base: GHC ${CHECKERPRICES.BECE.unit_price} <br />
                    Selling: GH₵{" "}
                    {CHECKERPRICES.BECE.unit_price +
                      parseFloat(saleObj.beceProfit)}{" "}
                    <Required>*</Required>
                  </Label>

                  <Input
                    defaultValue={profileUser?.beceProfit}
                    placeholder="Type profit here"
                    required
                    value={removeZeroFromFirstIndex(saleObj.beceProfit)}
                    ref={beceProfit}
                    onChange={(e) => {
                      updateSaleObj({ beceProfit: e.target.value });
                    }}
                  />
                </FormRow>
                <FormRow>
                  <Label>
                    WASSCE <br />
                    Base: GH₵ {CHECKERPRICES.WASSCE.unit_price} <br />
                    Selling: GH₵{" "}
                    {CHECKERPRICES.WASSCE.unit_price +
                      parseFloat(saleObj.wassceProfit)}{" "}
                    <Required>*</Required>
                  </Label>
                  <Input
                    defaultValue={profileUser?.wassceProfit}
                    placeholder="Type profit here "
                    required
                    value={removeZeroFromFirstIndex(saleObj.wassceProfit)}
                    ref={wassceProfit}
                    onChange={(e) => {
                      updateSaleObj({ wassceProfit: e.target.value });
                    }}
                  />
                </FormRow>
                <FormRow>
                  <Label>
                    PLACEMENT <br />
                    Base: GH₵ {CHECKERPRICES.CSSPS.unit_price} <br />
                    Selling: GH₵{" "}
                    {CHECKERPRICES.CSSPS.unit_price +
                      parseFloat(saleObj.csspsProfit)}{" "}
                    <Required>*</Required>
                  </Label>
                  <Input
                    defaultValue={profileUser?.csspsProfit}
                    placeholder="Type profit here"
                    value={removeZeroFromFirstIndex(saleObj.csspsProfit)}
                    required
                    ref={csspsProfit}
                    onChange={(e) => {
                      updateSaleObj({ csspsProfit: e.target.value });
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
              WAEC Results Checker
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

export default ResultsChecker;
