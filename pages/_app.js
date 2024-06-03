import store, { persistor } from "../redux/store"
import { Provider } from "react-redux";
import 'animate.css';
import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material";
import * as ga from '../lib/ga'
import './global.scss'
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import {  useRouter } from "next/router";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { PersistGate } from "redux-persist/integration/react";
const theme = createTheme({

  typography: {
    fontFamily: ['Poppins'].join(","),
    color: "#efefef",
    pallette: {
      warning: {
        main: "#ED6C03",
        contrastText: "#fff",
      }
    }
  },
  palette: {
    primary: {
      main: "#2b2b2b",
      darker: "#201e1e",
    },
    neutral: {
      main: '#155EEF',
      contrastText: '#201e1e',
    },
    warning: {
      main: '#ED6C03',
      contrastText: '#fff',

    }

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




   function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url)
    }
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events]);

    

  

    // Use the layout defined at the page level, if available
    const getLayout =  Component.getLayout || ((page) => page)
  

  return getLayout(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>


      <ThemeProvider theme={theme}>    
        <Layout >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Component {...pageProps} />
      </LocalizationProvider>
        </Layout>
      </ThemeProvider>
      </PersistGate>
    </Provider>
  );}





export default MyApp
