import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import Modal from "@mui/material/Modal";
import CancelIcon from "@mui/icons-material/Cancel";
import { desktop, mobile } from "../../responsive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LinearProgress from "@mui/material/LinearProgress";
import { useDispatch, useSelector } from "react-redux";
import AddPhoneNumber from "./AddPhoneNumber";
import OtpView from "./OTPView";
import ClipLoader from "react-spinners/ClipLoader";
import { DivFlex, Spacer } from "../../StyledComponents/common";
import {
  clearDonationObject,
  setDonationObject,
  showAmountView,
  showConfirmView,
  showFailedView,
  showLoadingView,
  showNumberView,
  showOtpView,
  showSuccessView,
} from "../../redux/donationViewsRedux";
import ConfirmView from "./ConfirmView";
import FailedGif from "./FailedGif";
import FullPageLoader from "../FullPageLoader";
import styles from "../../styles/DonateLink.module.css";
import { Grid, Typography } from "@mui/material";
import CheckmarkGif from "./CheckmarkGif";

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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  position: relative;
`;
const Title = styled.div`
  font-family: Poppins;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 8px;
`;
const SubText = styled.div``;
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
  margin-bottom: 32px;
`;

const ColumnButton = styled.div`
  cursor: pointer;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  background: #2c2b2b;
  border-radius: 8px;
  padding: 12px 40px;
  color: #fff;
  /* ${mobile({ padding: "12px 20px", fontSize: "14px" })} */
  ${mobile({ fontSize: "12px", padding: "10px 18px" })}
  position: relative;
`;
const FloatIcon = styled.div`
  display: none;
  position: absolute;
  top: -9px;
  right: -5px;
`;

const FormRow = styled.div`
  margin-bottom: 20px;
`;
const Input = styled.input`
  /* font-family: Poppins; */
  padding: 12px 14px 12px 14px;
  width: 100%;
  height: 48px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 16px;
  border: none;
  margin-bottom: 20px;
  &:focus {
    outline: none;
  }
`;

const LinearProgressContainer = styled.div`
  margin: 10px 0;
`;

