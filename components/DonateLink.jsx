import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { desktop, mobile } from "../responsive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LinearProgress from "@mui/material/LinearProgress";
import { useDispatch } from "react-redux";

import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Skeleton,
  Typography,
  Button as MuiButton,
  Modal as MuiModal,
} from "@mui/material";
import { PaystackButton } from "react-paystack";
import { centerToast, topToast } from "../toast";
import {
  Button,
  InputTextarea,
  ModalContainer,
} from "../StyledComponents/common";
import { publicRequest } from "../requestMethods";
import Image from "next/legacy/image";
import ShowAllContributorsModal from "./ShowAllContributorsModal";
import { useReducer } from "react";
import donationServices from "../services/donationServices";
import clsx from "clsx";
import FullPageLoader from "./FullPageLoader";
import CheckmarkGif from "./Donate/CheckmarkGif";

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

const ModalTop = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const TopRight = styled.div``;
const CloseButton = styled.div`
  cursor: pointer;
`;

const ModalContent = styled.div`
  position: relative;
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
`;
const Divider = styled.hr`
  width: 100%;
  height: 2px;
  margin-bottom: 16px;
  color: #c9c9c9;
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
  width: 100%;
  width: ${(props) => (props.widthAuto ? "auto" : "100%")};
  height: 48px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 16px;
  border: none;
  &:focus {
    outline: none;
  }
`;

const LinearProgressContainer = styled.div`
  margin: 10px 0;
`;

const UserInfo = styled.div`
  display: none;
`;

const TargetAmount = styled.div`
  padding-bottom: 5px;
`;
const TargetAmountVal = styled.span``;

