import styled from "styled-components";
import { mobile, tablet } from "../../responsive";
import {
  DivFlex,
  FlexCol,
  FormOption,
  FormSelect,
  SelectContainer,
  Spacer,
} from "../../StyledComponents/common";
import { useDispatch, useSelector } from "react-redux";
import {
  setDonationObject,
  showConfirmView,
  showLoadingView,
  showNumberView,
  showOtpView,
} from "../../redux/donationViewsRedux";
import { useRef, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { API_URL_V1 } from "../../helpers/constants";

const Container = styled.div`
  width: 400px;
  margin: 0 auto;
  ${mobile({ width: "100%", padding: "0 24px" })}
  ${tablet({ width: "400px", padding: "0 24px" })}
`;
const LogoContainer = styled.div`
  text-align: center;
`;

const SubHeading = styled.div`
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  margin-bottom: 32px;
`;

const AppLogo = styled.img``;
const Form = styled.form``;
const FormRow = styled.div`
  margin-bottom: 20px;
`;
const Label = styled.div`
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 12px 14px 12px 14px;
  width: 100%;
  height: 48px;
  background: #f5f5f5;
  border-radius: 8px;
  border: none;
  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  padding: 15px 24px;
  background-color: #000000;
  color: #ffffff;
  width: 100%;
  border: none;
  border-radius: 8px;
  margin: 24px 0;
`;

const Donor = styled.p`
  margin-bottom: 0px;
  font-size: 12px;
  font-weight: 300;
`;
const AmountLabel = styled.span`
  font-size: 12px;
`;
const AmountValue = styled.h5`
  margin-bottom: 0px;
  font-size: 15px;
`;

const AddPhoneNumber = () => {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [mobileNetwork, setMobileNetwork] = useState("null");
  const amountInStore = useSelector((state) =>
    (state.donationViews.donationObject.amount / 100).toString()
  );
  const netwworkRef = useRef();

  const dispatch = useDispatch();
  const { username } = useParams();

  const handleClick = (e) => {
    dispatch(showLoadingView(true));
    e.preventDefault();
    dispatch(
      setDonationObject({
        mobile_money: { phone: phoneNumber, provider: mobileNetwork },
      })
    );

    let _referenceId = uuidv4();

    var data = JSON.stringify({
      //multiply by 100 to get actual amount for paystack
      amount: amountInStore * 100,
      email: `${phoneNumber}@nokofio.me`,
      reference: `${_referenceId}don`,
      currency: "GHS",
      metadata: { receiver: username },
      mobile_money: {
        phone: phoneNumber,
        provider: mobileNetwork,
      },
    });

    var donationTransactionData = JSON.stringify({
      reference: `${_referenceId}don`,
      senderPhoneNumber: phoneNumber,
      anonymous: true,
      amount: amountInStore,
      network: mobileNetwork,
      channel: "mobile_money",
      currency: "GHS",
      receiver: username,
    });

    saveDonationTransaction(donationTransactionData);

    var config = {
      method: "post",
      url: "https://api.paystack.co/charge",
      headers: {
        Authorization:
          "Bearer sk_live_d524ba7f68f36c714d6e7d5f5961dcf7f29ed8ec",
        "Content-Type": "application/json",
        Cookie:
          "sails.sid=s%3AMWMySmKtP-SyoDwXWR3sq_KWOl9BlAcL.UyiLny6KiItSfwsefmcjgGHLUM6fupzN8NjH857pEY8",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        let data = response.data;
        if (data.data.status === "send_otp") {
          dispatch(showNumberView(false));
          dispatch(showOtpView(true));
          dispatch(
            setDonationObject({
              reference: data.data.reference,
            })
          );
          dispatch(showLoadingView(false));
        } else {
          dispatch(
            setDonationObject({
              reference: data.data.reference,
            })
          );
          dispatch(showNumberView(false));
          dispatch(showConfirmView(true));
          dispatch(showLoadingView(false));
        }
      })
      .catch(function (error) {});
    // dispatch(showNumberView(false));
  };

  const setNumAndNetwork = (e) => {
    setPhoneNumber(e);
    if (
      e.startsWith("024") ||
      e.startsWith("054") ||
      e.startsWith("055") ||
      e.startsWith("025") ||
      e.startsWith("059")
    ) {
      netwworkRef.current.value = "mtn";
      setMobileNetwork("mtn");
    } else if (e.startsWith("020") || e.startsWith("050")) {
      netwworkRef.current.value = "vod";
      setMobileNetwork("vod");
    } else if (
      e.startsWith("027") ||
      e.startsWith("057") ||
      e.startsWith("026") ||
      e.startsWith("056")
    ) {
      netwworkRef.current.value = "tgo";
      setMobileNetwork("tgo");
    }
  };

  const saveDonationTransaction = (data) => {
    let config = {
      method: "post",
      url: `${API_URL_V1}/donation/transactions`,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        dispatch(showLoadingView(false));
      })
      .catch(function (error) {
        dispatch(showLoadingView(false));
      });
  };

  return (
    <>
      <Container>
        <DivFlex spaceBetween>
          <FlexCol>
            {" "}
            <LogoContainer>
              <AppLogo src="/images/Content.png" />
            </LogoContainer>
          </FlexCol>
          <FlexCol>
            <Donor>augustine.nani@gmail.com</Donor>
            <DivFlex alignCenter>
              {" "}
              <AmountLabel>Pay</AmountLabel>:{" "}
              <AmountValue>&nbsp; GHS {amountInStore}</AmountValue>
            </DivFlex>
          </FlexCol>
        </DivFlex>
        <Spacer height={40} />
        <SubHeading>
          Enter your mobile money number and provider to start the payment
        </SubHeading>
        <Form onSubmit={handleClick}>
          <FormRow>
            <Label>Phone Number</Label>
            <Input
              onChange={(e) => setNumAndNetwork(e.target.value)}
              required
              pattern="[0-9]*"
              type="text"
              placeholder="Enter number"
            />
          </FormRow>
          <FormRow>
            <Label>Mobile Network</Label>
            <SelectContainer>
              <FormSelect
                required
                onChange={(e) => setMobileNetwork(e.target.value)}
                ref={netwworkRef}
              >
                <FormOption value={""}>Choose Mobile Network</FormOption>
                <FormOption value={"mtn"}>MTN</FormOption>
                <FormOption value={"vod"}>Vodafone</FormOption>
                <FormOption value={"tgo"}>AirtelTigo</FormOption>
              </FormSelect>
            </SelectContainer>
          </FormRow>
          <FormRow>
            <Button type="submit">
              <Typography>Submit</Typography>{" "}
            </Button>
          </FormRow>
        </Form>
      </Container>
    </>
  );
};

export default AddPhoneNumber;
