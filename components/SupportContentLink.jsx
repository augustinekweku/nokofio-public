import styled from "styled-components";
import { useState, useRef, useReducer } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { desktop, mobile } from "../responsive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { PaystackButton } from "react-paystack";
import { centerToast } from "../toast";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { removeSpaces } from "../helpers";
import Image from "next/legacy/image";
import ShowAllContributorsModal from "./ShowAllContributorsModal";
import supportMyContentServices from "../services/supportMyContentServices";

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

const SupportContentLink = ({
  setClose,
  onContributionSucess,
  supportMeObj,
}) => {
  const [open, setOpen] = useState(false);

  const username = JSON.parse(
    localStorage.getItem("nokofioPublicProfile")
  )?.username;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("support@nokofio.me");
  const [amountToDonate, setAmountToDonate] = useState(null);
  const [note, setNote] = useState("");
  const firstAmount = useRef();
  const secondAmount = useRef();
  const other = useRef();
  const otherAmountField = useRef();
  const firstAmountCheck = useRef();
  const secondAmountCheck = useRef();
  const otherCheck = useRef();
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  const [anonymous, setAnonymous] = useState(false);
  const userInfoSection = useRef();
  const paystackBtn = useRef();
  const [state, updateState] = useReducer(
    (state, newState) => {
      const updatedState = { ...state, ...newState };

      return updatedState;
    },
    {
      loadingContributors: false,
      allContributors: [],
    }
  );

  const handleOpen = () => {
    setOpen(true);
  };
  const componentProps = {
    email: anonymous
      ? `anonymous.${username}@nokofio.me`
      : `${phone}.${username}@nokofio.me`,
    amount: amountToDonate * 100,
    phone,
    currency: "GHS",
    metadata: {
      senderName: anonymous ? "anonymous" : name,
      senderPhoneNumber: anonymous ? "anonymous" : phone,
      transactionType: "generalPayment",
      receiverUsername: username,
      anonymous: anonymous,
      note: anonymous ? "" : String(note),
      supportMeAmountId: supportMeObj?.id,
    },
    publicKey,
    text: "Pay",
    onSuccess: () => onPaymentSuccess(),
    // onClose: () => onClosePayStack(),
  };

  const onPaymentSuccess = () => {
    centerToast("success", "Congrats", "Thank you for supporting");
    onContributionSucess();
  };
  // const onClosePayStack = () => {
  //   setOpen(false);
  //   centerToast("question", "Are you done", "Please check if you are done");
  // };

  const isPhoneNumberValid = (phoneNumber) => {
    const reg = /^[0-9\b]{10}$/;
    if (reg.test(phoneNumber)) return true;
    return false;
  };

  const chooseAmount = (amount) => {
    switch (amount) {
      case "firstAmount":
        firstAmount.current.classList.add("selected_button");
        secondAmount.current.classList.remove("selected_button");
        other.current.classList.remove("selected_button");
        otherAmountField.current.classList.remove("selected_input");
        otherAmountField.current.value = supportMeObj.amount1;
        firstAmountCheck.current.style.display = "block";
        secondAmountCheck.current.style.display = "none";
        otherCheck.current.style.display = "none";
        setAmountToDonate(supportMeObj.amount1);
        other.current.classList.remove("d-none");
        otherAmountField.current.classList.add("d-none");
        break;

      case "secondAmount":
        otherAmountField.current.value = supportMeObj.amount2;
        firstAmount.current.classList.remove("selected_button");
        secondAmount.current.classList.add("selected_button");
        other.current.classList.remove("selected_button");
        otherAmountField.current.classList.remove("selected_input");
        secondAmountCheck.current.style.display = "block";
        firstAmountCheck.current.style.display = "none";
        otherCheck.current.style.display = "none";
        setAmountToDonate(supportMeObj.amount2);
        other.current.classList.remove("d-none");
        otherAmountField.current.classList.add("d-none");
        break;

      case "other":
        setAmountToDonate(null);
        otherAmountField.current.value = "";
        firstAmount.current.classList.remove("selected_button");
        secondAmount.current.classList.remove("selected_button");
        other.current.classList.add("selected_button");
        otherAmountField.current.classList.add("selected_input");
        otherCheck.current.style.display = "block";
        firstAmountCheck.current.style.display = "none";
        otherAmountField.current.focus();
        secondAmountCheck.current.style.display = "none";
        otherAmountField.current.classList.remove("d-none");
        break;

      default:
        break;
    }
  };

  const handleClose = () => {
    setOpen(false);
    setAnonymous(true);
  };
  const handleChange = (e) => {
    setAnonymous(e.target.checked);
    if (e.target.checked === true) {
      userInfoSection.current.style.display = "none";
      setName(null);
      setPhone(null);
      setEmail(null);
      setNote(null);
    } else {
      setName(null);
      setPhone(null);
      setNote(null);
      userInfoSection.current.style.display = "block";
    }
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //   }, 2000);
  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    const validateForm = () => {
      if (amountToDonate && anonymous && !name && !phone) {
        paystackBtn.current.style.display = "none";
      } else if (
        amountToDonate &&
        !anonymous &&
        name &&
        phone &&
        isPhoneNumberValid(phone)
      ) {
        paystackBtn.current.style.display = "none";
      } else {
        paystackBtn.current.style.display = "block";
      }
    };
    validateForm();
  }, [amountToDonate, anonymous, name, phone, email, note]);

  useEffect(() => {
    if (anonymous) {
      userInfoSection.current.style.display = "none";
    } else {
      userInfoSection.current.style.display = "block";
    }
  }, []);

  // useEffect(() => {
  //   async function getAllContributors() {
  //     try {
  //       const { data } = await supportMyContentServices.getContributors(
  //         username
  //       );
  //       updateState({
  //         allContributors: data.results.data,
  //       });
  //     } catch (error) {
  //     } finally {
  //       updateState({
  //         loadingContributors: false,
  //       });
  //     }
  //   }
  //   getAllContributors();
  // }, [username]);

  return (
    <>
      <Modal>
        <ModalContainer>
          <ModalTop>
            <TopRight>
              <CloseButton>
                <CancelIcon
                  onClick={() => {
                    setClose(true);
                  }}
                />
              </CloseButton>
            </TopRight>
          </ModalTop>
          <ModalContent>
            <Title>{supportMeObj?.title}</Title>
            <SubText>{supportMeObj?.description}</SubText>
            <Divider></Divider>
            <Label>Choose amount</Label>
            <DivRow>
              <ColumnButton
                ref={firstAmount}
                onClick={() => chooseAmount("firstAmount")}
              >
                <FloatIcon ref={firstAmountCheck}>
                  <CheckCircleIcon sx={{ fontSize: 30 }} />
                </FloatIcon>
                ₵{supportMeObj?.amount1}
              </ColumnButton>
              <ColumnButton
                ref={secondAmount}
                onClick={() => chooseAmount("secondAmount")}
              >
                <FloatIcon ref={secondAmountCheck}>
                  <CheckCircleIcon sx={{ fontSize: 30 }} />
                </FloatIcon>
                ₵{supportMeObj?.amount2}
              </ColumnButton>
              <ColumnButton ref={other} onClick={() => chooseAmount("other")}>
                <FloatIcon ref={otherCheck}>
                  <CheckCircleIcon sx={{ fontSize: 30 }} />
                </FloatIcon>
                Other
              </ColumnButton>
            </DivRow>
            <FormRow className="">
              <Input
                className="d-none animate__animated animate__fadeIn"
                inputMode="decimal"
                pattern="^\d+(\.\d{1,2})?$"
                title="Please enter a valid decimal number (e.g., 1.5, 1.50)"
                ref={otherAmountField}
                required
                type="text"
                max={500000}
                maxLength={7}
                placeholder="Enter Amount..."
                onChange={(e) => setAmountToDonate(parseFloat(e.target.value))}
              />
            </FormRow>
            <UserInfo
              className="animate__animated animate__fadeIn"
              ref={userInfoSection}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormRow>
                    <Label>
                      Name{" "}
                      <span>
                        <sup style={{ color: "red" }}>*</sup>
                      </span>
                    </Label>
                    <Input
                      required
                      type="text"
                      value={name}
                      placeholder="Enter your preferred name"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormRow>
                </Grid>
                <Grid item xs={6}>
                  <FormRow>
                    <Label>
                      Phone Number{" "}
                      <span>
                        <sup style={{ color: "red" }}>*</sup>
                      </span>
                    </Label>
                    <Input
                      pattern="[0-9]*"
                      required
                      value={phone}
                      type="text"
                      maxLength={"10"}
                      placeholder="Enter your number"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </FormRow>
                </Grid>
              </Grid>

              <FormRow style={{ marginBottom: "30px" }}>
                <Label>Note (Optional)</Label>
                <Input
                  required
                  type="text"
                  value={note}
                  maxLength={"200"}
                  placeholder="Enter short message"
                  onChange={(e) => setNote(e.target.value)}
                />
              </FormRow>
            </UserInfo>
            <FormRow>
              {supportMeObj?.allowAnonymous ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{
                        color: "#000000e3",
                        "&.Mui-checked": {
                          color: "#000000e3",
                        },
                      }}
                      checked={anonymous}
                      onChange={(e) => handleChange(e)}
                    />
                  }
                  label="Anonymous"
                />
              ) : null}
            </FormRow>
            <div className="paystackBtnContainer">
              <PaystackButton className="paystack-button" {...componentProps} />
              <div className="disabled-div" ref={paystackBtn}></div>
            </div>
            {supportMeObj?.showContributors ? (
              <Box className="contributors-section" mt={2}>
                {state.loadingContributors ? (
                  <Box display={"flex"} alignItems={"center"} gap={1}>
                    <Skeleton
                      variant="circular"
                      width={40}
                      height={40}
                      animation="wave"
                    />
                  </Box>
                ) : (
                  supportMeObj?.contributors
                    ?.slice(0, 3)
                    .map((contributor, index) => (
                      <Box
                        key={index}
                        display={"flex"}
                        alignItems={"center"}
                        gap={1}
                        mb={1}
                      >
                        <Image
                          src="/images/svg/donate-heart.svg"
                          alt="donate-heart"
                          width={40}
                          height={40}
                        />
                        <Box>
                          <Typography
                            variant="body2"
                            component="h6"
                            className="donate-title"
                            textTransform={"capitalize"}
                          >
                            {contributor.senderName || "Anonymous"}
                          </Typography>
                          <Typography
                            color={"GrayText"}
                            variant="caption"
                            component="p"
                            className="donate-description"
                          >
                            GHS {contributor.amount}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                )}

                <Box>
                  <ShowAllContributorsModal
                    contributors={supportMeObj?.contributors}
                  />
                </Box>
              </Box>
            ) : null}
          </ModalContent>
        </ModalContainer>
      </Modal>
    </>
  );
};
export default SupportContentLink;
