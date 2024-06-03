import { useRef, useState } from "react";
import styled from "styled-components";
import { mobile, tablet } from "../../responsive";
import { publicRequest } from "../../requestMethods";

import CircularProgress from "@mui/material/CircularProgress";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Swal from "sweetalert2";
import { Box, Modal, Typography } from "@mui/material";
import { Spacer } from "../../StyledComponents/common";
import TermsAndAgreement from "../../components/TermsAndAgreement";
import Link from "next/link";
import { LabelSpan } from "../builder/bio";

const Container = styled.div`
  width: 400px;
  margin: 0 auto;
  margin-top: 100px;
  ${mobile({ width: "100%", padding: "0 24px", marginTop: "50px" })}
  ${tablet({ width: "400px", padding: "0 24px" })}
`;
const LogoContainer = styled.div`
  text-align: center;
`;
const Heading = styled.div`
  margin-top: 0px;
  text-align: center;
  font-size: 30px;
  ${mobile({ fontSize: "24px" })}
  font-weight: 600;
  margin-bottom: 12px;
`;
const SubHeading = styled.div`
  font-size: 16px;
  ${mobile({ fontSize: "14px" })}
  font-weight: 400;
  text-align: center;
`;

const AppLogo = styled.img``;
const Form = styled.form``;
const FormRow = styled.div`
  margin-bottom: 15px;
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
  border-radius: 8px;
  border: none;
  &:focus {
    outline: none;
  }
`;
const InnerField = styled.div`
  margin-right: -14px;
  padding-left: 14px;
  background: #f5f5f5;
  padding-top: 12px;
  padding-bottom: 12px;
  z-index: 2;
  border-radius: 8px;
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
`;
const CheckBoxContainer = styled.div`
  margin-right: 8px;
`;
const CheckBox = styled.input`
  cursor: pointer;
  width: 18px;
  height: 18px;
  padding: 50;
`;
const ConfirmText = styled.div`
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
`;
const LearnMoreText = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
`;
const Button = styled.button`
  padding: 15px 24px;
  background-color: #000000;
  color: #ffffff;
  width: 100%;
  border: none;
  border-radius: 8px;
  margin: 10px 0;
  cursor: pointer;
`;
const SignInText = styled.div`
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

const ModalWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400;
  background: #f5f5f5;
  border: 2px solid #000;
  box-shadow: 24;
  padding: 4px;
  max-height: 70vh;
  overflow-y: scroll;
`;

const Register = () => {
  const email = useRef();
  const phoneNumber = useRef();
  const username = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const agreement = useRef();
  const [inputType, setInputType] = useState("password");

  const [isRegistering, setIsRegistering] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

    setIsRegistering(true);
    if (password.current.value !== passwordAgain.current.value) {
      Toast.fire({
        icon: "error",
        title: "Passwords do not match",
      });
      setIsRegistering(false);
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
        phoneNumber: phoneNumber.current.value,
        platform: "WEB",
      };
      try {
        const res = await publicRequest.post("/auth/signup", user);
        if (res.status === 200) {
          Toast.fire({
            icon: "success",
            title: "User registered successfully",
          });
          setIsRegistering(false);
          // const emailVerifyRes = await publicRequest.post(
          //   "/auth/verify/verificationToken",
          //   { email: email.current.value }
          // );
          location.href = "/builder";
        }
      } catch (error) {
        if (error.response.status === 422) {
          Toast.fire({
            icon: "error",
            title: `${error.response.data.errors}`,
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
    }
  };

  const removeSpaces = (e) => {
    e.target.value = e.target.value.replace(/\s/g, "");
    if (isNaN(e.target.value)) {
      e.target.value = e.target.value.toLowerCase();
    }
  };

  const togglePassword = () => {
    inputType === "password" ? setInputType("text") : setInputType("password");
  };

  return (
    <Container className="animate__animated animate__fadeIn">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalWrapper>
          <TermsAndAgreement />
        </ModalWrapper>
      </Modal>
      <Link href="/" legacyBehavior>
        <LogoContainer style={{ cursor: "pointer" }}>
          <AppLogo src="/images/logo-alone.png" width={60} />
        </LogoContainer>
      </Link>
      <Heading>Get a nokofio account</Heading>
      <SubHeading>Get a free account</SubHeading>
      <Form onSubmit={handleClick}>
        <FormRow>
          <Label>
            Username{" "}
            <LabelSpan>
              (No spaces and special characters like @#$%&*)
            </LabelSpan>{" "}
          </Label>
          <FieldRow>
            <InnerField>nokofio.me/</InnerField>
            <UsernameInput
              ref={username}
              required
              placeholder="username"
              maxLength="15"
              onChange={(e) => {
                removeSpaces(e);
              }}
            />
          </FieldRow>
        </FormRow>
        <FormRow>
          <Label>Email</Label>
          <Input type="email" ref={email} required placeholder="Enter email" />
        </FormRow>
        <FormRow>
          <Label>Phone number</Label>
          <Input
            type="text"
            maxLength={10}
            ref={phoneNumber}
            onChange={(e) => {
              removeSpaces(e);
            }}
            required
            placeholder="Enter phone number"
          />
        </FormRow>
        <FormRow>
          <Label>Password</Label>
          <PasswordField>
            <Input
              type={inputType}
              ref={password}
              required
              minLength={6}
              placeholder="Enter password"
            />
            <SeePassword>
              {inputType === "password" ? (
                <VisibilityIcon onClick={togglePassword} />
              ) : (
                <VisibilityOffIcon onClick={togglePassword} />
              )}
            </SeePassword>
          </PasswordField>
        </FormRow>
        <FormRow>
          <Label>Confirm Password</Label>
          <PasswordField>
            <Input
              type={inputType}
              ref={passwordAgain}
              minLength={6}
              required
              placeholder="Confirm password"
            />
            <SeePassword>
              {inputType === "password" ? (
                <VisibilityIcon onClick={togglePassword} />
              ) : (
                <VisibilityOffIcon onClick={togglePassword} />
              )}
            </SeePassword>
          </PasswordField>
        </FormRow>
        <FormRow>
          <FieldRow>
            <CheckBoxContainer>
              <CheckBox ref={agreement} required type="checkbox" />
            </CheckBoxContainer>

            <ConfirmText>
              By creating an account you are agreeing to our Terms and
              Conditions and Privacy Policy
            </ConfirmText>
            {/* <Link
              href={
                "https://docs.google.com/document/d/1d3dVuMh4uYEDoZ6mXLbUx1vjlXfl3hFfiVNNh5pHRwE/edit?usp=sharing"
              }
            ><LearnMoreText> Learn More </LearnMoreText>
            </Link> */}
          </FieldRow>
        </FormRow>
        <FormRow>
          <Button type="submit">
            {isRegistering ? (
              <CircularProgress color="info" size={20} />
            ) : (
              <Typography>Create Account</Typography>
            )}
          </Button>
        </FormRow>
      </Form>
      <SignInText>
        Already have an account? <SpanText href="/login">Log in</SpanText>{" "}
      </SignInText>
      <Spacer height={30} />
    </Container>
  );
};

export default Register;
