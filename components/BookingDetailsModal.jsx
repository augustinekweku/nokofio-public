import {
  Box,
  FormControl,
  Grid,
  Modal,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React from "react";
import {
  FormOption,
  FormSelect,
  InputTextarea,
  ModalContainer,
  SelectContainer,
} from "../StyledComponents/common";
import styled from "styled-components";
import CancelIcon from "@mui/icons-material/Cancel";
import { useReducer } from "react";
import PropTypes from "prop-types";
import { Calendar } from "react-multi-date-picker";
import { useEffect } from "react";
import { AddCircle, Delete, Edit } from "@mui/icons-material";
import dayjs from "dayjs";

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

const Label = styled.div`
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  margin-bottom: 6px;
`;

function TabPanel(props) {
  const { children, tabValue, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={tabValue !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {tabValue === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  tabValue: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const BookingDetailsModal = ({ selectedBooking, open, onDismissed }) => {
  const [state, updateState] = useReducer(
    (state, newState) => {
      const update = { ...state, ...newState };
      return update;
    },
    {
      title: selectedBooking?.name,
      description: selectedBooking?.description,
      duration: selectedBooking?.duration,
      price: selectedBooking?.price,
      tabValue: 0,
      selectedDates: selectedBooking?.dates,
    }
  );

  useEffect(() => {
    function getAllDatesFromBooking() {
      const dates = [];
      selectedBooking?.appointmentSlots?.forEach((date) => {
        dates.push(new Date(date.day));
      });
      updateState({ selectedDates: dates });
    }
    getAllDatesFromBooking();
  }, [selectedBooking?.appointmentSlots]);

  const handleChange = (event, newValue) => {
    updateState({ tabValue: newValue });
  };
  return (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalContainer>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            className="modal-header"
          >
            <Typography variant="h6" id="modal-modal-title">
              Booking Details
            </Typography>
            <CancelIcon
              onClick={() => {
                onDismissed();
              }}
            />
          </Box>
          <Box mt={2}>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={state.tabValue}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="BOOKING DETAILS" {...a11yProps(0)} />
                  <Tab label="DATE AND TIME SLOTS" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <Box
                overflow={"scroll"}
                sx={{
                  maxHeight: "calc(100vh - 200px)",
                }}
              >
                <TabPanel tabValue={state.tabValue} index={0}>
                  <form
                    action="
              "
                  >
                    <Box>
                      <Label>Title</Label>
                      <Input
                        required
                        maxLength={100}
                        placeholder="Enter a title"
                        onChange={(e) => {
                          updateState({ title: e.target.value });
                        }}
                        value={selectedBooking?.name}
                      />
                    </Box>
                    <Box>
                      <Label> Description</Label>
                      <InputTextarea
                        required
                        maxLength={200}
                        placeholder="Describe the situation and give succint reason why we people should donate"
                        onChange={(e) => {
                          updateState({ description: e.target.value });
                        }}
                        value={selectedBooking?.description}
                      />
                    </Box>
                    <Box style={{ marginBottom: "15px" }}>
                      <Label>Duration</Label>
                      <SelectContainer>
                        <FormSelect
                          required
                          onChange={(e) => {
                            updateState({ duration: e.target.value });
                          }}
                          value={selectedBooking?.duration}
                        >
                          <FormOption value={""}>Choose Duration</FormOption>
                          <FormOption value={"30"}>30 mins</FormOption>
                          <FormOption value={"60"}>1 hour</FormOption>
                          <FormOption value={"90"}>1 hour 30 mins</FormOption>
                          <FormOption value={"120"}>2 hours</FormOption>
                        </FormSelect>
                      </SelectContainer>
                    </Box>
                    <Box>
                      <Label>Price</Label>
                      <Input
                        required
                        maxLength={100}
                        placeholder="Enter price"
                        type={"number"}
                        onChange={(e) => {
                          updateState({ price: e.target.value });
                        }}
                        value={selectedBooking?.price}
                      />
                    </Box>
                  </form>
                </TabPanel>
                <TabPanel tabValue={state.tabValue} index={1}>
                  <Box display={"flex"} justifyContent={"center"}>
                    <Calendar
                      className="custom-calendar"
                      value={state.selectedDates}
                      readOnly={true}
                      disabled={true}
                    />
                  </Box>
                  <Box mt={5}>
                    {selectedBooking?.appointmentSlots?.map((item, index) => (
                      <Box key={index}>
                        <Box display={"flex"} alignItems={"center"} gap={1}>
                          <Typography variant="body1" fontWeight={600}>
                            {dayjs(item?.date).format("DD MMM YYYY")}
                          </Typography>
                          <AddCircle className="pointer" />
                          <Delete className="pointer" />
                        </Box>
                        {item?.timeSlots?.map((slot, index) => (
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
                                  value={slot?.startTime || slot?.from}
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
                                  value={slot?.endTime || slot?.to}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={1}>
                              <Edit className="pointer" />
                            </Grid>
                            <Grid item xs={1}>
                              <CancelIcon className="pointer" />
                            </Grid>
                          </Grid>
                        ))}
                      </Box>
                    ))}
                  </Box>
                </TabPanel>
              </Box>
            </Box>
          </Box>
        </ModalContainer>
      </Modal>
    </>
  );
};

export default BookingDetailsModal;
