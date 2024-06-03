import DashboardIcon from "@mui/icons-material/Dashboard";
import PaletteIcon from "@mui/icons-material/Palette";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SettingsIcon from "@mui/icons-material/Settings";

import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';import AddLinkIcon from "@mui/icons-material/AddLink";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import CategoryIcon from "@mui/icons-material/Category";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";

export const mainNavLinks = [
  {
    url: "/builder",
    title: "Builder",
    icon: <PaletteIcon />,
  },
  {
    url: "/dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },

  {
    url: "/settings",
    title: "Settings",
    icon: <SettingsIcon />,
  },
];

export const sideNavLinks = [
  {
    url: "/builder/bio",
    title: "Profile Bio",
    icon: <AccountCircleIcon />,
    status: 1
  },
  {
    url: "/builder/support-content",
    title: "Accept Payments",
    icon: <FavoriteIcon />,
    status: 1
  },
  {
    url: "/builder/donation-setup",
    title: "Donations",
    icon: <VolunteerActivismIcon />,
    status: 1
  },
  {
    url: "/external-link",
    title: "Add External Links",
    icon: <AddLinkIcon />,
    status: 1
  },
  {
    url: "/builder/socials",
    title: "Social Media links",
    icon: <TravelExploreIcon />,
    status: 1
  },
  {
    url: "/builder/shop-setup",
    title: "Shop Setup",
    icon: <AddBusinessOutlinedIcon />,
    status: 1
  },
  {
    url: "/builder/services",
    title: "Services",
    icon: <CategoryIcon />,
    status: 0
  },

  {
    url: "/builder/ticket-setup",
    title: "Ticket",
    icon: <ConfirmationNumberIcon />,
    status: 0
  },


];

export const settingsLinks = [
  {
    url: "/settings/account-preferences",
    title: "Account Preferences",
    icon: <SettingsIcon  />,
  },
  {
    url: "/settings/settlement-account",
    title: "Settlement Account",
    icon: <MonetizationOnIcon />,
  },
]
