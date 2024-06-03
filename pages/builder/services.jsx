import styled from "styled-components";
import { mobile } from "../../responsive";
import { tablet, desktop } from "../../responsive";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";

import DashboardRight from "../../components/DashboardRight";
import UserShare from "../../components/UserShareRow";

import BackNavTitle from "../../components/BackNavTitle";

import { FormContainer } from "../../StyledComponents/common";
import Layout from "../../components/Layout";
import AuthLayout from "../../components/AuthLayout";

const Container = styled.div``;
const MainRow = styled.div`
  display: flex;
`;
const MainLeft = styled.div`
  overflow-y: scroll;
  height: 100vh;
  padding: 32px 0;
  flex: 2;
  background-color: #e8e8e8;
  ${mobile({ width: "100%", paddingTop: "0px", height: "100vh" })}
  ${tablet({ width: "100%", paddingTop: "0px", height: "100vh" })}
`;

const MainRight = styled.div`
  flex: 1;
  ${mobile({ display: "none" })}
  ${tablet({ display: "none" })}
    ${desktop({ display: "block" })}
`;
const InnerLeft = styled.div`
  padding-left: 80px;
  padding-right: 80px;
  ${mobile({ padding: "0px 15px" })}
`;

const Button = styled.button`
  padding: 15px;
  font-size: 14px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  ${mobile({ fontSize: "12px", padding: "12px" })}
`;

const Form = styled.form``;
const FormRow = styled.div``;
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
  border-radius: 8px 8px 8px 8px;
  border: none;
  margin-bottom: 20px;
  &:focus {
    outline: none;
  }
`;

const FormActionRow = styled.div`
  margin: 20px 0 0 0;
`;
const CardsContainer = styled.div`
  margin-top: 100px;
  margin-bottom: 100px;
`;

const ServiceCardRow = styled.div`
  display: flex;
  align-items: center;
`;
const ServiceCardWrapper = styled.div`
  flex: 5;
`;
const ServiceCardInnerWrapper = styled.div`
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: #f6f2e9;
`;
const ServiceCardInnerleft = styled.div``;
const ServiceCardInnerRight = styled.div``;
const ServiceCardTitle = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
`;
const ServiceCardDesc = styled.div`
  font-size: 12px;
  font-weight: 400;
`;
const ServiceAmount = styled.div`
  font-size: 20px;
  font-weight: 600;
`;
const ServiceCardActions = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;
const ServiceCardIcon = styled.div`
  background: #dad8d8;
  padding: 17px;
  border-radius: 50%;
  height: 70px;
  width: 70px;
  ${mobile({ height: "50px", width: "50px" })}
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Services = () => {
  return (
    <Container className="animate__animated animate__fadeIn">
      <MainRow>
        <MainLeft>
          <UserShare />
          <InnerLeft>
            <BackNavTitle title={"Services"} />

            <Form>
              <FormContainer>
                <FormRow>
                  <Label>Service Title</Label>
                  <Input placeholder="Enter title of the service (e.g Birthday Surprises)" />
                </FormRow>
                <FormRow>
                  <Label>Short Description</Label>
                  <Input placeholder="Add a short description of your service (e.g I help you surprise your loved ones)" />
                </FormRow>
                <FormRow>
                  <Label>Enter Price</Label>
                  <Input placeholder="Enter Service Price" />
                </FormRow>
                <FormActionRow>
                  <Button>Submit</Button>
                </FormActionRow>
              </FormContainer>
            </Form>

            <CardsContainer>
              <ServiceCardRow>
                <ServiceCardWrapper>
                  <ServiceCardInnerWrapper>
                    <ServiceCardInnerleft>
                      <ServiceCardTitle>Regular</ServiceCardTitle>
                      <ServiceCardDesc>Regular</ServiceCardDesc>
                    </ServiceCardInnerleft>
                    <ServiceCardInnerRight>
                      <ServiceAmount>GHS 10</ServiceAmount>
                    </ServiceCardInnerRight>
                  </ServiceCardInnerWrapper>
                </ServiceCardWrapper>
                <ServiceCardActions>
                  <ServiceCardIcon>
                    <DeleteIcon sx={{ color: red[500] }} />
                  </ServiceCardIcon>
                </ServiceCardActions>
              </ServiceCardRow>
            </CardsContainer>
          </InnerLeft>
        </MainLeft>
        <MainRight>
          <DashboardRight />
        </MainRight>
      </MainRow>
    </Container>
  );
};

export default Services;

Services.getLayout = function getLayout(page) {
  return (
    <Layout>
      <AuthLayout>{page}</AuthLayout>{" "}
    </Layout>
  );
};
