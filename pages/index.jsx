import Head from "next/head";

import styled from "styled-components";
import { desktop, desktopLarge, mobile, tablet, xl } from "../responsive";
import Link from "next/link";
import PublicNavbar from "../components/PublicNavbar";
import Hero from "../components/Hero";
import { Btn, HomeContainer } from "../StyledComponents/common";
import { Grid } from "@mui/material";
import RandomUsers from "../components/RandomUsers";
import Faqs from "../components/Faqs";

const BodyWrapper = styled.div``;
const HeroSection = styled.section`
  background-color: #151515;
`;
const GetStartedSection = styled.section`
  background-color: #f5f5f5;
  padding: 70px 0px;
  ${mobile({ padding: "50px 15px", paddingTop: "70px" })}
`;

const SectionBigHeading = styled.h1`
  padding-bottom: 25px;
  font-size: 46px;
  ${mobile({ fontSize: "26px", lineHeight: "2rem" })}
  font-weight: 600;
  line-height: 3.5rem;
  text-align: center;
  color: #151515;
`;
const BigHeadingWhite = styled(SectionBigHeading)`
  padding-bottom: 25px;
  font-size: 46px;
  font-weight: 600;
  line-height: 3.5rem;
  text-align: center;
  color: white;
  ${mobile({ fontSize: "26px", lineHeight: "2rem" })}
`;

const GetStartedBtn = styled(Btn)`
  font-size: 16px;
  margin: 0 auto;
  padding: 14px 24px;
  ${mobile({ fontSize: "14px", padding: "12px" })}
`;
const SectionBtn = styled(Btn)`
  font-size: 16px;
  padding: 14px 24px;
  margin-top: 30px;
  width: fit-content;
  ${mobile({ fontSize: "14px", padding: "12px 18px", margin: "25px auto" })}
`;
const ReceivePaymentSection = styled.section`
  background-color: #fff;
  padding: 70px 0px;
  ${mobile({ padding: "50px 15px" })}
`;
const SectionHead = styled.h3`
  font-size: 36px;
  /* font-weight: 500; */
  padding-bottom: 20px;
  ${mobile({
    fontSize: "26px",
    lineHeight: "2rem",
    width: "90%",
    textAlign: "center",
    margin: "0 auto",
  })}
  letter-spacing: 0em;
  text-align: left;
`;
const HeadCentered = styled(SectionHead)`
  text-align: center;
  ${tablet({ width: "70%" })}
  ${desktop({ width: "70%" })}
  ${desktopLarge({ width: "70%" })}
  ${xl({ width: "70%" })}
  margin: 0 auto;
`;
const SectionBody = styled.p`
  font-size: 20px;
  color: white;
  font-weight: 300;
  letter-spacing: 0em;
  text-align: left;
  ${mobile({ fontSize: "16px", textAlign: "center" })}
`;
const SectionBodyRight = styled(SectionBody)`
  margin-top: 20px;
`;
const SectionImageWrapper = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  margin-bottom: 20px;
`;
const SectionImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;
const FooterTopSection = styled.section`
  background: #003034;
  padding: 70px 0;
  ${mobile({ padding: "50px 0" })}
`;
const HomeFooter = styled.footer`
  background: #151515;
  padding: 20px 0;
  ${mobile({ padding: "15px 10px" })}
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const FooterColumn = styled.div``;
const LogoImage = styled.img`
  ${mobile({ width: "90px" })}
`;

const Copyright = styled.p`
  color: white;
  ${mobile({ fontSize: "14px" })}
`;

const RandomUsersSection = styled.section``;

