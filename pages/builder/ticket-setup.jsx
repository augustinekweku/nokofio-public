import styled from "styled-components";

import { mobile } from "../../responsive";
import { tablet, desktop } from "../../responsive";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";

import DashboardRight from "../../components/DashboardRight";
import UserShare from "../../components/UserShareRow";

import BackNavTitle from "../../components/BackNavTitle";
import CancelIcon from "@mui/icons-material/Cancel";

import {
  Btn,
  CloseButton,
  FormContainer,
  ModalContainer,
  ModalContent,
  ModalTop,
  TopRight,
} from "../../StyledComponents/common";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, CircularProgress, Grid, Modal } from "@mui/material";
import { useState } from "react";
import AddTicket from "../../components/AddTicket";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTicketArray,
  updateTicketArray,
} from "../../redux/addTicketRedux";
import ticketServices from "../../services/TicketService";
import { useReducer } from "react";
import { topToast } from "../../toast";
import { ShimmerThumbnail } from "react-shimmer-effects";
import { useEffect } from "react";
import { async } from "@firebase/util";
import Layout from "../../components/Layout";
import AuthLayout from "../../components/AuthLayout";
import { DateTimePicker } from "@mui/x-date-pickers";

const Container = styled.div``;
const MainRow = styled.div`
  display: flex;
`;
const MainLeft = styled.div`
  height: 100vh;
  overflow-y: scroll;
  padding-top: 32px;
  padding-bottom: 32px;
  flex: 2;
  background-color: #e8e8e8;
  ${mobile({ width: "100%", paddingTop: "0px" })}
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

const Form = styled.form``;
const FormRow = styled.div``;
const FormRowFlex = styled.div`
  display: flex;
  justify-content: space-between;
  ${tablet({ flexDirection: "column" })};
  ${mobile({ flexDirection: "column" })};
  ${desktop({ flexDirection: "row" })};
`;
const FormCol = styled.div``;

const Label = styled.div`
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  margin-bottom: 12px;
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
const TicketInput = styled.input`
  padding: 12px 14px 12px 14px;
  font-size: 12px;
  width: 200px;
  height: 48px;
  background: #f5f5f5;
  border-radius: 8px 8px 8px 8px;
  border: none;
  margin-bottom: 20px;
  &:focus {
    outline: none;
  }
`;

const FormActionRow = styled.div`
  margin: 20px 0 0 0;
`;

const CardsContainer = styled.div`
  margin-top: 100px;
  margin-bottom: 100px;
`;

const TicketCardRow = styled.div`
  display: flex;
  align-items: center;
`;
const TicketCardWrapper = styled.div`
  flex: 5;
`;
const TicketCardInnerWrapper = styled.div`
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: #f6f2e9;
`;
const AccordionCardInnerWrapper = styled.div`
  border-radius: 8px;
  align-items: center;
  padding: 24px;
  background: #f6f2e9;
`;
const TicketCardInnerleft = styled.div``;
const TicketCardInnerRight = styled.div``;
const TicketCardTitle = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  ${mobile({ fontSize: "14px" })}
`;
const TicketCardDesc = styled.div`
  font-size: 12px;
  font-weight: 400;
  ${mobile({ fontSize: "14px" })}
`;
const TicketAmount = styled.div`
  font-size: 20px;
  font-weight: 600;
  ${mobile({ fontSize: "14px" })}
`;
const TicketCardActions = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;
const TicketCardIcon = styled.div`
  background: #dad8d8;
  padding: 17px;
  border-radius: 50%;
  height: 50px;
  width: 50px;
  ${mobile({ height: "40px", width: "40px" })}
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Subheading = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  padding-left: 12px;
`;

const AccordionTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
`;
const TicketWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
`;
const AddLink = styled.div`
  border: 1px dashed #979797;
  padding: 14px 0px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
