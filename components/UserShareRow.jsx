import styled from "styled-components";
import { mobile, tablet } from "../responsive";
import { topToast } from "../toast";
import { RWebShare } from "react-web-share";
import { getCookie } from "cookies-next";
import { useState } from "react";
import { useEffect } from "react";
import { IosShare, Preview } from "@mui/icons-material";
import PhonePreview from "./PhonePreview";
import { IconButton, Modal, Tooltip } from "@mui/material";
import { DivFlex } from "../StyledComponents/common";
import CloseIcon from "@mui/icons-material/Close";
import { getBaseUrl } from "../helpers/constants";

const UserShareRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 11px 24px;
  margin-bottom: 5px;
  border-top: 1px solid #d0d5dd;
  border-bottom: 1px solid #d0d5dd;
  display: none;
  gap: 10px;
  ${mobile({ display: "flex", marginTop: "0px", padding: "11px 12px" })}
  ${tablet({ display: "flex", marginTop: "0px" })}
`;

const Username = styled.div``;

const SpanText = styled.span`
  display: flex;
  align-items: center;
  border: 1px solid #989898;
  color: #2e2c2c;
  padding: 5px;
  border-radius: 5px;
`;
const ShareIconContainer = styled.div`
  padding: 7px;
  background-color: #f6f6f6;
  height: 35px;
  width: 35px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 34;
  border: 1px solid #d0d5dd;
`;

const PreviewContainer = styled.div`
  margin: 0 30px;
  ${mobile({ width: "80%", margin: "0 auto" })}
  ${tablet({ width: "35%", margin: "0 auto" })}
  &:focus {
    outline: none;
  }
`;

const UserShare = () => {
  const [username, setUsername] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const cookie = getCookie("nokofio_user");
    if (cookie) {
      const username = JSON.parse(cookie).username;

      if (username) {
        setUsername(username);
      }
    }
  }, []);

  const emitCopy = (text) => {
    topToast("success", "Link copied to clipboard");
  };
  const sites = [
    "facebook",
    "twitter",
    "whatsapp",
    "linkedin",
    "telegram",
    "copy",
  ];
  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <PreviewContainer>
          <DivFlex center style={{ marginTop: "10px" }}>
            <IconButton
              sx={{ background: "#00000093", marginBottom: "5px" }}
              onClick={handleClose}
            >
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </DivFlex>
          <PhonePreview />
        </PreviewContainer>
      </Modal>
      <div>
        <UserShareRow>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Username onClick={handleOpen}>
              <SpanText>
                nokofio.me/{username} &nbsp;{" "}
                <Preview sx={{ fontSize: "20px", cursor: "pointer" }} />
              </SpanText>{" "}
            </Username>
            {/* &nbsp; &nbsp;
            <Tooltip title="Preview Profile" className="d-none">
              <ShareIconContainer
                style={{ marginRight: "5px" }}
                onClick={handleOpen}
              >
                <Preview sx={{ fontSize: "16px" }} />
              </ShareIconContainer>
            </Tooltip> */}
          </div>
          <div>
            <RWebShare
              data={{
                text: "Check me out on Nokofio.",
                url: `${getBaseUrl()}/${username}`,
                title: "Share profile via",
              }}
              sites={sites}
              onClick={() => emitCopy()}
            >
              <Tooltip title="Share Profile">
                <ShareIconContainer>
                  <IosShare sx={{ fontSize: "16px" }} />
                </ShareIconContainer>
              </Tooltip>
            </RWebShare>
          </div>
        </UserShareRow>
      </div>
    </>
  );
};

export default UserShare;
