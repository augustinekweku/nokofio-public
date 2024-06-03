import Head from "next/head";
import styled from "styled-components";
import { mobile, sm } from "../../../../responsive";
import VerifiedIcon from "@mui/icons-material/Verified";
import AppFooter from "../../../../components/AppFooter";

import { useEffect, useReducer } from "react";
import { useState } from "react";
import FullPageLoader from "../../../../components/FullPageLoader";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { Box } from "@mui/system";
import { Button, Typography } from "@mui/material";
import { publicRequest } from "../../../../requestMethods";
import Image from "next/legacy/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const ContainerWrapper = styled.div`
  background-color: #e8e8e8;
  overflow-x: hidden;
`;

const Container = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  width: 600px;
  margin: 0 auto;
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-top: none;
  padding-top: 10px;
  min-height: 100vh;
  ${mobile({ width: "100%" })};
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
`;

const ImageWrapper = styled.div``;
const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px;
  background-image: url("/images/shop-jumbotron.png");
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  height: 400px;
  justify-content: flex-end;
  border-radius: 20px;
  &::before {
    border-radius: 20px;
    background-color: rgba(0, 0, 0, 0.368);
    background-image: linear-gradient(180deg, transparent 0%, #000 100%);
    opacity: 0.9;
    content: "";
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    position: absolute;
  }
`;
const sizes = [
  {
    size: "S",
    isSelected: false,
  },
  {
    size: "M",
    isSelected: false,
  },
  {
    size: "L",
    isSelected: true,
  },
  {
    size: "XL",
    isSelected: false,
  },
];

const colors = [
  {
    color: "red",
    isSelected: false,
  },
  {
    color: "blue",
    isSelected: false,
  },
  {
    color: "green",
    isSelected: true,
  },
  {
    color: "yellow",
    isSelected: false,
  },
];

const Product = ({}) => {
  const [profileUser, setProfileUser] = useState(null);
  const router = useRouter();
  const { username } = router.query;
  const images = ["/img/bake.png", "/img/pizza.png", "/img/pizza.png"];
  const [state, updateState] = useReducer(
    (state, newState) => {
      const update = { ...state, ...newState };
      return update;
    },
    {
      index: 0,
    }
  );
  const data = ["1", "2", "3"];

  const carouselInfiniteScroll = () => {
    if (state.index === data.length - 1) {
      updateState({ index: 0 });
      return;
    }
    updateState({ index: state.index + 1 });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      carouselInfiniteScroll();
    }, 3000);
    return () => clearInterval(interval);
  }, [state.index]);

  const RightArrowStyles = {
    position: "absolute",
    zIndex: 2,
    width: "30px",
    height: "40px",
    bottom: "20px",
    left: "48px",
    cursor: "pointer",
    background: "transparent",
    outline: "none",
    border: "none",
  };
  const LeftArrowStyles = {
    position: "absolute",
    zIndex: 2,
    width: "30px",
    height: "40px",
    bottom: "20px",
    left: "20px",
    cursor: "pointer",
    background: "transparent",
    outline: "none",
    border: "none",
  };

  return (
    <ContainerWrapper
    // style={{ backgroundImage: "url('/images/background-1.svg')" }}
    >
      {!profileUser ? (
        <>
          <div className="animate__animated animate__fadeIn">
            <Container>
              <Box
                sx={{
                  px: {
                    xs: 2,
                    md: 5,
                  },
                }}
              >
                <Box>
                  <Carousel
                    showArrows={true}
                    showStatus={false}
                    showThumbs={false}
                    renderArrowNext={(onClickHandler, hasPrev, hasNext) =>
                      hasNext ? (
                        <button
                          onClick={onClickHandler}
                          title={"Next"}
                          style={{ ...RightArrowStyles, right: 15 }}
                        >
                          <Image
                            src={"/images/svg/shop-arrow-right.svg"}
                            alt="next"
                            width={20}
                            onClick={onClickHandler}
                            height={20}
                            style={{ cursor: "pointer" }}
                          />
                        </button>
                      ) : (
                        <button
                          onClick={onClickHandler}
                          title={"Next"}
                          style={{
                            ...RightArrowStyles,
                            right: 15,
                            opacity: 0.2,
                          }}
                        >
                          <Image
                            src={"/images/svg/shop-arrow-right.svg"}
                            alt="next"
                            width={20}
                            onClick={onClickHandler}
                            height={20}
                            style={{ cursor: "pointer" }}
                          />
                        </button>
                      )
                    }
                    renderArrowPrev={(onClickHandler, hasPrev, hasNext) =>
                      hasPrev ? (
                        <button
                          onClick={onClickHandler}
                          title={"Next"}
                          style={{ ...LeftArrowStyles, right: 15 }}
                        >
                          <Image
                            src={"/images/svg/shop-arrow-left.svg"}
                            alt="next"
                            width={20}
                            height={20}
                            style={{ cursor: "pointer" }}
                          />
                        </button>
                      ) : (
                        <button
                          onClick={onClickHandler}
                          title={"Next"}
                          style={{ ...LeftArrowStyles, right: 15 }}
                        >
                          <Image
                            src={"/images/svg/shop-arrow-left.svg"}
                            alt="next"
                            width={20}
                            height={20}
                            style={{ cursor: "pointer" }}
                          />
                        </button>
                      )
                    }
                  >
                    {images.map((image, index) => (
                      <ImageContainer key={index}>
                        <Box
                          position={"relative"}
                          display={"flex"}
                          justifyContent={"space-between"}
                          flexDirection={"column"}
                          height={"100%"}
                        >
                          <Box alignSelf={"flex-start"}>
                            <Image
                              src={"/images/svg/Back.svg"}
                              alt="back"
                              width={50}
                              height={50}
                              onClick={() => router.back()}
                              style={{ cursor: "pointer" }}
                            />
                          </Box>
                          <Box alignSelf={"flex-start"}>
                            <Typography variant="h4" sx={{ color: "#fff" }}>
                              {"image"}
                            </Typography>
                            <Typography
                              align="left"
                              variant="h6"
                              sx={{ color: "#fff" }}
                              mb={5}
                            >
                              $ 100
                            </Typography>
                          </Box>
                        </Box>
                      </ImageContainer>
                    ))}
                  </Carousel>
                </Box>

                <Box mt={3}>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Typography variant="h6" sx={{ color: "#000" }}>
                      SIZE
                    </Typography>
                    <Box display={"flex"} gap={2}>
                      {sizes.map((size, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: size.isSelected ? "#000" : "#fff",

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ color: size.isSelected ? "#fff" : "#000" }}
                          >
                            {size.size}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    mt={3}
                  >
                    <Typography variant="h6" sx={{ color: "#000" }}>
                      COLOR
                    </Typography>
                    <Box display={"flex"} gap={2}>
                      {colors.map((color, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: color.color,

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          {color.isSelected ? (
                            <Image
                              src={"/images/svg/shop-checkmark.svg"}
                              alt="checkmark"
                              width={15}
                              height={15}
                              style={{ cursor: "pointer" }}
                            />
                          ) : null}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box mt={4}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#000000ea",
                        color: "#fff",
                        width: "100%",
                        borderRadius: "10px",
                        height: "50px",
                        textTransform: "capitalize",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Add to cart
                    </Button>
                  </Box>
                </Box>
              </Box>
              <AppFooter />
            </Container>
          </div>
        </>
      ) : (
        <>
          <FullPageLoader />
        </>
      )}
    </ContainerWrapper>
  );
};

export default Product;
