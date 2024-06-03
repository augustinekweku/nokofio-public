import styled from "styled-components";
import { mobile, sm } from "../responsive";

import { useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/system";
import { Button, Typography } from "@mui/material";
import Image from "next/legacy/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

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
  min-height: 80vh;
  ${mobile({ width: "100%" })};
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
`;

const ImageWrapper = styled.div``;
const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px;
  /* background-image: url("/images/shop-jumbotron.png"); */
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  position: relative;
  height: 400px;
  justify-content: flex-end;
  border-radius: 20px;
  &::before {
    border-radius: 20px;
    /* background-color: rgba(0, 0, 0, 0.368); */
    background-image: linear-gradient(180deg, transparent 0%, #000 130%);
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

const ProductDetailsDrawer = ({ onDismissed, product }) => {
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
  if (typeof window !== "undefined") {
    var nokofioProfile = JSON.parse(localStorage.getItem("nokofioProfile"));
  }

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
    <div>
      <Container>
        <Box
          sx={{
            px: {
              xs: 2,
              md: 5,
            },
            pb: 4,
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
              {[product?.featuredImage].map((image, index) => (
                <ImageContainer
                  style={{ backgroundImage: `url(${image})` }}
                  key={index}
                >
                  <Box
                    position={"relative"}
                    display={"flex"}
                    justifyContent={"space-between"}
                    flexDirection={"column"}
                    height={"100%"}
                  >
                    <Box
                      onClick={() => {
                        onDismissed();
                      }}
                      style={{ cursor: "pointer" }}
                      alignSelf={"flex-start"}
                    >
                      <Image
                        src={"/images/svg/Back.svg"}
                        alt="back"
                        width={50}
                        height={50}
                      />
                    </Box>
                    <Box alignSelf={"flex-start"}>
                      <Typography
                        textAlign={"left"}
                        variant="h5"
                        sx={{ color: "#fff" }}
                      >
                        {product?.itemName}
                      </Typography>
                      <Typography
                        align="left"
                        variant="subtitle1"
                        fontWeight={"bold"}
                        sx={{ color: "#fff" }}
                        mb={5}
                      >
                        {`GHS ` + product?.price}
                      </Typography>
                    </Box>
                  </Box>
                </ImageContainer>
              ))}
            </Carousel>
          </Box>

          <Box display={"none"} mt={3}>
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
          </Box>

          <Box mt={3}>
            <Typography
              variant="subtitle1"
              fontWeight={"bold"}
              sx={{ color: "#000" }}
            >
              DESCRIPTION
            </Typography>
            <Typography variant="caption1" sx={{ color: "#000" }}>
              {product?.description}
            </Typography>
            <Box mt={4}>
              <a href={`tel:${nokofioProfile?.phoneNumber}`}>
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
                  Contact Seller
                </Button>
              </a>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default ProductDetailsDrawer;
