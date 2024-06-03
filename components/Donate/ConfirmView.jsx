import { Typography } from "@mui/material";
import axios from "axios";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  showConfirmView,
  showFailedView,
  showLoadingView,
  showSuccessView,
} from "../../redux/donationViewsRedux";
import { mobile, tablet } from "../../responsive";
import { Spacer } from "../../StyledComponents/common";
import { API_URL_V1 } from "../../helpers/constants";
const Container = styled.div`
  width: 400px;
  margin: 0 auto;
  ${mobile({ width: "100%", padding: "0 24px" })}
  ${tablet({ width: "400px", padding: "0 24px" })}
`;

const SubHeading = styled.div`
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  margin-bottom: 32px;
`;

const ListWrapper = styled.div`
  border: 1px solid black;
  border-radius: 3px;
  padding: 10px;
  margin: 15px 0;
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

const ConfirmList = styled.ul`
  & > li {
    font-size: 13px;
  }
`;
const ConfirmText = styled.p`
  text-align: center;
  padding: 10px;
`;

const ConfirmView = () => {
  const dispatch = useDispatch();
  const referenceInStore = useSelector(
    (state) => state.donationViews.donationObject.reference
  );
  const instructions = useRef();
  const enterPin = useRef();

  const handleClick = () => {
    dispatch(showLoadingView(true));
    var data = "";
    var config = {
      method: "get",
      url: `${API_URL_V1}/transactions/verify?reference=${referenceInStore}`,
      headers: {},
      data: data,
    };
    axios(config)
      .then(function (response) {
        let data = response.data;
        if (data.results.status === "success") {
          dispatch(showLoadingView(false));
          dispatch(showConfirmView(false));
          dispatch(showSuccessView(true));
        } else if (data.results.status === "ongoing") {
          dispatch(showLoadingView(false));
          // dispatch(showLoadingView(false));
          enterPin.current.style.display = "none";
          instructions.current.style.display = "block";
        } else {
          dispatch(showConfirmView(false));
          dispatch(showLoadingView(false));
          dispatch(showFailedView(true));
        }
      })
      .catch(function (error) {
        dispatch(showLoadingView(false));
      });
  };

  return (
    <>
      <Container>
        <Spacer height={40} />

        <ListWrapper>
          <div style={{ display: "none" }} ref={instructions}>
            <SubHeading>Follow the steps to confirm payment</SubHeading>
            <ConfirmList>
              <li>Dial *170#</li>
              <li>Choose Option 6: Wallet</li>
              <li>Choose Option 3: My approvals</li>
              <li>
                Enter your MOMO Pin to retrieve your pending approval list
              </li>
              <li>Choose a pending transaction</li>
              <li>Choose option 1 to approve</li>
              <li>Tap button to continue</li>
            </ConfirmList>
          </div>

          <ConfirmText ref={enterPin}>
            Please complete the authorisation process by inputting your PIN on
            your mobile device
          </ConfirmText>
        </ListWrapper>
        <Button onClick={handleClick} type="submit">
          <Typography>Confirm</Typography>
        </Button>
      </Container>
    </>
  );
};

export default ConfirmView;
