import {
  Avatar,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { Btn } from "../StyledComponents/common";
import * as ga from "../lib/ga";
import { useState } from "react";
import { publicRequest } from "../requestMethods";
import { useRef } from "react";
import { useEffect } from "react";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import { getBaseUrl } from "../helpers/constants";

const Container = styled.div`
  background: #151515;
  padding-top: 45px;
  ${mobile({ paddingTop: "0px" })}
`;
const HeroImageContainer = styled.div`
  width: 300px;
  ${mobile({ width: "60%" })}
  margin: 0 auto;
`;
const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  margin-bottom: -50px;
  object-fit: cover;
`;

const HeroLeftContainer = styled.div`
  padding: 30px;
`;

const HeroText = styled.h1`
  font-size: 56px;
  /* font-weight: 600; */
  line-height: 4rem;
  text-align: left;
  color: #fff;
  ${mobile({ fontSize: "40px", lineHeight: "3rem" })}
`;
const HeroSubText = styled.p`
  padding-top: 36px;
  font-size: 22px;
  font-weight: 300;
  line-height: 36px;
  text-align: left;
  color: white;
  ${mobile({ lineHeight: "24px" })}
`;
const HeroBtnRow = styled.div`
  padding-top: 36px;
  display: flex;
  align-items: center;
  gap: 10px;
`;
const FieldRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const UsernameInput = styled.input`
  padding: 12px 14px 12px 14px;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  border-radius: 8px;
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
const HeroBtn = styled(Btn)`
  font-family: Poppins;
  padding: 12px 14px;
  width: 100%;
  height: 48px;
  font-weight: 500;
  font-size: 16px;
  justify-content: center;
`;
const Form = styled.form``;
const FormRow = styled.div``;
const Input = styled.input``;

const InnerIcon = styled.div`
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  z-index: 99;
  background: "white";
`;
const SearchField = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Hero = () => {
  const [usersFound, setUsersFound] = useState(null);
  const [isSearching, setIsSearching] = useState(null);
  const searchResults = useRef();
  const router = useRouter();

  const searchUsers = async (e) => {
    if (e.length > 2) {
      searchResults.current.style.display = "block";
      setIsSearching(true);
      try {
        const res = await publicRequest.get(`user/searchUsers?username=${e}`);
        setUsersFound(res.data.results.data);
        if (res.data.results.data) {
          setIsSearching(false);
        }
      } catch (error) {
        setUsersFound(null);
        setIsSearching(false);
      }
    } else {
    }
  };
  if (typeof window !== "undefined" && router.pathname === "/") {
    const concernedElement = document.querySelector(".search-results");
    if (concernedElement) {
      document.addEventListener("mousedown", (event) => {
        if (!concernedElement.contains(event.target) && searchResults.current) {
          searchResults.current.style.display = "none";
        }
      });
    }
  }

  useEffect(() => {
    if (router.pathname === "/" && searchResults.current) {
      searchResults.current.style.display = "none";
    }
  }, [router.pathname]);

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} md={6} sx={{ padding: "20px 0" }}>
          <HeroLeftContainer>
            <HeroText>
              Empowering you with a link for donations and crowdfunding
            </HeroText>
            <HeroSubText>
              Nokofio — a free, customizable link in bio tool for NGOs and
              influencers
            </HeroSubText>
            <HeroBtnRow>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormRow>
                    <SearchField>
                      <UsernameInput
                        placeholder="Search User"
                        onChange={(e) => searchUsers(e.target.value)}
                      />

                      <InnerIcon>
                        <SearchIcon />
                      </InnerIcon>
                    </SearchField>
                  </FormRow>

                  <div
                    style={{ borderRadius: "8px", marginTop: "5px" }}
                    ref={searchResults}
                    className="search-results animate__animated animate__fadeIn"
                  >
                    {usersFound && !isSearching ? (
                      <List
                        sx={{
                          width: "100%",
                          bgcolor: "background.paper",
                          borderRadius: "8px",
                        }}
                      >
                        {usersFound.map((user, index) => (
                          <div key={index}>
                            <Link href={`${getBaseUrl()}/${user.username}`} legacyBehavior>
                              <ListItem
                                sx={{ cursor: "pointer" }}
                                key={index}
                                alignItems="flex-start"
                              >
                                <ListItemAvatar>
                                  <Avatar
                                    alt={user?.username}
                                    src={user?.profilePicture}
                                  />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={"@" + user?.username}
                                  secondary={
                                    <React.Fragment>
                                      <Typography
                                        sx={{ display: "inline" }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                      >
                                        {user.displayName}
                                      </Typography>
                                    </React.Fragment>
                                  }
                                />
                              </ListItem>
                            </Link>
                            <Divider variant="inset" component="li" />
                          </div>
                        ))}
                      </List>
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          background: "#fff",
                          padding: "10px",
                          borderRadius: "8px",
                        }}
                      >
                        {isSearching ? (
                          <>
                            <CircularProgress color="info" size={20} />
                          </>
                        ) : (
                          "No users found"
                        )}
                      </div>
                    )}
                  </div>
                </Grid>
              </Grid>
            </HeroBtnRow>
          </HeroLeftContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <HeroImageContainer>
            <HeroImage
              className="animate__animated animate__pulse"
              src="/images/hero-image.png"
            />
          </HeroImageContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Hero;
