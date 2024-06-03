import styled from "styled-components";
import { mobile } from "../../responsive";
import { tablet, desktop } from "../../responsive";

import DashboardRight from "../../components/DashboardRight";
import CancelIcon from "@mui/icons-material/Cancel";
import UserShare from "../../components/UserShareRow";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import {
  FormContainer,
  FormOption,
  FormSelect,
  ModalContainer,
  SelectContainer,
} from "../../StyledComponents/common";
import BackNavTitle from "../../components/BackNavTitle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { StaticDatePicker } from "@mui/x-date-pickers";
import Moment from "react-moment";
import dayjs from "dayjs";
import { useReducer } from "react";
import { timeIntervals } from "../../helpers/constants";
import { centerToast, confirmDeleteToast, topToast } from "../../toast";
import { Delete, DeleteForever, Edit } from "@mui/icons-material";
import bookingServices from "../../services/bookingServices";
import { useEffect } from "react";
import { formatDurationInHours } from "../../helpers";
import BookingDetailsModal from "../../components/BookingDetailsModal";
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import Swal from "sweetalert2";
import Layout from "../../components/Layout";
import AuthLayout from "../../components/AuthLayout";

import { getCookie, setCookie, deleteCookie } from "cookies-next";

const Container = styled.div``;
const MainRow = styled.div`
  display: flex;
`;
const MainLeft = styled.div`
  overflow-y: scroll;
  height: 100vh;
  padding: 32px 0;
  flex: 2;
  background-color: #e8e8e8;
  ${mobile({ width: "100%", paddingTop: "0px", height: "100vh" })}
  ${tablet({ width: "100%", paddingTop: "0px", height: "100vh" })}
`;

const MainRight = styled.div`
  flex: 1;
  ${mobile({ display: "none" })}
  ${tablet({ display: "none" })}
    ${desktop({ display: "block" })}
`;
const InnerLeft = styled.div`
  padding-left: 80px;
  padding-right: 80px;
  ${mobile({ padding: "0px 15px" })}
`;

// const Button = styled.button`
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   padding: 15px;
//   font-size: 14px;
//   background: #000000;
//   color: #ffffff;
//   border: none;
//   border-radius: 8px;
//   ${mobile({ fontSize: "12px", padding: "12px" })}
// `;

const Form = styled.form``;
const FormRow = styled.div``;
const Label = styled.div`
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 12px 14px 12px 14px;
  width: 100%;
  height: 48px;
  background: #f5f5f5;
  border-radius: 8px 8px 8px 8px;
  border: none;
  margin-bottom: 20px;
  &:focus {
    outline: none;
  }
`;
const InputTextarea = styled.textarea`
  padding: 12px 14px 12px 14px;
  width: 100%;
  background: #f5f5f5;
  border-radius: 8px 8px 8px 8px;
  border: none;
  margin-bottom: 20px;
  &:focus {
    outline: none;
  }
`;

const steps = {
  STEP_1_ENTER_DETAILS: "STEP_1_ENTER_DETAILS",
  STEP_2_ENTER_AVAILABILITY: "STEP_2_ENTER_AVAILABILITY",
};

