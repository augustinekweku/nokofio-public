import styled from "styled-components";
import { desktop, mobile, tablet } from "../responsive";

export const SelectContainer = styled.div`
  position: relative;
  padding: 12px 14px 12px 14px;
  height: 48px;
  background: #f5f5f5;
  border-radius: 8px;
  /* &::after {
    font-family: "Font Awesome 5 Free";
    content: "\f078";
    font-weight: 600;
    right: 15px;
    position: absolute;
    cursor: context-menu;
  } */
  display: flex;
  align-items: center;
`;

export const FormSelect = styled.select`
  cursor: pointer;
  z-index: 99;
  background: #f5f5f5;
  width: 100%;
  /* -webkit-appearance: none; */
  /* appearance: none; */
  color: inherit;
  border: none;
  font-weight: 600;
  &:focus {
    outline: none;
  }
`;
export const FormOption = styled.option``;

export const DivFlex = styled.div`
  display: flex;
  align-items: ${(props) => (props.alignCenter ? "center" : "")};
  justify-content: ${(props) =>
    props.spaceBetween
      ? "space-between"
      : props.spaceAround
      ? "space-around"
      : props.center
      ? "center"
      : props.end
      ? "end"
      : ""};
  flex-direction: ${(props) =>
    props.row ? "row" : props.column ? "column" : ""};
  gap: ${(props) => {
    return props.gap ? props.gap + "px" : "";
  }};
  padding-top: ${(props) => {
    return props.paddingTop ? props.paddingTop + "px" : "";
  }};
  padding-bottom: ${(props) => {
    return props.paddingBottom ? props.paddingBottom + "px" : "";
  }};
  padding-left: ${(props) => {
    return props.paddingLeft ? props.paddingLeft + "px" : "";
  }};
  padding-right: ${(props) => {
    return props.paddingRight ? props.paddingRight + "px" : "";
  }};
  padding: ${(props) => {
    return props.padding ? props.padding + "px" : "";
  }};
`;

export const InnerFlex = styled.div`
  display: flex;
  align-items: ${(props) => (props.alignCenter ? "center" : "")};
  justify-content: ${(props) =>
    props.flexStart
      ? "start"
      : props.flexCenter
      ? "center"
      : props.flexEnd
      ? "end"
      : props.spaceBetween
      ? "space-between"
      : ""};
  flex-direction: ${(props) =>
    props.row ? "row" : props.column ? "column" : ""};
`;

export const FlexCol = styled.div`
  flex: ${(props) =>
    props.flex === "1"
      ? 1
      : props.flex === "1.5"
      ? 1.5
      : props.flex === "2"
      ? 2
      : props.flex === "2.5"
      ? 2.5
      : props.flex === "3.5"
      ? 3.5
      : props.flex === "4"
      ? 4
      : props.flex === "4.5"
      ? 4.5
      : props.flex === "5"
      ? 5
      : ""};
  display: ${(props) => (props.divFlex ? "flex" : "")};
  align-items: ${(props) => (props.alignCenter ? "center" : "")};
  justify-content: ${(props) =>
    props.flexStart
      ? "start"
      : props.flexCenter
      ? "center"
      : props.flexEnd
      ? "end"
      : ""};
`;

export const Spacer = styled.div`
  height: ${(props) => {
    return props.height ? props.height + "px" : "10px";
  }};
`;

export const BackButton = styled.button`
  padding: 10px;
  font-size: 14px;
  margin: 15px 0;
  background: #000000da;
  color: #ffffff;
  border: none;
  border-radius: 50px;
  ${mobile({ fontSize: "10px", padding: "7px" })}
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderLeft = styled.div``;
export const HeaderRight = styled.div``;
export const Heading = styled.h1`
  font-size: 32px;
  font-weight: 600;
  ${mobile({ fontSize: "24px" })}
`;

export const Button = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 10px;
  font-size: 14px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  ${mobile({ fontSize: "12px", padding: "12px" })}
`;
export const Btn = styled.button`
  font-family: Poppins;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 10px;
  font-size: 16px;
  background: #000000;
  background: ${(props) => {
    return props.bg ? props.bg : "transparent";
  }};
  border-color: ${(props) => {
    return props.borderColor ? props.borderColor : "transparent";
  }};
  &:hover {
    background: ${(props) => {
      return props.hoverBg;
    }};
    color: ${(props) => {
      return props.hoverColor;
    }};
  }
  color: ${(props) => {
    return props.color ? props.color : "inherit";
  }};
  font-weight: ${(props) => {
    return props.fw ? props.fw : "inherit";
  }};
  width: ${(props) => {
    return props.block ? "100%" : "";
  }};
  border: 1px solid inherit;
  border-radius: 8px;
  ${mobile({ fontSize: "12px", padding: "12px 18px" })}
`;

export const InputTextarea = styled.textarea`
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

export const FormContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 40px;
  ${mobile({ padding: "20px" })}
`;
export const HomeContainer = styled.div`
  width: 75%;
  ${mobile({ width: "100%" })}
  ${tablet({ width: "90%" })}
  margin: 0 auto;
`;

export const ModalContainer = styled.div`
  width: ${(props) => {
    return props.size === "sm"
      ? "300px"
      : props.size === "lg"
      ? "800px"
      : props.size === "xl"
      ? "1140px"
      : "500px";
  }};
  max-height: ${(props) => {
    return props.height ? props.height : "95vh";
  }};
  background: ${(props) => {
    return props.bg ? props.bg : "#fff";
  }};
  padding: 16px 32px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: "all 0.5s ease";
  box-shadow: 24;
  border-radius: 10px;
  ${mobile({
    width: "90%",
    height: "80vh",
    padding: "16px 20px",
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
export const ModalTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => {
    return props.justifyContent ? props.justifyContent : "flex-end";
  }};
`;
export const TopRight = styled.div``;
export const CloseButton = styled.div`
  cursor: pointer;
  display: flex;
`;

export const ModalContent = styled.div``;

export const Modal = styled.div`
  width: 100%;
  height: 100vh;
  background: #00000069;
  position: fixed;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalTitle = styled.div`
  font-family: Poppins;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 8px;
`;
export const ModalSubText = styled.div`
  ${mobile({ fontSize: "14px", lineHeight: "16px", marginBottom: "5px" })}
`;

// CHART STYLES

export const ChartContainer = styled.div`
  background: #ffffff;
  border: 1px solid #dfe0eb;
  border-radius: 8px;
  margin-top: 20px;
  display: flex;
`;
export const ChartContainerLeft = styled.div`
  padding: 32px;
  flex: 4;
`;
export const ChartContainerRight = styled.div`
  flex: 1;
  border-left: 1px solid #dfe0eb;
`;
export const ChartContainerRightRow = styled.div`
  border-bottom: 1px solid #dfe0eb;
  padding: 32px;
`;

export const ContainerRightRowTitle = styled.h5`
  color: #9fa2b4;
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  text-align: center;
`;

export const ContainerRightRowSubtitle = styled.h6`
  font-size: 24px;
  font-weight: 700;
  line-height: 30px;
  text-align: center;
`;

export const ChartTitle = styled.div`
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 10px;
`;

export const ChartTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 30px;
`;

export const ChartTitleColumn = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`;

export const ChartStatusIcon = styled.span`
  display: flex;
  align-items: center;
  font-weight: 500;
`;

export const ChartBody = styled.div`
  height: 100%;
`;

//END CHART STYLES
