import { CircularProgress, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { desktop, mobile, tablet } from "../../responsive";
import { publicRequest } from "../../requestMethods";
import { Router, useRouter } from "next/router";

const Container = styled.div`
  width: 400px;
  margin: 0 auto;
  margin-top: 80px;
  ${mobile({ width: "100%", padding: "0 24px" })}
  ${tablet({ width: "400px", padding: "0 24px" })}
`;
const LogoContainer = styled.div`
  text-align: center;
`;
const Heading = styled.div`
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 12px;
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

const FieldRow = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const NotFoundImg = styled.img`
  width: 60%;
  ${desktop({ width: "80%" })}
  margin: 0 auto;
  padding-bottom: 10px;
`;

const NotFound = () => {
  const username = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = (e) => {
    // e.preventDefault();
    router.push("/" + username.current.value, undefined, { shallow: true });
  };

  return (
    <Container className="animate__animated animate__fadeIn">
      <LogoContainer>
        <AppLogo className="d-none" src="/images/Content.png" />
        <NotFoundImg src="/images/nokofio-not-found.svg" />
      </LogoContainer>

      <Heading>User not found!</Heading>
      <SubHeading>Try again with a valid username</SubHeading>
      <Form onSubmit={handleClick}>
        <FormRow>
          <Label>Username</Label>
          <FieldRow>
            <InnerField>nokofio.me/</InnerField>
            <UsernameInput ref={username} required placeholder="username" />
          </FieldRow>
        </FormRow>

        <FormRow>
          <Button type="submit">
            {isLoading ? (
              <CircularProgress color="info" size={20} />
            ) : (
              <Typography>Search</Typography>
            )}
          </Button>
        </FormRow>
      </Form>
    </Container>
  );
};

export default NotFound;