const BookingsSetup = () => {
  const [state, updateState] = useReducer(
    (state, newState) => {
      const update = { ...state, ...newState };
      if (update.from >= update.to) {
        update.isTimeSlotFormValid = false;
      } else {
        update.isTimeSlotFormValid = true;
      }
      return update;
    },
    {
      title: "",
      description: "",
      duration: "",
      price: "",
      availability: {},
      breakTime: 0,
      isLoading: false,
      open: false,
      from: "00:00",
      to: "00:00",
      currentStep: steps.STEP_1_ENTER_DETAILS,
      dateTimeSlots: [],
      parentDate: "",
      selectedDate: "",
      selectedDateIndex: null,
      isTimeSlotFormValid: false,
      isLoadingBookings: false,
      bookings: [],
      openBookingDetailsModal: false,
      selectedBooking: null,
      isDeletingBooking: false,
    }
  );

  function addTimeSlot() {
    const { dateTimeSlots } = state;
    const newDateTimeSlots = [...dateTimeSlots];

    const dateExists = newDateTimeSlots.find(
      (item) => dayjs(item.date).toJSON() === dayjs(state.selectedDate).toJSON()
    );

    if (dateExists) {
      const timeSlots = [...dateExists.timeSlots];

      let newSLot = {
        from: state.from,
        to: state.to,
      };
      const timeSlotExists = timeSlots.find(
        (item) => JSON.stringify(item) === JSON.stringify(newSLot)
      );
      if (!timeSlotExists) {
        timeSlots.push(newSLot);
        dateExists.timeSlots = timeSlots;
      } else {
        topToast("error", "Time slot already exists");
      }
    }

    updateState({
      dateTimeSlots: newDateTimeSlots,
      open: false,
      from: "00:00",
      to: "00:00",
      isTimeSlotFormValid: false,
      selectedDate: "",
      selectedDateIndex: null,
    });
  }

  //

  function addDateHeadingToAvailability(date) {
    const { dateTimeSlots } = state;
    const newDateTimeSlots = [...dateTimeSlots];
    // check if date already exists in dateTimeSlots
    const dateExists = newDateTimeSlots.find(
      (item) => dayjs(item.date).toJSON() === dayjs(date).toJSON()
    );

    if (!dateExists) {
      newDateTimeSlots.push({
        date: dayjs(date).format("YYYY-MM-DD"),
        timeSlots: [],
      });
    }
    updateState({ dateTimeSlots: newDateTimeSlots });
  }
  function removeDateHeadingFromAvailability(index) {
    const { dateTimeSlots } = state;
    const newDateTimeSlots = [...dateTimeSlots];
    newDateTimeSlots.splice(index, 1);
    updateState({ dateTimeSlots: newDateTimeSlots });
  }

  function isFormValid(STEP) {
    switch (STEP) {
      case steps.STEP_1_ENTER_DETAILS:
        return (
          state.title && state.description && state.duration && state.price
        );
      case steps.STEP_2_ENTER_AVAILABILITY:
        return state.dateTimeSlots.length > 0;
      default:
        return false;
    }
  }

  function removeTimeSlot(index, date) {
    const { dateTimeSlots } = state;
    const newDateTimeSlots = [...dateTimeSlots];
    const dateExists = newDateTimeSlots.find(
      (item) => dayjs(item.date).toJSON() === dayjs(date).toJSON()
    );
    if (dateExists) {
      const timeSlots = [...dateExists.timeSlots];
      timeSlots.splice(index, 1);
      dateExists.timeSlots = timeSlots;
    }
    updateState({ dateTimeSlots: newDateTimeSlots });
  }

  async function saveBooking() {
    const { title, description, duration, price, dateTimeSlots } = state;
    const booking = {
      name: title,
      description,
      duration,
      price,
      availability: dateTimeSlots,
      breakTime: state.breaktime,
    };

    const doesAnyDateHaveEmptyTimeSlot = state.dateTimeSlots.find(
      (item) => item?.timeSlots?.length === 0
    );
    if (doesAnyDateHaveEmptyTimeSlot) {
      centerToast("error", "Sorry", "Please add time slots for all dates");
      return;
    }

    try {
      updateState({ isLoading: true });
      const { data } = await bookingServices.createBooking(booking);
      topToast("success", "Booking created successfully");
      getBookings();
      initState();
    } catch (error) {
      centerToast(
        "error",
        `${error?.response?.data?.message || "Sorry"}`,
        `
        ${error?.response?.data?.errors || "Something went wrong"}`
      );
    } finally {
      updateState({ isLoading: false });
    }
  }

  async function getBookings() {
    try {
      updateState({ isLoadingBookings: true });
      const { data } = await bookingServices.getBookings();
      updateState({ bookings: data.results.data });
    } catch (error) {
    } finally {
      updateState({ isLoadingBookings: false });
    }
  }

  function initState() {
    updateState({
      title: "",
      description: "",
      duration: "",
      price: "",
      availability: {},
      breakTime: 0,
      isLoading: false,
      open: false,
      from: "00:00",
      to: "00:00",
      currentStep: steps.STEP_1_ENTER_DETAILS,
      dateTimeSlots: [],
      parentDate: "",
      selectedDate: "",
      selectedDateIndex: null,
      isTimeSlotFormValid: false,
      isLoadingBookings: false,
    });
  }

  const trailingActions = (item, i) => (
    <TrailingActions>
      <SwipeAction
        destructive={false}
        onClick={() => {
          updateState({
            openBookingDetailsModal: true,
            selectedBooking: item,
          });
        }}
      >
        <Box className="swipe-to-delete-container">
          <DeleteForever sx={{ color: "white", mr: 2 }} fontSize="large" />
        </Box>
      </SwipeAction>
    </TrailingActions>
  );

  const leadingActions = () => (
    <LeadingActions>
      <SwipeAction onClick={() => console.info("swipe action triggered")}>
        Action name
      </SwipeAction>
    </LeadingActions>
  );

  function deleteBookingAction(id) {
    try {
      updateState({ isDeletingBooking: true });
      const { data } = bookingServices.deleteBooking(id);
      topToast("success", "Booking deleted successfully");
      getBookings();
    } catch (error) {
      updateState({ isDeletingBooking: false });
      centerToast(
        "error",
        `${error?.response?.data?.message || "Sorry"}`,
        `
            ${error?.response?.data?.errors || "Something went wrong"}`
      );
    } finally {
      updateState({ isDeletingBooking: false });
    }
  }

  async function deleteBooking(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBookingAction(id);
      }
    });
  }

  useEffect(() => {
    getBookings();
  }, []);
  // const username = JSON.parse(localStorage.getItem("nokofioProfile"))?.username;

  return (
    <Container className="animate__animated animate__fadeIn">
      <Modal
        open={state.open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalContainer>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            className="modal-header"
          >
            <Typography variant="h6" component="h2" id="modal-modal-title">
              Add Booking Slot
            </Typography>
            <CancelIcon
              onClick={() => {
                updateState({
                  open: false,
                  from: "00:00",
                  to: "00:00",
                  isTimeSlotFormValid: false,
                  selectedDate: "",
                  selectedDateIndex: null,
                });
              }}
            />
          </Box>
          <form action="">
            <Box mt={2}>
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {state.selectedDate}
                </Typography>
              </Box>
              <Grid alignItems={"center"} container spacing={2} mt={0.5} mb={2}>
                <Grid item xs={6}>
                  <FormControl sx={{ width: "100%" }} size="small">
                    <InputLabel id="demo-select-small">From</InputLabel>
                    <Select
                      label="From"
                      value={state.from}
                      onChange={(e) => {
                        updateState({ from: e.target.value });
                      }}
                    >
                      {/* <MenuItem value="">
                        <em>None</em>
                      </MenuItem> */}
                      {timeIntervals.map((item, index) => (
                        <MenuItem key={index} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl sx={{ width: "100%" }} size="small">
                    <InputLabel id="demo-select-small">To</InputLabel>
                    <Select
                      value={state.to}
                      label="To"
                      onChange={(e) => {
                        updateState({ to: e.target.value });
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {timeIntervals.map((item, index) => (
                        <MenuItem key={index} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            <Box mt={3} display={"flex"} justifyContent={"end"}>
              <Button
                disabled={!state.isTimeSlotFormValid}
                sx={{
                  textTransform: "capitalize",
                }}
                variant="contained"
                onClick={() => {
                  addTimeSlot();
                  updateState({ open: false });
                }}
              >
                Add Slot
              </Button>
            </Box>
          </form>
        </ModalContainer>
      </Modal>
      <BookingDetailsModal
        selectedBooking={state.selectedBooking}
        open={state.openBookingDetailsModal}
        onDismissed={() => {
          updateState({ openBookingDetailsModal: false });
        }}
      />
      <MainRow>
        <MainLeft>
          <UserShare />
          <InnerLeft>
            <BackNavTitle title={"Bookings Setup"} />
            <FormContainer>
              {state.currentStep === steps.STEP_1_ENTER_DETAILS ? (
                <>
                  <FormRow>
                    <Label>Title</Label>
                    <Input
                      required
                      maxLength={100}
                      placeholder="Enter a title"
                      onChange={(e) => {
                        updateState({ title: e.target.value });
                      }}
                      value={state.title}
                    />
                  </FormRow>
                  <FormRow>
                    <Label> Description</Label>
                    <InputTextarea
                      required
                      maxLength={200}
                      placeholder="Describe the situation and give succint reason why we people should donate"
                      onChange={(e) => {
                        updateState({ description: e.target.value });
                      }}
                      value={state.description}
                    />
                  </FormRow>
                  <FormRow style={{ marginBottom: "15px" }}>
                    <Label>Duration</Label>
                    <SelectContainer>
                      <FormSelect
                        required
                        onChange={(e) => {
                          updateState({ duration: e.target.value });
                        }}
                        value={state.duration}
                      >
                        <FormOption value={""}>Choose Duration</FormOption>
                        <FormOption value={"30"}>30 mins</FormOption>
                        <FormOption value={"60"}>1 hour</FormOption>
                        <FormOption value={"90"}>1 hour 30 mins</FormOption>
                        <FormOption value={"120"}>2 hours</FormOption>
                      </FormSelect>
                    </SelectContainer>
                  </FormRow>
                  <FormRow>
                    <Label>Price</Label>
                    <Input
                      required
                      maxLength={100}
                      placeholder="Enter price"
                      type={"number"}
                      onChange={(e) => {
                        updateState({ price: e.target.value });
                      }}
                      value={state.price}
                    />
                  </FormRow>

                  <Box display={"flex"} justifyContent={"end"} mt={3}>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      variant="contained"
                      disabled={!isFormValid(steps.STEP_1_ENTER_DETAILS)}
                      onClick={() => {
                        updateState({
                          currentStep: steps.STEP_2_ENTER_AVAILABILITY,
                        });
                      }}
                    >
                      Next
                    </Button>
                  </Box>
                </>
              ) : null}
              {state.currentStep === steps.STEP_2_ENTER_AVAILABILITY ? (
                <>
                  <Box mt={-5}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <StaticDatePicker
                          disablePast={true}
                          onChange={(e) => {
                            updateState({ parentDate: dayjs(e) });
                            addDateHeadingToAvailability(dayjs(e));
                          }}
                          value={state.parentDate}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box display={"flex"} alignItems={"center"} my={3}>
                    <Typography variant="subtitle" fontWeight={600}>
                      Booking Slots
                    </Typography>
                  </Box>

                  {state.dateTimeSlots.map((item, index) => (
                    <Box key={index}>
                      <Box display={"flex"} alignItems={"center"} gap={1}>
                        <Typography variant="body1" fontWeight={600}>
                          {dayjs(item?.date).format("DD MMM YYYY")}
                        </Typography>
                        <AddCircleIcon
                          className="pointer"
                          onClick={() => {
                            updateState({
                              open: true,
                              selectedDateIndex: index,
                              selectedDate: item?.date,
                            });
                          }}
                        />
                        <Delete
                          className="pointer"
                          onClick={() => {
                            removeDateHeadingFromAvailability(index);
                          }}
                        />
                      </Box>
                      {item?.timeSlots.map((slot, index) => (
                        <Grid
                          alignItems={"center"}
                          key={index}
                          container
                          spacing={2}
                          mt={0.5}
                          mb={2}
                        >
                          <Grid item xs={5}>
                            <FormControl sx={{ width: "100%" }}>
                              <Input
                                style={{ marginBottom: "0px" }}
                                required
                                maxLength={100}
                                readOnly
                                value={slot.from}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={5}>
                            <FormControl sx={{ width: "100%" }}>
                              <Input
                                style={{ marginBottom: "0px" }}
                                required
                                maxLength={100}
                                readOnly
                                value={slot.to}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={1}>
                            <CancelIcon
                              className="pointer"
                              onClick={() => {
                                removeTimeSlot(index, item?.date);
                              }}
                            />
                          </Grid>
                        </Grid>
                      ))}
                    </Box>
                  ))}

                  <Box display={"flex"} justifyContent={"end"} mt={3} gap={2}>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      variant="outlined"
                      onClick={() => {
                        updateState({
                          currentStep: steps.STEP_1_ENTER_DETAILS,
                        });
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      variant="contained"
                      disabled={!isFormValid(steps.STEP_2_ENTER_AVAILABILITY)}
                      onClick={() => {
                        saveBooking();
                      }}
                    >
                      Save
                      {state.isLoading && (
                        <CircularProgress size={20} sx={{ color: "white" }} />
                      )}
                    </Button>
                  </Box>
                </>
              ) : null}
            </FormContainer>

            <Box
              sx={{
                background: "#ffffff",
                borderRadius: "8px",
                padding: "20px",
                mt: 3,
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={2}>
                Booking Slots
              </Typography>
              {state.bookings.length > 0 ? (
                <SwipeableList listType={"IOS"}>
                  {state.bookings.map((item, index) => (
                    <Box
                      key={index}
                      display={"flex"}
                      alignItems={"center"}
                      gap={1}
                      mb={2}
                      sx={{
                        height: "100%",
                      }}
                    >
                      <SwipeableListItem
                        fullSwipe={false}
                        listType={"IOS"}
                        destructiveCallbackDelay={3000}
                        //   trailingActions={trailingActions(item, index)}
                        //   leadingActions={leadingActions(item, index)}
                      >
                        <Box
                          sx={{
                            background: "#E8E8E8",
                            width: "100%",
                          }}
                          key={index}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          p={2}
                          borderRadius={"8px"}
                          className="pointer"
                          onClick={() => {
                            updateState({
                              openBookingDetailsModal: true,
                              selectedBooking: item,
                            });
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                fontSize: {
                                  xs: "14px",
                                  md: "16px",
                                },
                              }}
                              mb={0.5}
                              variant="body1"
                              fontWeight={500}
                            >
                              {item?.name}
                            </Typography>
                            <Typography
                              variant="body1"
                              color={"GrayText"}
                              fontWeight={400}
                              sx={{
                                fontSize: {
                                  xs: "12px",
                                  md: "14px",
                                },
                              }}
                            >
                              {formatDurationInHours(item?.duration)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                fontSize: {
                                  xs: "14px",
                                  md: "16px",
                                },
                              }}
                              variant="body1"
                              fontWeight={500}
                            >
                              {item?.price > 0 ? `GHS${item?.price}` : "Free"}
                            </Typography>
                          </Box>
                        </Box>
                      </SwipeableListItem>

                      <Box>
                        <IconButton size="small">
                          <Edit
                            onClick={() => {
                              updateState({
                                openBookingDetailsModal: true,
                                selectedBooking: item,
                              });
                            }}
                          />
                        </IconButton>
                      </Box>
                      <Box>
                        <IconButton size="small">
                          {state.isDeletingBooking &&
                          state.selectedBooking?.id === item?.id ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: "white" }}
                            />
                          ) : (
                            <Delete
                              color="error"
                              onClick={() => {
                                updateState({
                                  selectedBooking: item,
                                });
                                deleteBooking(item?.id);
                              }}
                            />
                          )}
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </SwipeableList>
              ) : (
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  gap={1}
                  justifyContent={"center"}
                >
                  {/* //No data */}
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    color={"GrayText"}
                    my={3}
                  >
                    No bookings yet
                  </Typography>
                </Box>
              )}
            </Box>
          </InnerLeft>
        </MainLeft>
        <MainRight>
          <DashboardRight />
        </MainRight>
      </MainRow>
    </Container>
  );
};

export default BookingsSetup;

BookingsSetup.getLayout = function getLayout(page) {
  return (
    <Layout>
      <AuthLayout>{page}</AuthLayout>{" "}
    </Layout>
  );
};
