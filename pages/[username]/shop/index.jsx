import styled from "styled-components";
import { mobile, xl, desktopLarge, tablet, desktop } from "../../../responsive";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import LanguageIcon from "@mui/icons-material/Language";
import Link from "next/link";
import { useRouter } from "next/router";
import shopServices from "../../../services/shopServices";
import React, { useEffect, useReducer } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Product from "./product/[id]";
import ProductDetailsDrawer from "../../../components/ProductDetailsDrawer";
import { publicRequest } from "../../../requestMethods";
import { captilazeFirstLetter } from "../../../helpers";

const ContainerWrapper = styled.div`
  width: 100%;
  padding-top: 20px;
`;

const Container = styled.div`
  background-color: #ffffffa6;
  margin: 0 auto;
  ${mobile({ width: "100%" })};
  ${desktop({ width: "70%" })};
  ${desktopLarge({ width: "70%" })};
  ${xl({ width: "70%" })};
`;

const JumbotronSection = styled.div``;
const ShopJumbotronWrapper = styled.div`
  margin: 0px 10px;
  display: flex;
  flex-direction: column;
  padding: 25px;
  background-image: url("/images/shopping-banner.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  ${mobile({ minHeight: "200px" })};
  ${desktop({ minHeight: "250px" })};
  ${desktopLarge({ minHeight: "300px" })};
  justify-content: flex-end;
  border-radius: 20px;
  &::before {
    border-radius: 20px;
    background-color: rgba(0, 0, 0, 0.368);
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

const ShopProductImageCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px;
  /* background-image: url("/images/shop-jumbotron.png"); */
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  position: relative;
  ${mobile({ minHeight: "200px" })};
  ${desktop({ minHeight: "250px" })};
  ${desktopLarge({ minHeight: "250px" })};
  justify-content: flex-end;
  border-radius: 20px 20px 0px 0px;
  &::before {
    border-radius: 20px 20px 0px 0px;
    /* background-color: rgba(0, 0, 0, 0.368); */
    /* background-image: linear-gradient(180deg, transparent 0%, #000000ae 100%); */
    opacity: 0.9;
    content: "";
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    position: absolute;
  }
`;

const JumbotronBody = styled.div`
  position: relative;
`;

const Footer = styled.div`
  width: 80%;
  margin: 0 auto;
  ${mobile({ width: "85%" })}
`;

const SocialContainer = styled.div`
  display: flex;
  margin-top: 32px;
  margin-bottom: 48px;
`;

const SocialIcon = styled.div`
  background-color: ${(props) => props.color};
  padding: 11px 9px;
  margin-right: 16px;
`;

const ShopTitle = styled.h4`
  font-weight: 400;
  ${mobile({ fontSize: "20px" })}
  ${desktop({ fontSize: "28px" })}
  color: #fff;
`;

const ShopBody = styled.div`
  margin: 30px 10px;
`;

const ProductImageWrapper = styled.div``;

const Shop = ({ username }) => {
  const [state, updateState] = useReducer(
    (state, newState) => {
      const update = { ...state, ...newState };
      return update;
    },
    {
      isLoadingShopItems: false,
      shopItems: [],
      drawerState: false,
      selectedProduct: null,
    }
  );

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    updateState({ drawerState: open });
  };

  async function getShopItems() {
    if (username) {
      try {
        updateState({ isLoadingShopItems: true });
        const { data } = await shopServices.getProductsForPublic(username);
        updateState({ shopItems: data.results });
      } catch (error) {}
    }
  }

  useEffect(() => {
    getShopItems();
  }, []);

  useEffect(() => {
    if (username) {
      const getUser = async () => {
        try {
          const res = await publicRequest.get(`/user/me?username=${username}`);
          if (res.status === 200) {
            localStorage.setItem(
              "nokofioProfile",
              JSON.stringify(res.data.results.data)
            );
          }
        } catch (error) {}
      };
      getUser();
    }
  }, []);

  const list = () => (
    <Box
      //   sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <ContainerWrapper>
      <Container>
        <JumbotronSection>
          <ShopJumbotronWrapper>
            <JumbotronBody>
              <ShopTitle>
                {username?.toUpperCase()} <br /> SHOP
              </ShopTitle>
            </JumbotronBody>
          </ShopJumbotronWrapper>
        </JumbotronSection>
        <ShopBody>
          <Grid container spacing={2}>
            {state?.shopItems?.length === 0 ? (
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "200px",
                  }}
                >
                  <Typography variant="h6" color="textSecondary">
                    No products available
                  </Typography>
                  <Link href={`/${username}`} legacyBehavior>
                    <Typography
                      sx={{
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      variant="caption"
                      color="textSecondary"
                    >
                      Visit {captilazeFirstLetter(username) + "'s"} profile for
                      more options
                    </Typography>
                  </Link>
                </Box>
              </Grid>
            ) : (
              <>
                {state?.shopItems?.map((item, i) => (
                  <Grid
                    item
                    xs={12}
                    md={4}
                    xl={4}
                    key={i}
                    onClick={() => {
                      updateState({ selectedProduct: item, drawerState: true });
                    }}
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    <Box
                      boxShadow={2}
                      sx={{
                        borderRadius: "20px",
                      }}
                    >
                      <Box width={"100%"}>
                        <ShopProductImageCard
                          style={{
                            backgroundImage: item?.featuredImage
                              ? `url(${item?.featuredImage})`
                              : `url(${"/images/placeholder-image.png"})`,
                            backgroundPosition: "center",
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          <ProductImageWrapper></ProductImageWrapper>
                        </ShopProductImageCard>
                      </Box>
                      <Box
                        sx={{
                          border: "1px solid #e0e0e0",
                          pt: "5px",
                          pb: "15px",
                          px: "15px",
                          borderRadius: "0px 0px 20px 20px",
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={"bold"}>
                          {item.itemName}
                        </Typography>
                        <Typography variant="body2">
                          GHS {item.price}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </>
            )}
          </Grid>
        </ShopBody>

        <div>
          <React.Fragment>
            <SwipeableDrawer
              anchor={"bottom"}
              open={state.drawerState}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
            >
              <ProductDetailsDrawer
                product={state.selectedProduct}
                onDismissed={() => updateState({ drawerState: false })}
              />
            </SwipeableDrawer>
          </React.Fragment>
        </div>

        <Footer>
          <SocialContainer>
            <SocialIcon color="#000000">
              <FacebookRoundedIcon fontSize="medium" sx={{ color: "white" }} />
            </SocialIcon>
            <SocialIcon color="#000000">
              <TwitterIcon fontSize="medium" sx={{ color: "white" }} />
            </SocialIcon>
            <SocialIcon color="#000000">
              <YouTubeIcon fontSize="medium" sx={{ color: "white" }} />
            </SocialIcon>
            <SocialIcon color="#000000">
              <InstagramIcon fontSize="medium" sx={{ color: "white" }} />
            </SocialIcon>
            <SocialIcon color="#000000">
              <LanguageIcon fontSize="medium" sx={{ color: "white" }} />
            </SocialIcon>
          </SocialContainer>
        </Footer>
      </Container>
    </ContainerWrapper>
  );
};

//create a getServerSideProps function to get the username from the url
export async function getServerSideProps(context) {
  const { username } = context.query;
  return {
    props: {
      username,
    },
  };
}

export default Shop;