const DonateLink = ({ section, am }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [amount, setAmount] = useState(0); // Remember, set in kobo!
  const [amountToDonate, setAmountToDonate] = useState(null);
  const firstAmount = useRef();
  const secondAmount = useRef();
  const other = useRef();
  const otherAmountField = useRef();
  const firstAmountCheck = useRef();
  const secondAmountCheck = useRef();
  const otherCheck = useRef();
  const [donationProgress, setDonationProgress] = useState(0);
  const dispatch = useDispatch();

  const enterAmountView = useSelector(
    (state) => state.donationViews.enterAmountView
  );
  const enterNumberView = useSelector(
    (state) => state.donationViews.enterNumberView
  );
  const enterOTPView = useSelector((state) => state.donationViews.enterOtpView);
  const loadingView = useSelector((state) => state.donationViews.loadingView);
  const sucessView = useSelector((state) => state.donationViews.sucessView);
  const confirmView = useSelector((state) => state.donationViews.confirmView);
  const failedView = useSelector((state) => state.donationViews.failedView);

  const donationObject = JSON.parse(
    localStorage.getItem("nokofioProfile")
  )?.donation;

  const chooseAmount = (amount) => {
    switch (amount) {
      case "firstAmount":
        firstAmount.current.classList.add("selected_button");
        secondAmount.current.classList.remove("selected_button");
        other.current.classList.remove("selected_button");
        otherAmountField.current.classList.remove("selected_input");
        otherAmountField.current.value = donationObject.amount1;
        firstAmountCheck.current.style.display = "block";
        secondAmountCheck.current.style.display = "none";
        otherCheck.current.style.display = "none";
        setAmount(donationObject.amount1 * 100);
        break;

      case "secondAmount":
        otherAmountField.current.value = donationObject.amount2;
        firstAmount.current.classList.remove("selected_button");
        secondAmount.current.classList.add("selected_button");
        other.current.classList.remove("selected_button");
        otherAmountField.current.classList.remove("selected_input");
        secondAmountCheck.current.style.display = "block";
        firstAmountCheck.current.style.display = "none";
        otherCheck.current.style.display = "none";
        setAmount(donationObject.amount2 * 100);

        break;

      case "other":
        setAmountToDonate(null);
        otherAmountField.current.value = "";
        firstAmount.current.classList.remove("selected_button");
        secondAmount.current.classList.remove("selected_button");
        other.current.classList.add("selected_button");
        otherAmountField.current.classList.add("selected_input");
        otherAmountField.current.focus();
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
    dispatch(showAmountView(true));
    dispatch(showNumberView(false));
    dispatch(showConfirmView(false));
    dispatch(showFailedView(false));
    dispatch(showOtpView(false));
    dispatch(showSuccessView(false));
    dispatch(showLoadingView(false));
    dispatch(clearDonationObject());
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    dispatch(setDonationObject({ amount: amount }));
    dispatch(showAmountView(false));
    dispatch(showNumberView(true));
  };

  useEffect(() => {
    const calcDonationProgres = async () => {
      let amountDonated = 100;
      let progress = parseInt(
        (amountDonated / donationObject?.targetAmount) * 100
      );
      setDonationProgress(progress);
    };
    calcDonationProgres();
  }, [donationObject?.targetAmount]);

  useEffect(() => {
    if (section && am) {
      dispatch(setDonationObject({ amount: am * 100 }));
      dispatch(showAmountView(false));
      dispatch(showNumberView(true));
      setOpen(true);
    }
  }, [section, am, dispatch]);

  return (
    <Grid>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalContainer>
          <ModalTop>
            <TopRight>
              <CloseButton>
                <CancelIcon onClick={handleClose} />
              </CloseButton>
            </TopRight>
          </ModalTop>
          {donationObject?.targetAmount ? (
            <>
              <ModalContent>
                {enterAmountView && (
                  <>
                    <form onSubmit={handleDonate}>
                      <Title>{donationObject.title}</Title>
                      <SubText>{donationObject.description}</SubText>
                      <LinearProgressContainer>
                        <LinearProgress
                          variant="determinate"
                          value={donationProgress}
                          color="inherit"
                          sx={{ height: "10px", borderRadius: "5px" }}
                        />
                      </LinearProgressContainer>
                      <Divider></Divider>
                      <Label>Enter an amount</Label>
                      <DivRow>
                        <ColumnButton
                          ref={firstAmount}
                          onClick={() => chooseAmount("firstAmount")}
                        >
                          <FloatIcon ref={firstAmountCheck}>
                            <CheckCircleIcon sx={{ fontSize: 30 }} />
                          </FloatIcon>
                          GHS {donationObject.amount1}
                        </ColumnButton>
                        <ColumnButton
                          ref={secondAmount}
                          onClick={() => chooseAmount("secondAmount")}
                        >
                          <FloatIcon ref={secondAmountCheck}>
                            <CheckCircleIcon sx={{ fontSize: 30 }} />
                          </FloatIcon>
                          GHS {donationObject.amount2}
                        </ColumnButton>
                        <ColumnButton
                          ref={other}
                          onClick={() => chooseAmount("other")}
                        >
                          <FloatIcon ref={otherCheck}>
                            <CheckCircleIcon sx={{ fontSize: 30 }} />
                          </FloatIcon>
                          Other
                        </ColumnButton>
                      </DivRow>
                      <FormRow>
                        <Label>Other</Label>
                        <Input
                          pattern="[0-9]*"
                          ref={otherAmountField}
                          required
                          type="number"
                          placeholder="Enter Amount"
                          onChange={(e) =>
                            setAmount(parseFloat(e.target.value) * 100)
                          }
                        />
                      </FormRow>
                      <button type="submit" className={styles.paystack_button}>
                        <Typography>Pay</Typography>
                      </button>
                    </form>
                  </>
                )}
                {enterNumberView && <AddPhoneNumber />}
                {enterOTPView && <OtpView />}
                {confirmView && <ConfirmView />}
                {loadingView && <FullPageLoader iconSize={65} />}
                {sucessView && (
                  <>
                    <CheckmarkGif />
                    <DivFlex center style={{ textAlign: "center" }}>
                      Congrats! You have successfully donated
                    </DivFlex>
                    <Spacer height={40} />
                  </>
                )}
                {failedView && (
                  <>
                    <FailedGif />
                    <DivFlex center>
                      Sorry! Payment failed. Please try again
                    </DivFlex>
                    <Spacer height={40} />
                  </>
                )}
              </ModalContent>
            </>
          ) : (
            <>
              <div style={{ textAlign: "center", margin: "30px 0 80px 0" }}>
                <Title>No Donation set up by User</Title>
                <SubText>
                  User has not set up donation yet. <br /> Please check again
                  later.
                </SubText>
              </div>
            </>
          )}
        </ModalContainer>
      </Modal>
      <LinkCard onClick={handleOpen}>❤️ Donate </LinkCard>
    </Grid>
  );
};

export default DonateLink;
