import { CircularProgress, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { mobile, sm, tablet } from "../responsive";
import { forgotPassword, login } from "../redux/apiCalls";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { publicRequest } from "../requestMethods";
import { centerToast } from "../toast";

const Container = styled.div`
  width: 400px;
  margin: 0 auto;
  margin-top: 111px;
  ${mobile({ width: "100%", padding: "0 24px", marginTop: "50px" })}
  ${tablet({ width: "400px", padding: "0 24px" })}
`;
const LogoContainer = styled.div`
  text-align: center;
`;
const Heading = styled.div`
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 1px;
  margin-top: 0px;
`;
const SubHeading = styled.div`
  font-size: 16px;
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
const UsernameInput = styled.input`
  padding: 12px 14px 12px 14px;
  width: 100%;
  height: 48px;
  background: #f5f5f5;
  border-radius: 0px 8px 8px 0px;
  border: none;
  &:focus {
    outline: none;
  }
`;
const InnerField = styled.div`
  border-radius: 8px;
  margin-right: -14px;
  padding-left: 14px;
  background: #f5f5f5;
  padding-top: 12px;
  padding-bottom: 12px;
  z-index: 2;
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

const FieldRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const CheckBoxContainer = styled.div`
  margin-right: 8px;
`;
const CheckBox = styled.input``;

const Button = styled.button`
  padding: 15px 24px;
  background-color: #000000;
  color: #ffffff;
  width: 100%;
  border: none;
  border-radius: 8px;
  margin: 24px 0;
  cursor: pointer;
`;
const SmallText = styled.span`
  font-size: 12px;
`;
const DivText = styled.div`
  font-size: 12px;
  color: #058cc6;
`;
const SignUpText = styled.div`
  font-size: 14px;
  text-align: center;
`;
const SpanText = styled.a`
  font-size: 14px;
  color: #058cc6;
  text-decoration: none;
`;

const SeePassword = styled.div`
  cursor: pointer;
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  z-index: 99;
`;
const PasswordField = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ResetPassword = () => {
  const email = useRef();
  const error = useSelector((state) => state.user.error);
  const errorMessage = useSelector((state) => state.user.errorMessage);
  const [isRegistering, setIsRegistering] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      setIsRegistering(true);
      const res = await publicRequest.post(`/auth/passwordreset`, {
        email: email.current.value,
      });
      if (res.status === 200) {
        centerToast("success", null, res.data.message);
        setIsRegistering(false);
      }
    } catch (error) {
      if (error.response.status === 422) {
        Toast.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      } else {
        Toast.fire({
          icon: "error",
          title: `${
            error?.response?.data?.message
              ? error?.response?.data?.message
              : "Something went wrong"
          }`,
        });
      }
      setIsRegistering(false);
    }
  };
  useEffect(() => {
    if (error) {
      Toast.fire({
        icon: "error",
        title: `${errorMessage}`,
      });
    }
  }, [error, Toast, errorMessage]);

  return (
    <Container className="animate__animated animate__fadeIn">
      <LogoContainer>
        <AppLogo src="/images/logo-alone.png" width={60} />{" "}
      </LogoContainer>
      <Heading>Forget Password</Heading>
      <SubHeading>Enter email to reset your password!</SubHeading>
      <Form onSubmit={handleClick}>
        <FormRow>
          <FormRow>
            <Label>Email</Label>
            <Input
              type="email"
              ref={email}
              required
              placeholder="Enter email"
            />
          </FormRow>
          <FormRow>
            <Button type="submit">
              {isRegistering ? (
                <CircularProgress color="info" size={20} />
              ) : (
                <Typography>Send</Typography>
              )}
            </Button>
          </FormRow>
        </FormRow>
      </Form>

      <SignUpText>
        Remember your password? <SpanText href="/login">Login</SpanText>{" "}
      </SignUpText>
    </Container>
  );
};

export default ResetPassword;
