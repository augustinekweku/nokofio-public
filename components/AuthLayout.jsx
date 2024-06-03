import { createTheme, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Provider } from "react-redux";
import store from "../redux/store";
import Layout from "./Layout";
import Navbar from "./Navbar";

const AuthLayout = ({ children }) => {
  const theme = createTheme({
    typography: {
      fontFamily: ["Poppins"].join(","),
      color: "#efefef",
      pallette: {
        warning: {
          main: "#ED6C03",
          contrastText: "#fff",
        },
      },
    },
    palette: {
      primary: {
        main: "#201e1e",
        darker: "#201e1e",
      },
      neutral: {
        main: "#155EEF",
        contrastText: "#201e1e",
      },
      warning: {
        main: "#ED6C03",
        contrastText: "#fff",
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 768,
        lg: 1200,
        xl: 1536,
      },
    },
  });
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Layout>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Navbar />
            {children}
          </LocalizationProvider>
        </Layout>
      </ThemeProvider>
    </Provider>
  );
};

export default AuthLayout;
