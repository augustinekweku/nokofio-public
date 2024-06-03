import styled from "styled-components";
import {
  Btn,
  CloseButton,
  Modal,
  ModalContainer,
  ModalContent,
  ModalSubText,
  ModalTitle,
  ModalTop,
  TopRight,
} from "../StyledComponents/common";
import CancelIcon from "@mui/icons-material/Cancel";
import { desktop, mobile, tablet } from "../responsive";
import { Grid } from "@mui/material";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTicketArray, updateTicketArray } from "../redux/addTicketRedux";

const FormRowFlex = styled.div`
  display: flex;
  justify-content: space-between;
  ${tablet({ flexDirection: "column" })};
  ${mobile({ flexDirection: "column" })};
  ${desktop({ flexDirection: "row" })};
`;
const FormCol = styled.div``;

const TicketInput = styled.input`
  padding: 12px 14px 12px 14px;
  font-size: 12px;
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
const Button = styled.button`
  padding: 15px;
  font-size: 14px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  ${mobile({ fontSize: "12px", padding: "12px" })}
`;

const AddTicket = ({ isEditing, editObj, editingIndex, closeAddTicket }) => {
  const ticketName = useRef();
  const ticketQuantity = useRef();
  const ticketPrice = useRef();
  const ticketArr = useSelector((state) => state?.ticketArr?.ticketArray);

  const dispatch = useDispatch();
  const addTicket = (e) => {
    e.preventDefault();
    let ticketObj = {
      name: ticketName.current.value,
      price: ticketPrice.current.value,
      quantity: ticketQuantity.current.value,
    };
    dispatch(setTicketArray(ticketObj));
    closeAddTicket();
  };
  const editTicket = (e) => {
    e.preventDefault();
    let arr = ticketArr;
    const newArr = arr.filter((obj, objIndex) => objIndex !== editingIndex);
    let ticketObj = {
      name: ticketName.current.value,
      price: ticketPrice.current.value,
      quantity: ticketQuantity.current.value,
    };
    newArr.push(ticketObj);
    dispatch(updateTicketArray(newArr));
    closeAddTicket();
  };

  return (
    <div>
      <Modal>
        <ModalContainer>
          <ModalTop>
            <TopRight>
              <CloseButton>
                <CancelIcon
                  onClick={() => {
                    closeAddTicket();
                  }}
                />
              </CloseButton>
            </TopRight>
          </ModalTop>
          <ModalContent>
            <ModalTitle>{isEditing ? "Edit Ticket" : "Add Ticket"} </ModalTitle>
            <form onSubmit={isEditing ? editTicket : addTicket}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <FormCol>
                    <TicketInput
                      required
                      ref={ticketName}
                      defaultValue={isEditing ? editObj.name : ""}
                      type="text"
                      placeholder="Enter ticket name"
                    />
                  </FormCol>
                </Grid>
                <Grid item xs={4}>
                  <FormCol>
                    <TicketInput
                      required
                      ref={ticketPrice}
                      defaultValue={isEditing ? editObj.price : ""}
                      placeholder="Enter ticket price"
                      type={"number"}
                      pattern="[0-9]*"
                    />
                  </FormCol>
                </Grid>
                <Grid item xs={4}>
                  <FormCol>
                    <TicketInput
                      required
                      type="number"
                      defaultValue={isEditing ? editObj.quantity : ""}
                      pattern="[0-9]*"
                      ref={ticketQuantity}
                      placeholder="Quantity"
                    />
                  </FormCol>
                </Grid>
              </Grid>
              <Button type="submit">Submit</Button>
            </form>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </div>
  );
};

export default AddTicket;