`;

const TicketSetup = () => {
  const ticketArr = useSelector((state) => state?.ticketArr?.ticketArray);
  const dispatch = useDispatch();
  const [state, updateState] = useReducer(
    (state, newState) => {
      const update = { ...state, ...newState };

      if (
        update.eventTitle &&
        update.eventDesc &&
        update.eventDate &&
        update.eventLocation
      ) {
        update.isFormValid = true;
      } else {
        update.isFormValid = false;
      }
      return update;
    },
    {
      addTicketClose: true,
      isEditing: false,
      editObj: {},
      eventTitle: "",
      editingIndex: null,
      eventDesc: "",
      eventDate: "",
      eventLocation: "",
      ticketArr: [],
      isAddingTicket: false,
      isLoadingTickets: false,
      savedTikcets: [],
      isDeletingTicket: false,
      deletingIndex: null,
      isFormValid: false,
    }
  );

  const deleteTicket = (ticket, i) => {
    let arr = ticketArr;
    const newArr = arr.filter((obj, objIndex) => objIndex !== i);
    dispatch(updateTicketArray(newArr));
  };
  const editTicket = (ticket, i) => {
    updateState({
      addTicketClose: false,
      isEditing: true,
      editObj: ticket,
      editingIndex: i,
    });
  };

  const createEvent = async (e) => {
    e.preventDefault();
    if (ticketArr.length === 0) {
      topToast("error", "Please add at least one ticket");
      return;
    }
    updateState({ isAddingTicket: true });
    try {
      const { data } = await ticketServices.createTicket({
        eventTitle: state.eventTitle,
        eventDate: state.eventDate,
        eventDescription: state.eventDesc,
        eventLocation: state.eventLocation,
        ticketTypes: ticketArr,
      });
      initState();
      topToast("success", "Ticket created successfully");
      getTickets();
    } catch (error) {
      updateState({ isAddingTicket: false });
    } finally {
      initState();
    }
  };

  const closeAddTicket = () => {
    updateState({
      addTicketClose: true,
      isEditing: false,
      editObj: {},
      editingIndex: null,
    });
  };
  function initState() {
    updateState({
      eventTitle: "",
      eventDesc: "",
      eventDate: "",
      eventLocation: "",
      addTicketClose: true,
      isEditing: false,
      editObj: {},
      editingIndex: null,
      isAddingTicket: false,
      isFormValid: false,
    });
    dispatch(updateTicketArray([]));
  }
  async function getTickets() {
    try {
      updateState({ isLoadingTickets: true });
      const { data } = await ticketServices.getTickets();
      updateState({
        savedTickets: data.results,
      });
    } catch (error) {
    } finally {
      updateState({ isLoadingTickets: false });
    }
  }

  async function deleteSavedTicket(id) {
    try {
      updateState({ isDeletingTicket: true, deletingIndex: id });
      const res = await ticketServices.deleteTicket(id);
      getTickets();
      topToast("success", "Ticket deleted successfully");
    } catch (error) {
      updateState({ isDeletingTicket: false, deletingIndex: null });
    } finally {
      updateState({ isDeletingTicket: false, deletingIndex: null });
    }
  }

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <Container className="animate__animated animate__fadeIn">
      {!state.addTicketClose && (
        <AddTicket
          setAddTicketClose={state.addTicketClose}
          closeAddTicket={closeAddTicket}
          setIsEditing={state.isEditing}
          isEditing={state.isEditing}
          editObj={state.editObj}
          editingIndex={state.editingIndex}
        />
      )}
      <MainRow>
        <MainLeft>
          <UserShare />
          <InnerLeft>
            <BackNavTitle title={"Ticket Setup"} />
            <Form onSubmit={createEvent}>
              <FormContainer>
                <FormRow>
                  <Label>Event Title</Label>
                  <Input
                    required
                    value={state.eventTitle}
                    onChange={(e) =>
                      updateState({ eventTitle: e.target.value })
                    }
                    placeholder="Enter title of program or concert"
                  />
                </FormRow>
                <FormRow>
                  <Label>Event Description</Label>
                  <Input
                    value={state.eventDesc}
                    required
                    onChange={(e) => updateState({ eventDesc: e.target.value })}
                    placeholder="Enter a short description of the event"
                  />
                </FormRow>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormRow>
                      <Label>Event Date</Label>
                      <Input
                        type={"datetime-local"}
                        required
                        value={state.eventDate}
                        onChange={(e) =>
                          updateState({ eventDate: e.target.value })
                        }
                        placeholder="Enter the location of the event"
                      />
                    </FormRow>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormRow>
                      <Label>Event Location</Label>
                      <Input
                        required
                        value={state.eventLocation}
                        onChange={(e) =>
                          updateState({ eventLocation: e.target.value })
                        }
                        placeholder="Enter the location of the event"
                      />
                    </FormRow>
                  </Grid>
                </Grid>

                {ticketArr
                  ? ticketArr.map((ticket, i) => (
                      <TicketWrapper
                        key={i}
                        className="animate__animated animate__fadeIn"
                        style={{ cursor: "pointer" }}
                      >
                        <TicketCardInnerWrapper
                          onClick={() => editTicket(ticket, i)}
                          style={{ flexGrow: "1" }}
                        >
                          <TicketCardInnerleft>
                            <TicketCardTitle>
                              {ticket.name} ({ticket.quantity} left)
                            </TicketCardTitle>
                            <TicketCardDesc>{ticket.name}</TicketCardDesc>
                          </TicketCardInnerleft>
                          <TicketCardInnerRight>
                            <TicketAmount>GHS {ticket.price}</TicketAmount>
                          </TicketCardInnerRight>
                        </TicketCardInnerWrapper>
                        <div
                          style={{
                            display: "flex",
                            background: "#efefef",
                            padding: "5px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          <CloseIcon
                            fontSize="small"
                            onClick={() => deleteTicket(ticket, i)}
                          />
                        </div>
                      </TicketWrapper>
                    ))
                  : null}
                <AddLink
                  onClick={() => {
                    updateState({ addTicketClose: false });
                  }}
                >
                  {" "}
                  Add ticket
                </AddLink>
                <FormActionRow>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={state.isAddingTicket || !state.isFormValid}
                    sx={{
                      textTransform: "capitalize",
                    }}
                  >
                    Submit &nbsp;
                    {state.isAddingTicket ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : null}
                  </Button>
                </FormActionRow>
              </FormContainer>
            </Form>

            <CardsContainer>
              <Subheading>Tickets</Subheading>
              {state.isLoadingTickets ? (
                <>
                  <ShimmerThumbnail height={120} rounded />
                </>
              ) : null}

              {state?.savedTickets?.length === 0 ? (
                <Box textAlign={"center"} py={2}>
                  <Typography>No tickets found</Typography>
                </Box>
              ) : (
                <>
                  {state?.savedTickets?.map((ticket, i) => (
                    <TicketCardRow style={{ marginBottom: "15px" }} key={i}>
                      <TicketCardWrapper>
                        <AccordionCardInnerWrapper>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                            >
                              <AccordionTitle>
                                {ticket.eventTitle}
                              </AccordionTitle>
                            </AccordionSummary>
                            <AccordionDetails>
                              {ticket.ticketTypes.map((ticketType, i) => (
                                <TicketCardInnerWrapper
                                  style={{ marginBottom: "15px" }}
                                  key={i}
                                >
                                  <TicketCardInnerleft>
                                    <TicketCardTitle>
                                      {ticketType.name} ({ticketType.quantity}{" "}
                                      left)
                                    </TicketCardTitle>
                                    <TicketCardDesc>
                                      {ticketType.name}
                                    </TicketCardDesc>
                                  </TicketCardInnerleft>
                                  <TicketCardInnerRight>
                                    <TicketAmount>
                                      GHS {ticketType.price}
                                    </TicketAmount>
                                  </TicketCardInnerRight>
                                </TicketCardInnerWrapper>
                              ))}
                            </AccordionDetails>
                          </Accordion>
                        </AccordionCardInnerWrapper>
                      </TicketCardWrapper>
                      <TicketCardActions>
                        <TicketCardIcon>
                          {state.isDeletingTicket &&
                          state.deletingIndex === ticket.id ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: "white" }}
                            />
                          ) : (
                            <>
                              <DeleteIcon
                                onClick={() => deleteSavedTicket(ticket.id)}
                                sx={{ color: red[500] }}
                              />
                            </>
                          )}
                        </TicketCardIcon>
                      </TicketCardActions>
                    </TicketCardRow>
                  ))}
                </>
              )}
            </CardsContainer>
          </InnerLeft>
        </MainLeft>
        <MainRight>
          <DashboardRight />
        </MainRight>
      </MainRow>
    </Container>
  );
};

export default TicketSetup;

TicketSetup.getLayout = function getLayout(page) {
  return (
    <Layout>
      <AuthLayout>{page}</AuthLayout>{" "}
    </Layout>
  );
};
