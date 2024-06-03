import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  setDonationObject,
  showConfirmView,
  showLoadingView,
  showOtpView,
} from "../../redux/donationViewsRedux";
import { mobile, tablet } from "../../responsive";
import { DivFlex, FlexCol, Spacer } from "../../StyledComponents/common";

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

const ErrorMsg = styled.p`
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  margin-bottom: 32px;
  color: #c02020;
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

const OtpView = () => {
  const dispatch = useDispatch();
  const [otpNumber, setOtpNumber] = useState();
  const [errorMsg, setErrorMsg] = useState(null);
  const amountInStore = useSelector((state) =>
    (state.donationViews.donationObject.amount / 100).toString()
  );
  const otpRef = useSelector(
    (state) => state.donationViews.donationObject.reference
  );

  const handleClick = (e) => {
    dispatch(showLoadingView(true));
    e.preventDefault();
    var data = JSON.stringify({
      otp: otpNumber,
      reference: otpRef,
    });

    var config = {
      method: "post",
      url: "https://api.paystack.co/charge/submit_otp",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
        Cookie:
          "sails.sid=s%3ArIyTfMK5_jRSOEmP3e7Xmf32BvVHdVJ-.mQJJFPyYrvlf1AsxzUTe%2B%2BRhjcrDX0Lo4JdfxiO9SWo",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        let data = response.data;
        if (data.status === true) {
          dispatch(showLoadingView(false));
          dispatch(showOtpView(false));
          dispatch(
            setDonationObject({
              otpRef: data.data.reference,
            })
          );
          dispatch(showConfirmView(true));
        }
      })
      .catch(function (error) {
        dispatch(showLoadingView(false));
        setErrorMsg(error.response.data.message);
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
        <SubHeading>Enter your OTP number to authorize payment</SubHeading>
        <ErrorMsg>{errorMsg && errorMsg}</ErrorMsg>
        <Form onSubmit={handleClick}>
          <FormRow>
            <Label>OTP Number</Label>
            <Input
              required
              type="number"
              onChange={(e) => setOtpNumber(e.target.value)}
              placeholder="Enter number"
            />
          </FormRow>
          <FormRow>
            <Button type="submit">Submit</Button>
          </FormRow>
        </Form>
      </Container>
    </>
  );
};

export default OtpView;
