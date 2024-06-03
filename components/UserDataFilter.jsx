import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setDashboardData,
  setDonationTransactionsData,
  setIsLoadingDashboardData,
  setSupportMeTransactionsData,
} from "../redux/userRedux";
import donationServices from "../services/donationServices";
import supportMyContentServices from "../services/supportMyContentServices";
import UserServices from "../services/UserServices";
import {
  FormOption,
  FormSelect,
  SelectContainer,
} from "../StyledComponents/common";

const donationTableRoutes = [
  "/dashboard/donations",
  "/dashboard/support-content-donations",
];

const UserDataFilter = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const [filterDate, setFilterDate] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const getFilterData = async () => {
      try {
        dispatch(setIsLoadingDashboardData(true));
        const { data } = await UserServices.getDashboardData(filterDate);
        if (data) {
          dispatch(setDashboardData(data.results.data));
          dispatch(setIsLoadingDashboardData(false));
        }
      } catch (error) {
        dispatch(setIsLoadingDashboardData(false));
      } finally {
        dispatch(setIsLoadingDashboardData(false));
      }
    };

    async function getFilteredSupportMeTransactions() {
      dispatch(setIsLoadingDashboardData(true));
      try {
        const { data } = await supportMyContentServices.getTransactions(
          filterDate
        );
        dispatch(setSupportMeTransactionsData(data.results.data));
        dispatch(setIsLoadingDashboardData(false));
      } catch (error) {
        dispatch(setIsLoadingDashboardData(false));
      } finally {
        dispatch(setIsLoadingDashboardData(false));
      }
    }

    async function getFilteredDonationTransactions() {
      dispatch(setIsLoadingDashboardData(true));
      try {
        const { data } = await donationServices.getTransactions(filterDate);
        dispatch(setDonationTransactionsData(data.results.data));
        dispatch(setIsLoadingDashboardData(false));
      } catch (error) {
        dispatch(setIsLoadingDashboardData(false));
      } finally {
        dispatch(setIsLoadingDashboardData(false));
      }
    }

    if (router.pathname === "/dashboard/support-content-donations") {
      getFilteredSupportMeTransactions();
    }
    if (router.pathname === "/dashboard/donations") {
      getFilteredDonationTransactions();
    }

    getFilterData();
  }, [filterDate, dispatch, router.pathname]);

  return (
    <div style={{ margin: "10px 0" }}>
      <SelectContainer style={{ width: "160px", height: "35px" }}>
        <FormSelect
          value={filterDate}
          onChange={(e) => {
            setFilterDate(e.target.value);
          }}
        >
          <FormOption value={"today"}>Today</FormOption>
          <FormOption value={"7"}>Last 7 days</FormOption>
          <FormOption value={"30"}>Last 30 days</FormOption>
          <FormOption value={"90"}>Last 90 days</FormOption>
          <FormOption value={"all"}>All</FormOption>
        </FormSelect>
      </SelectContainer>
    </div>
  );
};

export default UserDataFilter;
