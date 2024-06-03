/* eslint-disable @next/next/no-img-element */
import styled from "styled-components";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import CancelIcon from "@mui/icons-material/Cancel";
import { desktop, mobile } from "../responsive";
import { useReducer } from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/legacy/image";
import ticketServices from "../services/TicketService";
import { useEffect } from "react";
import { FormRow, Input, Label, LabelSpan } from "../pages/builder/bio";

import { PaystackButton } from "react-paystack";
import clsx from "clsx";
import Moment from "react-moment";
import { centerToast } from "../toast";

const LinkCard = styled.div`
  background-color: #353432;
  padding: 23px 32px;
  color: #fff;
  border-radius: 5px;
  margin-bottom: 16px;
`;
const ModalContainer = styled.div`
  width: 600px;
  padding: 16px 32px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: "all 0.5s ease";
  background: #e8e8e8;
  box-shadow: 24;
  border-radius: 10px;
  max-height: 85vh;
  ${mobile({
    width: "90%",
    padding: "16px 20px",
    maxHeight: "85vh",
    overflow: "scroll",
  })};
  ${desktop({
    width: "600px",
    padding: "16px 32px",
  })};
  &:focus {
    outline: none;
  }
`;
const ModalTop = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const TopRight = styled.div``;
const CloseButton = styled.div`
  cursor: pointer;
`;

const ModalContent = styled.div``;
const Title = styled.div`
  font-family: Poppins;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 8px;
`;
const SubText = styled.div``;
const Divider = styled.hr`
  width: 100%;
  height: 2px;
  margin-bottom: 36px;
`;

const Button = styled.button`
  border: none;
  background: #141414;
  padding: 15px 144px;
  width: 100%;
  border-radius: 1000px;
  color: #fff;
  margin-bottom: 20px;
  ${mobile({ padding: "13px 100px" })}
`;
const TicketCard = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  margin-bottom: 32px;
  background: #fff;
  color: #000000db;
  border-radius: 5px;
  ${mobile({ padding: "24px 18px" })}
`;
const LeftColumn = styled.div``;

const RightColumn = styled.div`
  font-family: Poppins;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;

  ${mobile({ fontSize: "18px" })}
`;
const TicketTitle = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  margin-bottom: 4px;
`;

const SubTitle = styled.div`
  font-family: Poppins;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
`;

const STEPS = {
  SELECT_EVENT: "SELECT_EVENT",
  SELECT_TICKET_TYPE: "SELECT_TICKET_TYPE",
  ENTER_DETAILS: "ENTER_DETAILS",
};

