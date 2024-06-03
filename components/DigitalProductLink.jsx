import styled from "styled-components";
import { useState, useRef } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { desktop, mobile } from "../responsive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { PaystackButton } from "react-paystack";
import { centerToast } from "../toast";
import { Checkbox, FormControlLabel, Grid } from "@mui/material";
import { useEffect } from "react";
import { removeSpaces } from "../helpers";
import {
  FormOption,
  FormSelect,
  SelectContainer,
} from "../StyledComponents/common";
import { CHECKERPRICES } from "../helpers/constants";

const Modal = styled.div`
  width: 100%;
  height: 100vh;
  background: #00000069;
  position: fixed;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LinkCard = styled.div`
  background-color: #353432;
  padding: 23px 32px;
  color: #fff;
  border-radius: 5px;
  margin-bottom: 16px;
`;
const ModalContainer = styled.div`
  max-height: 90vh;
  overflow-y: auto;
  width: 600px;
  padding: 16px 32px;
  transition: "all 0.5s ease";
  background: #e8e8e8;
  box-shadow: 24;
  border-radius: 10px;
  ${mobile({ width: "90%", padding: "16px 20px" })}
  ${desktop({
    width: "600px",
    padding: "16px 32px",
  })};
  &:focus {
    outline: none;
  }
`;
const ModalTop = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const TopRight = styled.div``;
const CloseButton = styled.div`
  cursor: pointer;
`;

const ModalContent = styled.div`
  padding-bottom: 10px;
`;
const Title = styled.div`
  font-family: Poppins;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 8px;
  ${mobile({ fontSize: "20px", lineHeight: "20px" })}
`;
const SubText = styled.div`
  ${mobile({ fontSize: "14px", lineHeight: "16px", marginBottom: "5px" })}
  margin-bottom: 5px;
`;
const Divider = styled.hr`
  width: 100%;
  height: 2px;
  margin-bottom: 16px;
`;
const Label = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 8px;
`;
const DivRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ColumnButton = styled.div`
  cursor: pointer;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  background: #2c2b2b;
  border-radius: 8px;
  padding: 12px 40px;
  color: #fff;
  ${mobile({ padding: "12px 15px", fontSize: "14px" })}
  position: relative;
  display: flex;
  align-items: center;
  height: 48px;
`;
const FloatIcon = styled.div`
  display: none;
  position: absolute;
  top: -9px;
  right: -5px;
`;

const FormRow = styled.div`
  margin-bottom: 10px;
`;
const Input = styled.input`
  padding: 8px 10px 8px 10px;
  width: ${(props) => (props.widthAuto ? "auto" : "100%")};
  height: 48px;
  background: #f5f5f5;
  border-radius: 8px;
  border: none;
  &:focus {
    outline: none;
  }
`;
const InputTextarea = styled.textarea`
  padding: 12px 14px 12px 14px;
  width: 100%;
  background: #f5f5f5;
  border-radius: 8px 8px 8px 8px;
  border: none;
  margin-bottom: 20px;
  &:focus {
    outline: none;
  }
`;
const UserInfo = styled.div`
  display: none;
  margin-bottom: 10px;
`;
const ProfileLink = styled.div`
  cursor: pointer;
  &:hover {
    transform: scale(1.035);
    transition: all 0.3s ease-in-out;
  }
`;