export default function Home() {
  return (
    <div>
      <Head>
        <title>Nokofio</title>
        <meta
          name="description"
          content="Nokofio: One link to collect payments from your audience.
              Nokofio provides you the simplest link to share on your social media platforms"
        />
        <meta
          property="og:image"
          content="/images/nokofio_banner_preview.png"
          key="ogimage"
        />
        <link rel="icon" href="/images/icon_small.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style
          data-href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        ></style>
      </Head>
      <BodyWrapper>
        <PublicNavbar />
        <HeroSection>
          <HomeContainer>
            <Hero />
          </HomeContainer>
        </HeroSection>
        <GetStartedSection>
          <HomeContainer>
            <Grid container sx={{ justifyContent: "center" }}>
              <Grid item>
                <HeadCentered>
                  Create a free page to collect donations with Nokofio in
                  minutes
                </HeadCentered>
                <Link href="/register" legacyBehavior>
                  <GetStartedBtn bg="#fbb516" color="#151515" fw="500">
                    GET STARTED
                  </GetStartedBtn>
                </Link>
              </Grid>
            </Grid>
          </HomeContainer>
        </GetStartedSection>
        <RandomUsersSection>
          <RandomUsers />
        </RandomUsersSection>
        <ReceivePaymentSection>
          <HomeContainer>
            <Grid container spacing={10}>
              <Grid item xs={12} md={6}>
                <SectionImageWrapper>
                  <SectionImage src="/images/nokofio_section_image.png" />
                </SectionImageWrapper>
                <SectionHead>Receive payments instantly</SectionHead>
                <SectionBody>
                  Set your own prices, Receive donations & tips from your fans
                  across the globe, Sell tickets and more. No hidden charges on
                  sales Showcase in multiple countries
                </SectionBody>
                <Link href="/register" legacyBehavior>
                  <SectionBtn bg="#151515" color="white" fw="500">
                    Sign up free
                  </SectionBtn>
                </Link>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <SectionImageWrapper>
                  <SectionImage src="/images/nokofio_section_image2.png" />
                </SectionImageWrapper>
                <SectionHead>Get Insights</SectionHead>
                <SectionBodyRight>
                  Get Insights, and make sense of all data relating to your
                  page, including page views, clicks, conversion, donations and
                  payments.{" "}
                </SectionBodyRight>
                <Link href="/register" legacyBehavior>
                  <SectionBtn bg="#151515" color="white" fw="500">
                    Sign up free
                  </SectionBtn>
                </Link>
              </Grid>
            </Grid>
          </HomeContainer>
        </ReceivePaymentSection>
        <FooterTopSection>
          <HomeContainer>
            <BigHeadingWhite>Nokofio for the mandem!</BigHeadingWhite>
            <BigHeadingWhite style={{ marginTop: "20px", fontSize: "130%" }}>
              Got Questions?
            </BigHeadingWhite>
            <Faqs />
          </HomeContainer>
        </FooterTopSection>
        <HomeFooter>
          <HomeContainer>
            <FooterRow>
              <FooterColumn>
                <LogoImage src="/images/Logo-white.png" alt="" width="120" />
              </FooterColumn>
              <FooterColumn>
                <SectionBody>0533941961</SectionBody>
              </FooterColumn>
              <FooterColumn>
                <Link
                  href="https://docs.google.com/document/d/1d3dVuMh4uYEDoZ6mXLbUx1vjlXfl3hFfiVNNh5pHRwE/edit?usp=sharing"
                  legacyBehavior
                >
                  <Copyright style={{ cursor: "pointer" }}>
                    Terms and Conditions
                  </Copyright>
                </Link>
                <Link
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfwr67GIJuSNUxAiLi1mCFVnp9W5MJ9TTIUi1TuzN9wyB5yJg/viewform"
                  legacyBehavior
                >
                  <Copyright style={{ cursor: "pointer", marginBottom: "5px" }}>
                    Report a Violation
                  </Copyright>
                </Link>
                <Copyright style={{ fontSize: "65%" }}>
                  Copyright &copy;2023
                </Copyright>
              </FooterColumn>
            </FooterRow>
          </HomeContainer>
        </HomeFooter>
      </BodyWrapper>
    </div>
  );
}