const AmountDonatedVal = styled.span`
  font-size: 22px;
  color: #d92727;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};

const DonateLink = ({ setDonateModalClose, onSucess, donationObj }) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0); // Remember, set in kobo!
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("support@nokofio.me");
  const [note, setNote] = useState("");
  const firstAmount = useRef();
  const secondAmount = useRef();
  const other = useRef();
  const otherAmountField = useRef();
  const firstAmountCheck = useRef();
  const secondAmountCheck = useRef();
  const otherCheck = useRef();
  const [donationProgress, setDonationProgress] = useState(0);
  const username = JSON.parse(
    localStorage.getItem("nokofioPublicProfile")
  )?.username;
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  const [anonymous, setAnonymous] = useState(false);
  const userInfoSection = useRef();
  const donateBtn = useRef();
  const [donationTargetObj, setDonationTargetObj] = useState({});

  const [state, updateState] = useReducer(
    (state, newState) => {
      const updatedState = { ...state, ...newState };

      return updatedState;
    },
    {
      loadingContributors: false,
      allContributors: [],
      paymentMode: null,
      isPayingWithEcedi: false,
      openECediModal: false,
      isECediPaymentSuccessful: false,
      showECediPaymentSuccessful: false,
    }
  );

  const componentProps = {
    email: anonymous
      ? `anonymous.${username}@nokofio.me`
      : `${phone}.${username}@nokofio.me`,
    amount: amount * 100,
    phone,
    currency: "GHS",
    metadata: {
      senderName: anonymous ? "anonymous" : name,
      senderPhoneNumber: anonymous ? "anonymous" : phone,
      transactionType: "donation",
      receiverUsername: username,
      anonymous: anonymous,
      note: anonymous ? "" : String(note),
      donationId: donationObj.id,
    },
    publicKey,
    text: "Donate",
    onSuccess: () => onSucessPayStack(),
    //onClose: () => onClosePayStack(),
  };

  const onSucessPayStack = () => {
    setDonateModalClose(true);
    centerToast("success", "Congrats", "Thank you for supporting");
  };

  const chooseAmount = (amount) => {
    switch (amount) {
      case "firstAmount":
        firstAmount.current.classList.add("selected_button");
        secondAmount.current.classList.remove("selected_button");
        if (donationObj?.allowCustomAmount) {
          other.current.classList.remove("selected_button");
          otherAmountField.current.classList.remove("selected_input");
          otherAmountField.current.value = donationObj.amount1;
          otherCheck.current.style.display = "none";
          other.current.classList.remove("d-none");
          otherAmountField.current.classList.add("d-none");
        }
        firstAmountCheck.current.style.display = "block";
        secondAmountCheck.current.style.display = "none";
        setAmount(donationObj.amount1);
        break;

      case "secondAmount":
        firstAmount.current.classList.remove("selected_button");
        secondAmount.current.classList.add("selected_button");
        if (donationObj?.allowCustomAmount) {
          otherAmountField.current.value = donationObj.amount2;
          other.current.classList.remove("selected_button");
          otherAmountField.current.classList.remove("selected_input");
          otherCheck.current.style.display = "none";
          other.current.classList.remove("d-none");
          otherAmountField.current.classList.add("d-none");
        }
        secondAmountCheck.current.style.display = "block";
        firstAmountCheck.current.style.display = "none";
        setAmount(donationObj.amount2);
        break;

      case "other":
        setAmount(null);
        otherAmountField.current.value = "";
        firstAmount.current.classList.remove("selected_button");
        secondAmount.current.classList.remove("selected_button");
        otherAmountField.current.classList.add("selected_input");
        otherAmountField.current.focus();
        otherAmountField.current.classList.remove("d-none");
        otherCheck.current.style.display = "block";
        firstAmountCheck.current.style.display = "none";
        secondAmountCheck.current.style.display = "none";

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
      setName("");
      setPhone("");
      setEmail("");
      setNote("");
    } else {
      setName("");
      setPhone("");
      setNote("");
      userInfoSection.current.style.display = "block";
    }
  };

  async function payWithEcedi(walletId) {
    try {
      updateState({ isPayingWithEcedi: true });
      const payload = {
        receiverUsername: username,
        senderPhoneNumber: phone,
        amount: amount,
        donationId: donationObj.id,
        sender: anonymous ? "anonymous" : name,
        walletId,
      };

      const res = await donationServices.payWithECedi(payload);
      if (res.status === 200) {
        updateState({
          isECediPaymentSuccessful: true,
          showECediPaymentSuccessful: true,
        });
      }
      console.log(res);
    } catch (error) {
      console.log(error);

      topToast("error", "Error", "Something went wrong");
    } finally {
      updateState({ isPayingWithEcedi: false });
    }
  }

  function isFormValid() {
    return (
      (amount && anonymous && !name && !phone) ||
      (amount && !anonymous && name && phone)
    );
  }

  useEffect(() => {
    const validateForm = () => {
      if (amount && anonymous && !name && !phone) {
        donateBtn.current.style.display = "none";
      } else if (amount && !anonymous && name && phone) {
        donateBtn.current.style.display = "none";
      } else if (state.isPayingWithEcedi) {
        donateBtn.current.style.display = "block";
      } else {
        donateBtn.current.style.display = "block";
      }
    };
    validateForm();
  }, [amount, anonymous, name, phone, email, note, state.isPayingWithEcedi]);

  useEffect(() => {
    if (anonymous) {
      userInfoSection.current.style.display = "none";
    } else {
      userInfoSection.current.style.display = "block";
    }
  }, []);

  useEffect(() => {
    if (donationObj?.makeTargetAmountPublic) {
      const progress =
        (donationObj?.totalDonatedAmount * 100) / donationObj?.targetAmount;
      setDonationProgress(progress);
    }
  }, [donationObj]);

  return (
    <>
      <ECediModal
        openECediModal={state.openECediModal}
        onECediModalClose={() => {
          updateState({
            openECediModal: false,
            showECediPaymentSuccessful: false,
          });
        }}
        onPayECediSubmit={(walletId) => {
          payWithEcedi(walletId);
        }}
        isPayingWithEcedi={state.isPayingWithEcedi}
        isECediPaymentSuccessful={state.isECediPaymentSuccessful}
        showECediPaymentSuccessful={state.showECediPaymentSuccessful}
      />
      <Modal>
        <ModalContainer>
          <ModalTop>
            <TopRight>
              <CloseButton>
                <CancelIcon
                  onClick={() => {
                    setDonateModalClose(true);
                  }}
                />
              </CloseButton>
            </TopRight>
          </ModalTop>
          <ModalContent>
            <Title>{donationObj?.title}</Title>
            <SubText>{donationObj?.description}</SubText>
            {donationObj?.makeTargetAmountPublic &&
            donationObj?.targetAmount ? (
              <>
                <LinearProgressContainer>
                  <LinearProgress
                    variant="determinate"
                    value={donationProgress}
                    color="inherit"
                    sx={{
                      height: "10px",
                      borderRadius: "5px",
                      backgroundColor: "white",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "green",
                      },
                    }}
                  />
                </LinearProgressContainer>
                {donationObj?.makeTargetAmountPublic ? (
                  <TargetAmount className="animate__animated animate__fadeIn">
                    <AmountDonatedVal>
                      {"GH₵"}
                      {parseFloat(
                        donationObj?.totalDonatedAmount ?? 0
                      ).toLocaleString("en-US") || 0}{" "}
                    </AmountDonatedVal>
                    <span style={{ fontSize: "14px" }}> raised out of </span>
                    <TargetAmountVal>
                      {"GH₵"}
                      {parseFloat(donationObj?.targetAmount).toLocaleString(
                        "en-US"
                      )}
                    </TargetAmountVal>
                  </TargetAmount>
                ) : null}
              </>
            ) : null}
            <Divider></Divider>
            <Label>Choose amount</Label>
            <DivRow>
              <ColumnButton
                ref={firstAmount}
                onClick={() => chooseAmount("firstAmount")}
              >
                <FloatIcon ref={firstAmountCheck}>
                  <CheckCircleIcon
                    sx={{
                      fontSize: 30,
                    }}
                  />
                </FloatIcon>
                ₵ {donationObj.amount1}
              </ColumnButton>
              <ColumnButton
                ref={secondAmount}
                onClick={() => chooseAmount("secondAmount")}
              >
                <FloatIcon ref={secondAmountCheck}>
                  <CheckCircleIcon sx={{ fontSize: 30 }} />
                </FloatIcon>
                ₵ {donationObj?.amount2}
              </ColumnButton>
              {donationObj?.allowCustomAmount ? (
                <ColumnButton ref={other} onClick={() => chooseAmount("other")}>
                  <FloatIcon ref={otherCheck}>
                    <CheckCircleIcon
                      sx={{
                        fontSize: 30,
                      }}
                    />
                  </FloatIcon>
                  Other
                </ColumnButton>
              ) : null}
            </DivRow>
            <FormRow>
              <Input
                className="d-none animate__animated animate__fadeIn"
                inputMode="decimal"
                pattern="^\d+(\.\d{1,2})?$"
                title="Please enter a valid decimal number (e.g., 1.5, 1.50)"
                ref={otherAmountField}
                required
                max={500000}
                type="text"
                maxLength={7}
                placeholder="Enter Amount"
                onChange={(e) => setAmount(parseFloat(e.target.value))}
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
                      placeholder="Enter your preferred name"
                      maxLength={20}
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
                      type="text"
                      maxLength={10}
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
                  maxLength={200}
                  placeholder="Enter short message"
                  onChange={(e) => setNote(e.target.value)}
                />
              </FormRow>
            </UserInfo>
            {donationObj?.allowAnonymous ? (
              <FormRow>
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
              </FormRow>
            ) : null}

            <div className="paystackBtnContainer">
              <PaystackButton className="paystack-button" {...componentProps} />
              <div className={clsx("disabled-div")} ref={donateBtn}></div>
            </div>

            {donationObj?.showContributors ? (
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
                  <>
                    {donationObj?.contributors?.length > 0 ? (
                      <>
                        {donationObj?.contributors
                          .slice(0, 3)
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
                                >
                                  {contributor.senderName}
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
                          ))}
                        <Box>
                          <ShowAllContributorsModal
                            contributors={donationObj?.contributors}
                          />
                        </Box>
                      </>
                    ) : null}
                  </>
                )}
              </Box>
            ) : null}
          </ModalContent>
        </ModalContainer>
      </Modal>
    </>
  );
};

function ECediModal({
  openECediModal,
  onECediModalClose,
  onPayECediSubmit,
  isPayingWithEcedi,
  isECediPaymentSuccessful,
  showECediPaymentSuccessful,
}) {
  const [walletId, setWalletId] = useState("");
  return (
    <>
      <MuiModal open={openECediModal}>
        <Box sx={style}>
          {isPayingWithEcedi ? (
            <>
              <FullPageLoader fullPageLoaderMsg={"Processing"} />
            </>
          ) : null}
          {isECediPaymentSuccessful && showECediPaymentSuccessful ? (
            <>
              <CheckmarkGif />

              <Typography
                variant="body1"
                fontWeight={"bold"}
                textAlign={"center"}
              >
                Payment Successful
              </Typography>
              <Button
                onClick={() => {
                  onECediModalClose();
                  setWalletId("");
                }}
                style={{
                  marginTop: "20px",
                  width: "100%",
                  padding: "15px 10px",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                Okay
              </Button>
            </>
          ) : null}

          {!isPayingWithEcedi && !showECediPaymentSuccessful ? (
            <>
              <ModalTop>
                <TopRight>
                  <CloseButton>
                    <CancelIcon
                      onClick={() => {
                        onECediModalClose();
                        setWalletId("");
                      }}
                    />
                  </CloseButton>
                </TopRight>
              </ModalTop>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormRow>
                    <Label>Enter Wallet ID</Label>
                    <Input
                      value={walletId}
                      onChange={(e) => setWalletId(e.target.value)}
                      type="text"
                      maxLength={10}
                      placeholder="Enter your wallet ID"
                    />
                  </FormRow>
                </Grid>
              </Grid>

              <Button
                onClick={() => {
                  onPayECediSubmit(walletId);
                }}
                style={{
                  marginTop: "20px",
                  width: "100%",
                  padding: "15px 10px",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
                disabled={isPayingWithEcedi || !walletId}
              >
                Pay
                {isPayingWithEcedi ? (
                  <div className="spinner-border spinner-border-sm ms-2"></div>
                ) : null}
              </Button>
            </>
          ) : null}
        </Box>
      </MuiModal>
    </>
  );
}

export default DonateLink;