const BuyTicketLink = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const [state, updateState] = useReducer(
    (state, newState) => {
      const update = { ...state, ...newState };
      update.ticketQuantity = parseInt(update.ticketQuantity);
      if (
        update.payeeName &&
        update.payeePhoneNumber &&
        update.selectedTicketType &&
        update.ticketQuantity > 0
      ) {
        update.isFormValid = true;
      } else {
        update.isFormValid = false;
      }

      return update;
    },
    {
      currentStep: STEPS.SELECT_EVENT,
      selectedEvent: null,
      selectedTicketType: null,
      ticketSaleId: null,
      ticketQuantity: 1,
      payeeName: "",
      payeePhoneNumber: "",
      payeeEmail: "",
      events: [],
      isLoadingEvents: false,
      isFormValid: false,
      nokofioProfile: null,
    }
  );

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  useEffect(() => {
    async function getEventsForPublic() {
      var nokofioProfile = localStorage.getItem("nokofioPublicProfile");
      if (nokofioProfile) {
        var username = JSON.parse(nokofioProfile).username;
        try {
          updateState({ isLoadingEvents: true });
          const { data } = await ticketServices.getEventsForPublic(username);
          updateState({ events: data.results, isLoadingEvents: false });
        } catch (error) {
        } finally {
          updateState({ isLoadingEvents: false });
        }
      }
    }
    getEventsForPublic();
  }, []);

  function initState() {
    updateState({
      currentStep: STEPS.SELECT_EVENT,
      selectedEvent: null,
      ticketSaleId: null,
      selectedTicketType: null,
      ticketQuantity: 1,
      payeeName: "",
      payeePhoneNumber: "",
      payeeEmail: "",
    });
  }

  useEffect(() => {
    initState();
  }, [open]);

  useEffect(() => {
    var nokofioProfile = localStorage.getItem("nokofioPublicProfile");
    //check if localstorage has nokofio profile
    if (nokofioProfile) {
      updateState({ nokofioProfile: JSON.parse(nokofioProfile) });
    }
  }, []);

  const componentProps = {
    email: state?.nokofioProfile?.username + "@nokofio.me",
    amount: state?.selectedTicketType?.price * state?.ticketQuantity * 100,
    phone: state?.payeePhoneNumber,
    currency: "GHS",
    metadata: {
      senderName: state?.payeeName,
      senderPhoneNumber: state?.payeePhoneNumber,
      transactionType: "ticketing",
      ticketSaleId: state?.ticketSaleId,
      senderEmail: state?.payeeEmail,
      receiverUsername: state.nokofioProfile?.username,
      quantity: state?.ticketQuantity,
    },
    publicKey,
    text: "Pay GHS " + state.selectedTicketType?.price * state?.ticketQuantity,
    onSuccess: () => onSucessPayStack(),
    // onClose: () => onClosePayStack(),
  };

  const onSucessPayStack = async () => {
    setOpen(false);
    centerToast(
      "success",
      "Congrats",
      "Your ticket will be sent to you shortly"
    );
  };

  const buyTicket = async (ticketTypeId) => {
    try {
      const { data } = await ticketServices.buyTicket({
        ticketTypeId: ticketTypeId,
      });
      updateState({ ticketSaleId: data.results.id });
    } catch (error) {
    } finally {
    }
  };

  return (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalContainer className="modal">
          <ModalTop>
            <TopRight>
              <CloseButton>
                <CancelIcon onClick={handleClose} />
              </CloseButton>
            </TopRight>
          </ModalTop>
          <ModalContent>
            {
              // if the current step is select event
              state.currentStep === STEPS.SELECT_EVENT ? (
                <>
                  <Title>Buy a Ticket</Title>
                  <Divider></Divider>
                  {
                    // map over the tickets
                    state?.events?.map((event, index) => (
                      <TicketCard
                        onClick={() => {
                          updateState({
                            selectedEvent: event,
                            currentStep: STEPS.SELECT_TICKET_TYPE,
                          });
                        }}
                        key={index}
                      >
                        <LeftColumn>
                          <TicketTitle>{event?.eventTitle}</TicketTitle>
                          <SubTitle>{event?.eventDescription} </SubTitle>
                          <SubTitle>
                            {" "}
                            <Moment format="MMM DD, YYYY • h:mm A">
                              {event?.eventDate}
                            </Moment>{" "}
                          </SubTitle>
                        </LeftColumn>
                        <RightColumn className="d-none"></RightColumn>
                      </TicketCard>
                    ))
                  }
                </>
              ) : null
            }
            {
              // if the current step is select ticket type
              state.currentStep === STEPS.SELECT_TICKET_TYPE ? (
                <>
                  <Box>
                    <Box mb={3} mt={1} width={"100%"} height={"250px"}>
                      {/*  eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          state.selectedEvent?.eventImage ||
                          "/images/event-placeholder.png"
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "14px",
                        }}
                        alt="event image"
                      />
                    </Box>
                    <Box mb={3} mt={1}>
                      <Typography variant="h6" fontWeight={"bold"}>
                        {state.selectedEvent?.eventTitle}
                      </Typography>

                      <Typography variant="body2">
                        {state.selectedEvent?.eventDescription}
                      </Typography>

                      <Box
                        mt={2}
                        display={"flex"}
                        alignItems={"center"}
                        gap={2}
                      >
                        <img
                          src="/images/svg/date-icon.svg"
                          alt=""
                          height={25}
                          width={25}
                        />

                        <Typography variant="body2" color={"GrayText"}>
                          <Moment format="MMM DD, YYYY">
                            {state.selectedEvent?.eventDate}
                          </Moment>
                          <br />
                          <Moment format="h:mm A">
                            {state.selectedEvent?.eventDate}
                          </Moment>
                        </Typography>
                      </Box>
                      <Box
                        mt={2}
                        display={"flex"}
                        alignItems={"center"}
                        gap={2}
                      >
                        <img
                          src="/images/svg/location-icon.svg"
                          alt=""
                          height={25}
                          width={25}
                        />

                        <Typography variant="body2" color={"GrayText"}>
                          Location <br />
                          {state.selectedEvent?.eventLocation}
                        </Typography>
                      </Box>
                    </Box>

                    <Box mb={3} mt={1}>
                      {
                        // map over the tickets
                        state.selectedEvent?.ticketTypes?.map(
                          (ticketType, index) => (
                            <TicketCard
                              onClick={() => {
                                buyTicket(ticketType.id);
                                updateState({ selectedTicketType: ticketType });
                                updateState({
                                  currentStep: STEPS.ENTER_DETAILS,
                                });
                              }}
                              key={index}
                            >
                              <LeftColumn>
                                <TicketTitle>{ticketType?.name}</TicketTitle>
                                <SubTitle>
                                  {ticketType?.ticketDescription}{" "}
                                </SubTitle>
                                <SubTitle>{ticketType?.price}</SubTitle>
                              </LeftColumn>
                              <RightColumn>GHS{ticketType?.price}</RightColumn>
                            </TicketCard>
                          )
                        )
                      }
                    </Box>
                  </Box>
                </>
              ) : null
            }

            {
              // if the current step is enter details
              state.currentStep === STEPS.ENTER_DETAILS ? (
                <>
                  <Box>
                    <Box>
                      <Typography variant="h6" fontWeight={"bold"}>
                        {state.selectedTicketType?.name}
                      </Typography>
                      {/* <Typography variant="body2">Sales end on 25th</Typography> */}

                      <Typography variant="h6" fontWeight="bold">
                        GHS {state.selectedTicketType?.price}
                      </Typography>

                      <Divider
                        style={{
                          marginTop: "20px",
                        }}
                      />

                      <FormRow>
                        <Label> Name</Label>
                        <Input
                          value={state.payeeName}
                          onChange={(e) => {
                            updateState({
                              payeeName: e.target.value,
                            });
                          }}
                          placeholder="eg. Samuel Obeng"
                          maxLength="30"
                        />
                      </FormRow>
                      <FormRow>
                        <Label> Phone Number</Label>
                        <Input
                          value={state.payeePhoneNumber}
                          onChange={(e) => {
                            updateState({
                              payeePhoneNumber: e.target.value,
                            });
                          }}
                          placeholder="0240000002"
                          maxLength="10"
                        />
                      </FormRow>
                      <FormRow>
                        <Label> Email (Optional)</Label>
                        <Input
                          value={state.payeeEmail}
                          onChange={(e) => {
                            updateState({
                              payeeEmail: e.target.value,
                            });
                          }}
                          placeholder="email"
                          type="email"
                        />
                      </FormRow>
                      <FormRow>
                        <Label> Quantity</Label>
                        <Input
                          value={state.ticketQuantity}
                          type={"number"}
                          onChange={(e) => {
                            updateState({
                              ticketQuantity: e.target.value,
                            });
                          }}
                          placeholder="Enter quantity"
                        />
                      </FormRow>

                      <div
                        className="paystackBtnContainer"
                        style={{
                          margin: "20px 0",
                        }}
                      >
                        <PaystackButton
                          className="paystack-button"
                          {...componentProps}
                        />
                        <div
                          className={clsx(
                            "disabled-div",
                            state.isFormValid ? "d-none" : ""
                          )}
                        ></div>
                      </div>
                    </Box>
                  </Box>
                </>
              ) : null
            }
          </ModalContent>
        </ModalContainer>
      </Modal>
      <LinkCard onClick={handleOpen}>🎟 Buy a Ticket</LinkCard>
    </>
  );
};

export default BuyTicketLink;
