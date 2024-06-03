import styled from "styled-components";

import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/router";

import * as React from "react";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";

import { mainNavLinks, sideNavLinks } from "../navLinks";
import { getProfile, getUserDonations, logoutUser } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { Button, Chip } from "@mui/material";
import { useEffect } from "react";
import { getCookies, setCookie, deleteCookie } from "cookies-next";

import {
  setDashboardData,
  setDonationsObj,
  setProfileUser,
} from "../redux/userRedux";
import { setFullPageLoading } from "../redux/fullPageLoadingRedux";
import UserServices from "../services/UserServices";
import { logoutUserAndRedirect } from "../helpers";
import Image from "next/legacy/image";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
const NavbarContainer = styled.div`
  border-bottom: 1px solid #d0d5dd;
`;
const SideNavSubHeading = styled.div`
  text-align: center;
  padding-top: 15px;
  font-weight: 600;
`;

const SideNavProfileHeader = styled.div`
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
`;
const AvatarContainer = styled.div`
  margin: 0 auto;
`;
const AvatarRow = styled.div`
  display: flex;
  justify-content: center;
`;
const ProfileName = styled.div`
  font-weight: 600;
  padding-top: 10px;
  font-size: 20px;
  text-transform: capitalize;
`;
const ProfileInfo = styled.div`
  font-weight: 400;
`;
const ListItems = styled.div`
  font-size: 14px;
`;

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const profileUser = useSelector((state) => state.user.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const open = Boolean(anchorElUser);
  const handleCloseNavMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = () => {
    return logoutUserAndRedirect();
  };

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  // useEffect(() => {
  //   const getProfileAPI = async () => {
  //     dispatch(setFullPageLoading({ status: true }));
  //     const newProfileObj = await getProfile();
  //     if (newProfileObj) {
  //       dispatch(setProfileUser(newProfileObj));
  //       dispatch(setFullPageLoading({ status: false }));
  //     } else {
  //       dispatch(setFullPageLoading({ status: false }));
  //     }
  //   };
  //   getProfileAPI();
  // }, [dispatch]);

  // useEffect(() => {
  //   const getDashboardData = async () => {
  //     dispatch(setFullPageLoading({ status: true }));
  //     try {
  //       const { data } = await UserServices.getDashboardData("30");
  //       dispatch(setDashboardData(data.results.data));
  //       dispatch(setFullPageLoading({ status: false }));
  //     } catch (error) {
  //       dispatch(setFullPageLoading({ status: false }));
  //       if (error.response.status == 401) {
  //         // logout();
  //       }
  //     } finally {
  //       dispatch(setFullPageLoading({ status: false }));
  //     }
  //   };
  //   getDashboardData();
  // }, [dispatch]);

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={(anchor, false)}
    >
      <SideNavProfileHeader>
        <Link href="/builder/bio" legacyBehavior>
          <AvatarRow>
            <AvatarContainer>
              <Avatar
                alt={profileUser?.username}
                src={
                  profileUser?.profilePicture
                    ? profileUser?.profilePicture
                    : "/images/noAvatar.png"
                }
                sx={{ width: 100, height: 100 }}
              />
            </AvatarContainer>
          </AvatarRow>
        </Link>
        <ProfileName>{profileUser?.username}</ProfileName>
        <ProfileInfo>{profileUser?.pageTitle}</ProfileInfo>
      </SideNavProfileHeader>
      <Divider />
      <List>
        <ListItems>
          {mainNavLinks.map((link, i) => (
            <Link
              key={i}
              href={link.url}
              className={
                router.pathname == link.url ? "sidebar_active" : "sidebar_link"
              }
            >
              <ListItem button>
                <ListItemIcon sx={{ color: "inherit" }}>
                  {link.icon}
                </ListItemIcon>
                {link.title}
              </ListItem>
            </Link>
          ))}
        </ListItems>
      </List>
      <Divider />
      <SideNavSubHeading className="d-none">Sections</SideNavSubHeading>
      <List>
        <ListItems className="d-none">
          {sideNavLinks.map((link, i) => (
            <Link
              key={i}
              href={link.status == 1 ? link.url : "#"}
              disabled
              className={
                router.pathname == link.url ? "sidebar_active" : "sidebar_link"
              }
            >
              <ListItem button>
                <ListItemIcon
                  sx={{
                    color: "inherit",
                    minWidth: "0px",
                    paddingRight: "10px",
                  }}
                >
                  {link.icon}
                </ListItemIcon>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexGrow: "1",
                  }}
                >
                  {link.title} &nbsp;
                  {link.status == 0 ? (
                    <Chip
                      sx={{ background: "#00000096", color: "#fff" }}
                      label={
                        <Typography sx={{ fontSize: "7px" }}>
                          Coming soon!
                        </Typography>
                      }
                      size="small"
                    />
                  ) : null}
                </div>
              </ListItem>
            </Link>
          ))}
        </ListItems>
      </List>
      <Divider />
      <List>
        <ListItems>
          <ListItem
            icon
            sx={{
              justifyContent: "center",
            }}
          >
            <Button onClick={logout} sx={{ width: "100%" }} variant="outlined">
              Log out
              <LogoutIcon fontSize="small" sx={{ marginLeft: "10px" }} />{" "}
            </Button>
          </ListItem>
        </ListItems>
      </List>
    </Box>
  );

  return (
    <NavbarContainer>
      <AppBar position="static" color="transparent" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar disableGutters variant="dense">
            <Typography
              className="app_name"
              variant="h6"
              noWrap
              component="div"
              sx={{ mx: 1, display: { xs: "none", md: "flex" } }}
              onClick={() => router.push("/builder")}
            >
              <img
                src="/images/nokofio-logo.png"
                alt=""
                srcSet=""
                style={{ width: "120px" }}
              />
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={toggleDrawer("left", true)}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Drawer
                  anchor={"left"}
                  open={state["left"]}
                  onClose={toggleDrawer("left", false)}
                >
                  {list("left")}
                </Drawer>
              </>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              <img
                src="/images/nokofio-logo.png"
                alt=""
                srcSet=""
                style={{ width: "120px" }}
              />
            </Typography>
            <Box
              className="menu-links"
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            >
              {mainNavLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.url}
                  className={
                    router.pathname == link.url ? "active" : "not_active"
                  }
                >
                  <MenuItem>{link.title}</MenuItem>
                </Link>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <IconButton
                onClick={handleOpenUserMenu}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                sx={{ p: 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image
                  alt={"profile picture"}
                  src={
                    profileUser?.profilePicture
                      ? profileUser.profilePicture
                      : "/images/noAvatar.png"
                  }
                  style={{
                    borderRadius: "50%",
                  }}
                  objectFit="cover"
                  width={"40px"}
                  height={"40px"}
                />
                <ArrowDropDownIcon color={"#000"} />
              </IconButton>
              <Menu
                sx={{ mt: "25px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  onClick={() => {
                    router.push("/builder/bio");
                    handleCloseNavMenu();
                  }}
                >
                  <Typography sx={{ color: "black" }}>Profile</Typography>
                </MenuItem>
                <MenuItem
                  sx={{
                    display: {
                      xs: "block",
                      md: "none",
                    },
                  }}
                  onClick={() => {
                    router.push("/dashboard");
                    handleCloseNavMenu();
                  }}
                >
                  <Typography sx={{ color: "black" }}>Dashboard</Typography>
                </MenuItem>
                <MenuItem
                  sx={{
                    display: {
                      xs: "block",
                      md: "none",
                    },
                  }}
                  onClick={() => {
                    router.push("/builder");
                    handleCloseNavMenu();
                  }}
                >
                  <Typography sx={{ color: "black" }}>Builder</Typography>
                </MenuItem>
                <MenuItem
                  sx={{
                    display: {
                      xs: "block",
                      md: "none",
                    },
                  }}
                  onClick={() => {
                    router.push("/settings");
                    handleCloseNavMenu();
                  }}
                >
                  <Typography sx={{ color: "black" }}>Settings</Typography>
                </MenuItem>
                <MenuItem>
                  <Typography
                    onClick={() => {
                      logout();
                    }}
                  >
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </NavbarContainer>
  );
};

export default Navbar;
