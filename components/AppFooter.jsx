import Image from "next/legacy/image";
import styled from "styled-components";
import { mobile } from "../responsive";
import { getBaseUrl } from "../helpers/constants";

const Container = styled.div`
  margin-top: auto;
  ${mobile({ width: "100%" })}
`;
const AppTitle = styled.div`
  font-size: 20px;
  color: black;
  text-align: center;
  padding: 10px 0;
`;
const LogoImage = styled.img``;

const AppFooter = () => {
  return (
    <Container>
      <a href={`${getBaseUrl()}`} target={"_blank"} rel={"noreferrer"}>
        <AppTitle>
          <LogoImage src="/images/nokofio-logo.png" alt="" width="100" />
        </AppTitle>
      </a>
    </Container>
  );
};

export default AppFooter;