const DigitalProductLink = ({
  setDigitalProductModalClose,
  productProfit,
  purpose,
  isCssps,
}) => {
  const [open, setOpen] = useState(false);

  const username = JSON.parse(
    localStorage.getItem("nokofioPublicProfile")
  )?.username;
  const phoneNumber = JSON.parse(
    localStorage.getItem("nokofioPublicProfile")
  )?.phoneNumber;

  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(null);
  const [voucherType, setVoucherType] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [indexNumber, setIndexNumber] = useState(null);
  const [repeatedIndexNumber, setRepeatedIndexNumber] = useState(null);
  const [examYear, setExamYear] = useState(null);
  const [examType, setExamType] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  const paystackBtn = useRef();
  const [profit, setProfit] = useState(0);

  const handleOpen = () => {
    setOpen(true);
  };
  const componentProps = {
    email: `${phone}.${username}@nokofio.me`,
    amount: amount * 100,
    phone,
    currency: "GHS",
    metadata: {
      phone_number: phone,
      quantity: quantity? quantity : 1,
      voucher_type: voucherType,
      transactionType: "waecDigitalProduct",
      receiverUsername: username,
      receiverPhoneNumber: phoneNumber,
      purpose: purpose,
      profit: profit,
      checkDetails: `${indexNumber}_${examType}_${examYear}_${dateOfBirth}`,
    },
    publicKey,
    text: "Buy Now",
    onSuccess: () => onSucessPayStack(),
    // onClose: () => onClosePayStack(),
  };

  const onSucessPayStack = () => {
    setOpen(false);
    centerToast(
      "success",
      "Payment complete. You will receive SMS shortly",
      "Helpline: 0546083599"
    );
  };

  const isPhoneNumberValid = (phoneNumber) => {
    const reg = /^[0-9\b]{10}$/;
    if (reg.test(phoneNumber)) return true;
    return false;
  };

  const calcPrice = (quantity) => {
    // check if type is wassce orand set amount accordingly
    if (voucherType === "wassce") {
      // check if quantity is less than 10 and set amount accordingly
      if (quantity < 10) {
        setAmount(
          quantity *
            (CHECKERPRICES.WASSCE.unit_price + productProfit[0].wassceProfit)
        );
      } else if (quantity >= 10) {
        setAmount(
          quantity *
            (CHECKERPRICES.WASSCE.bulk_price + productProfit[0].wassceProfit)
        );
      } else if (quantity >= 50) {
        setAmount(
          quantity *
            (CHECKERPRICES.WASSCE.bulk_price_50 + productProfit[0].wassceProfit)
        );
      }
    }
    // check if type is wassce or bece and set amount accordingly
    if (voucherType === "bece") {
      // check if quantity is less than 10 and set amount accordingly
      if (quantity < 10) {
        setAmount(
          quantity *
            (CHECKERPRICES.BECE.unit_price + productProfit[0].beceProfit)
        );
      } else if (quantity >= 10) {
        setAmount(
          quantity *
            (CHECKERPRICES.BECE.bulk_price + productProfit[0].beceProfit)
        );
      } else if (quantity >= 50) {
        setAmount(
          quantity *
            (CHECKERPRICES.BECE.bulk_price_50 + productProfit[0].beceProfit)
        );
      }
    }

    if (voucherType === "cssps") {
      // check if quantity is less than 10 and set amount accordingly
      if (quantity < 10) {
        setAmount(
          quantity *
            (CHECKERPRICES.CSSPS.unit_price + productProfit[0].csspsProfit)
        );
      } else if (quantity >= 10) {
        setAmount(
          quantity *
            (CHECKERPRICES.CSSPS.bulk_price * productProfit[0].csspsProfit)
        );
      }
    }
  };

  function setUnitCheckerPrice(voucherType) {
    if (voucherType === "wassce") {
      return CHECKERPRICES.WASSCE.unit_price;
    }
    if (voucherType === "bece") {
      return CHECKERPRICES.BECE.unit_price;
    }
    if (voucherType === "cssps") {
      return CHECKERPRICES.CSSPS.unit_price;
    }
  }

  function setBulkCheckerPrice(voucherType, quantity) {
    if (voucherType === "wassce" || voucherType === "bece") {
      if (quantity >= 10 && quantity < 50) {
        return CHECKERPRICES.WASSCE.bulk_price;
      }
      if (quantity >= 50) {
        return CHECKERPRICES.WASSCE.bulk_price_50;
      }
    }

    if (voucherType === "cssps") {
      return CHECKERPRICES.CSSPS.bulk_price;
    }
  }

  useEffect(() => {
    //validate the 2 index numbers
    if (indexNumber !== null && indexNumber !== "") {
      if (indexNumber !== repeatedIndexNumber) {
        centerToast("error", "Index numbers do not match", "Check well");
      }
    }

    const validateForm = () => {
      if (purpose == "check") {
        if (indexNumber && phone && isPhoneNumberValid(phone)) {
          paystackBtn.current.style.display = "none";
        } else {
          paystackBtn.current.style.display = "block";
        }
      } else {
        if (amount && phone && isPhoneNumberValid(phone)) {
          paystackBtn.current.style.display = "none";
        } else {
          paystackBtn.current.style.display = "block";
        }
      }
    };
    validateForm();
  }, [phone]);

  return (
    <>
      {purpose == "check" ? (
        isCssps ? (
          // cssps checker
          <Modal>
           <ModalContainer>
            <ModalTop>
              <TopRight>
                <CloseButton>
                  <CancelIcon
                    onClick={() => {
                      setDigitalProductModalClose(true);
                    }}
                  />
                </CloseButton>
              </TopRight>
            </ModalTop>
            <ModalContent>
              <Title>CHECK SHS PLACEMENT INSTANTLY</Title>
              <SubText>
                {`GHS${
                  CHECKERPRICES.CHECKING.unit_price +
                  productProfit[0].checkProfit
                }: SHS Placement will be sent to your phone number after payment`}
              </SubText>
              <Divider></Divider>
              <FormRow>
                <Label>
                  Index Number (end it with 23) <sup style={{ color: "red" }}>*</sup>
                </Label>
                <Input
                  className=" animate__animated animate__fadeIn"
                  pattern="[0-9]*"
                  required
                  type="text"
                  maxLength={12}
                  placeholder="Enter Index Number"
                  onChange={(e) => setIndexNumber(e.target.value)}
                />
              </FormRow>
              <FormRow>
                <Label>
                  Repeat Index Number<sup style={{ color: "red" }}>*</sup>
                </Label>
                <Input
                  className=" animate__animated animate__fadeIn"
                  pattern="[0-9]*"
                  required
                  type="text"
                  maxLength={12}
                  placeholder="Enter Index Number"
                  onChange={(e) => setRepeatedIndexNumber(e.target.value)}
                />
              </FormRow>
              <FormRow>
                <Label>
                  Phone Number<sup style={{ color: "red" }}>*</sup>
                </Label>
                <Input
                  className=" animate__animated animate__fadeIn"
                  pattern="[0-9]*"
                  required
                  type="text"
                  maxLength={10}
                  placeholder="Enter Phone Number"
                  onChange={(e) => {
                    setPhone(e.target.value)
                    setProfit(productProfit[0].checkProfit);
                    setAmount(
                      CHECKERPRICES.CHECKING.unit_price +
                        productProfit[0].checkProfit
                    );
                    setQuantity(1);
                    setVoucherType('cssps');
                  }}
                />
              </FormRow>
              <div
                style={{ marginTop: "30px" }}
                className="paystackBtnContainer"
              >
                <PaystackButton
                  className="paystack-button"
                  {...componentProps}
                />
                <div className="disabled-div" ref={paystackBtn}></div>
              </div>
            </ModalContent>
          </ModalContainer>
          </Modal>
        ) : (
        <Modal>
          <ModalContainer>
            <ModalTop>
              <TopRight>
                <CloseButton>
                  <CancelIcon
                    onClick={() => {
                      setDigitalProductModalClose(true);
                    }}
                  />
                </CloseButton>
              </TopRight>
            </ModalTop>
            <ModalContent>
              <Title>CHECK RESULTS INSTANTLY</Title>
              <SubText>
                {`GHS${
                  CHECKERPRICES.CHECKING.unit_price +
                  productProfit[0].checkProfit
                }: Results in PDF would be sent to your phone number after payment`}
              </SubText>
              <Divider></Divider>
              <FormRow>
                <Label>Choose Exam Type</Label>
                <SelectContainer>
                  <FormSelect
                    required
                    onChange={(e) => {
                      let voucherType = "wassce";
                      if (e.target.value === "BECE") {
                        voucherType = "bece";
                      }
                      setVoucherType(voucherType);
                      setExamType(e.target.value);
                      setProfit(productProfit[0].checkProfit);
                      setAmount(
                        CHECKERPRICES.CHECKING.unit_price +
                          productProfit[0].checkProfit
                      );
                      setQuantity(1);
                    }}
                  >
                    <FormOption value={""}>Select Exam Type</FormOption>
                    <FormOption value={"WASS"}>WASSCE</FormOption>
                    <FormOption value={"BECE"}>BECE</FormOption>
                    <FormOption value={"PWAS"}>WASSCE NOV-DEC</FormOption>
                    <FormOption value={"PBEC"}>BECE NOV-DEC</FormOption>
                  </FormSelect>
                </SelectContainer>
              </FormRow>
              <FormRow>
                <Label>
                  Index Number<sup style={{ color: "red" }}>*</sup>
                </Label>
                <Input
                  className=" animate__animated animate__fadeIn"
                  pattern="[0-9]*"
                  required
                  type="text"
                  maxLength={12}
                  placeholder="Enter Index Number"
                  onChange={(e) => setIndexNumber(e.target.value)}
                />
              </FormRow>
              <FormRow>
                <Label>Choose Exam Year</Label>
                <SelectContainer>
                  <FormSelect
                    required
                    onChange={(e) => {
                      setExamYear(e.target.value);
                    }}
                  >
                    <FormOption value={""}>Select Exam Year</FormOption>
                    <FormOption value={"2023"}>2023</FormOption>
                    <FormOption value={"2022"}>2022</FormOption>
                    <FormOption value={"2021"}>2021</FormOption>
                    <FormOption value={"2020"}>2020</FormOption>
                    <FormOption value={"2019"}>2019</FormOption>
                    <FormOption value={"2018"}>2018</FormOption>
                    <FormOption value={"2017"}>2017</FormOption>
                    <FormOption value={"2016"}>2016</FormOption>
                    <FormOption value={"2015"}>2015</FormOption>
                  </FormSelect>
                </SelectContainer>
              </FormRow>
              <FormRow>
                <Label>
                  Repeat Index Number<sup style={{ color: "red" }}>*</sup>
                </Label>
                <Input
                  className=" animate__animated animate__fadeIn"
                  pattern="[0-9]*"
                  required
                  type="text"
                  maxLength={12}
                  placeholder="Enter Index Number"
                  onChange={(e) => setRepeatedIndexNumber(e.target.value)}
                />
              </FormRow>
              {/* if examtype is PWAS or BWAS then show date of birth formrow */}
              {examType === "PWAS" || examType === "PBEC" ? (
                <FormRow>
                  <Label>Date of Birth</Label>
                  <Input
                    className=" animate__animated animate__fadeIn"
                    pattern="[0-9]*"
                    required
                    type="date"
                    maxLength={10}
                    placeholder="Enter Date of Birth"
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </FormRow>
              ) : null}
              <FormRow>
                <Label>
                  Phone Number<sup style={{ color: "red" }}>*</sup>
                </Label>
                <Input
                  className=" animate__animated animate__fadeIn"
                  pattern="[0-9]*"
                  required
                  type="text"
                  maxLength={10}
                  placeholder="Enter Phone Number"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormRow>
              <div
                style={{ marginTop: "30px" }}
                className="paystackBtnContainer"
              >
                <PaystackButton
                  className="paystack-button"
                  {...componentProps}
                />
                <div className="disabled-div" ref={paystackBtn}></div>
              </div>
            </ModalContent>
          </ModalContainer>
        </Modal>
        )
      ) : (
        <Modal>
          <ModalContainer>
            <ModalTop>
              <TopRight>
                <CloseButton>
                  <CancelIcon
                    onClick={() => {
                      setDigitalProductModalClose(true);
                    }}
                  />
                </CloseButton>
              </TopRight>
            </ModalTop>
            <ModalContent>
              <Title>WAEC/PLACEMENT CHECKER CARDS</Title>
              <SubText>
                Checker code would be sent to your phone number after payment
              </SubText>
              <Divider></Divider>
              <FormRow>
                <Label>Choose Checker Type</Label>
                <SelectContainer>
                  <FormSelect
                    required
                    onChange={(e) => {
                      setVoucherType(e.target.value);
                      setProfit(
                        e.target.value === "wassce"
                          ? productProfit[0].wassceProfit
                          : e.target.value === "bece"
                          ? productProfit[0].beceProfit
                          : productProfit[0].csspsProfit
                      );
                    }}
                  >
                    <FormOption value={""}>Select Checker Type</FormOption>
                    <FormOption value={"cssps"}>School Placement</FormOption>
                    <FormOption value={"bece"}>BECE</FormOption>
                    <FormOption value={"wassce"}>WASSCE</FormOption>
                  </FormSelect>
                </SelectContainer>
              </FormRow>
              <FormRow>
                <Label>Choose Quantity</Label>
                <SelectContainer>
                  <FormSelect
                    required
                    disabled={voucherType === null || voucherType === ""}
                    onChange={(e) => {
                      setQuantity(parseFloat(e.target.value));
                      calcPrice(parseFloat(e.target.value));
                    }}
                  >
                    <FormOption value={1}>Select Quantity</FormOption>
                    <FormOption value={1}>
                      1 Checker - GHS
                      {`${setUnitCheckerPrice(voucherType) + profit}`}
                    </FormOption>
                    <FormOption value={10}>
                      10 Checkers - GH₵
                      {`${
                        (setBulkCheckerPrice(voucherType, 10) + profit) * 10
                      }`}{" "}
                      (GH₵
                      {`${setBulkCheckerPrice(voucherType, 10) + profit}`} for
                      One)
                    </FormOption>
                    <FormOption value={50}>
                      50 Checkers - GH₵
                      {`${
                        (setBulkCheckerPrice(voucherType, 50) + profit) * 50
                      }`}{" "}
                      (GH₵
                      {`${setBulkCheckerPrice(voucherType, 50) + profit}`} for
                      One)
                    </FormOption>
                  </FormSelect>
                </SelectContainer>
              </FormRow>
              <FormRow className="">
                <Label>
                  Phone Number<sup style={{ color: "red" }}>*</sup>
                </Label>
                <Input
                  className=" animate__animated animate__fadeIn"
                  pattern="[0-9]*"
                  required
                  type="text"
                  maxLength={10}
                  placeholder="Enter Phone Number"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormRow>
              <div
                style={{ marginTop: "30px" }}
                className="paystackBtnContainer"
              >
                <PaystackButton
                  className="paystack-button"
                  {...componentProps}
                />
                <div className="disabled-div" ref={paystackBtn}></div>
              </div>
            </ModalContent>
          </ModalContainer>
        </Modal>
      )}
    </>
  );
};

export default DigitalProductLink;
