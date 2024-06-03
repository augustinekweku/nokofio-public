import styled from "styled-components";
import SectionCard from "../../components/SectionCard";
import { desktopLarge, mobile, xl } from "../../responsive";
import { desktop } from "../../responsive";
import { cardDetails } from "../../sectionCards";
import DashboardRight from "../../components/DashboardRight";
import UserShare from "../../components/UserShareRow";
import BackNavTitle from "../../components/BackNavTitle";

import {
  Btn,
  CloseButton,
  ModalContainer,
  ModalContent,
  ModalTop,
  TopRight,
} from "../../StyledComponents/common";
import { Box, CircularProgress, Modal, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState } from "react";
import ProfileCompletion from "../../components/ProfileCompletion";
import { userRequest, publicRequest } from "../../requestMethods";
import { useRef } from "react";
import { centerToast, topToast } from "../../toast";
import { getProfile, logoutUser } from "../../utils";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { useEffect } from "react";
import FullPageLoader from "../../components/FullPageLoader";
import ExternalLink from "../../components/ExternalLink";
import { ShimmerThumbnail } from "react-shimmer-effects";
import ResultsChecker from "../../components/ResultsChecker";
import { useSelector } from "react-redux";
import axios from "axios";
import Layout from "../../components/Layout";
import AuthLayout from "../../components/AuthLayout";
import { useRouter } from "next/router";
import AddPaymentLink from "../../components/modals/AddPaymentLink";
import { useReducer } from "react";
import UserServices from "../../services/UserServices";
import PaymentLink from "../../components/modals/PaymentLink";

const Container = styled.div``;
const MainRow = styled.div`
  display: flex;
`;
const MainLeft = styled.div`
  padding-top: 32px;
  padding-bottom: 32px;
  flex: 2;
  background-color: #e8e8e8;
  height: 100vh;
  overflow: scroll;
  ${mobile({ width: "100%", paddingTop: "0px" })}
`;
const MainRight = styled.div`
  flex: 1;
  display: none;
  ${desktop({ display: "block" })}
  ${desktopLarge({ display: "block" })}
  ${xl({ display: "block" })}
`;

const InnerLeft = styled.div`
  padding-left: 57px;
  padding-right: 57px;
  ${mobile({ padding: "0px 12px" })}
  ${desktop({ padding: "0px 62px" })}
  ${desktopLarge({ padding: "0px 82px" })}
  ${xl({ padding: "0px 182px" })}
`;

const CardList = styled.ul`
  list-style: none;
  padding-left: 0;
`;
const CardListItem = styled.li``;

export const AddLink = styled.div`
  border: 1px dashed #979797;
  padding: 14px 0px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 10px;
`;

const Form = styled.form``;
const FormRow = styled.div``;
const Label = styled.div`
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  margin-bottom: 6px;
  color: #98a2b3;
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
const UploadThumbnail = styled.div`
  padding: 12px;
  border: 1px dashed #e5e7eb;
  border-radius: 8px;
  width: fit-content;
  cursor: pointer;
  margin-bottom: 5px;
`;

if (typeof window !== "undefined") {
  var userProfile = JSON.parse(localStorage.getItem("currentUser"));
}

const Builder = () => {
  const profileUser = useSelector((state) => state.user.user);
  const [openAddExternalLink, setOpenAddExternalLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = useRef();
  const url = useRef();
  const [selectedImage, setSelectedImage] = useState();
  const [file, setFile] = useState(null);
  const [externalLinks, setExternalLinks] = useState(null);
  const [editObj, setEditObj] = useState(null);
  const [state, updateState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      openAddPaymentLink: false,
      openPaymentLinkModal: false,
      paymentLinkType: "",
    }
  );

  const router = useRouter();

  const getExternalLinks = async () => {
    try {
      const getLinks = await userRequest.get(`/sections/externalLink`);
      if (getLinks.status === 200) {
        // console.log(getLinks.data.results.data);
        setExternalLinks(getLinks.data.results.data);
      }
    } catch (error) {
      if (error.response.status === 401) {
        // logoutUser();
      }
    }
  };
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpenAddExternalLink(false);
    setEditObj(null);
    setFile(null);
  };
  const createExternalLink = async (e) => {
    setLoading(true);
    const userId = JSON.parse(localStorage.getItem("currentUser"))?.id;
    e.preventDefault();
    try {
      const getLinks = await userRequest.get(`/sections/externalLink`);
      if (file) {
        const fileName = new Date().getTime() + file.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //   console.log("Upload is " + progress + "% done");
            // switch (snapshot.state) {
            //   case "paused":
            //     console.log("Upload is paused");
            //     break;
            //   case "running":
            //     console.log("Upload is running");
            //     break;
            //   default:
            // }
          },
          (error) => {
            // Handle unsuccessful uploads
            // console.log("Upload failed", error);
            setLoading(false);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                let thumbnail_url =
                  downloadURL.replace(
                    "https://firebasestorage.googleapis.com",
                    "https://ik.imagekit.io/ilhgsdh4z/"
                  ) + "?tr=bl-6";

                try {
                  const res = await userRequest.post(`/sections/externalLink`, {
                    title: title.current.value,
                    url: url.current.value,
                    thumbnail: thumbnail_url,
                  });
                  if (res.status === 200) {
                    setFile(null);
                    setLoading(false);
                    getExternalLinks();
                    topToast("success", "Link saved successfully");
                    setOpen(false);
                  }
                } catch (error) {
                  alert(error.response.data.errors);
                  setLoading(false);
                  if (error.response.status === 401) {
                    logoutUser();
                  }
                  if (error.response.status === 422) {
                    alert("Invalid url");
                  }
                }
              }
            );
          }
        );
      } else {
        const res = await userRequest.post(`/sections/externalLink`, {
          title: title.current.value,
          url: url.current.value,
          thumbnail: "",
        });
        if (res.status === 200) {
          getExternalLinks();
          setLoading(false);
          getProfile();
          topToast("success", "Link saved successfully");
          setOpen(false);
        }
      }
    } catch (error) {
      console.log("error");
      setLoading(false);
      if (error.response.status === 422) {
        alert("Invalid url");
      }
      // if (error.response.status === 401) {
      //   logoutUser();
      // }
    }
  };
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size > 10000000) {
        centerToast("error", "File size is larger than 10MB");
        setFile(null);
      } else {
        setSelectedImage(e.target.files[0]);
        setFile(e.target.files[0]);
      }
    }
  };
  const handleExternalLoad = () => {
    getExternalLinks();
  };

  useEffect(() => {
    getExternalLinks();
  }, []);

  async function getProfile() {
    if (userProfile?.username) {
      const res = await UserServices.getUserProfile(userProfile?.username);
      localStorage.setItem(
        "nokofioProfileData",
        JSON.stringify(res.data.results.data)
      );
    }
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Container>
      <Modal
        open={openAddExternalLink}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="animate__animated animate__fadeIn"
      >
        <ModalContainer>
          <ModalTop>
            <TopRight>
              <CloseButton>
                <CancelIcon onClick={handleClose} />
              </CloseButton>
            </TopRight>
          </ModalTop>
          <ModalContent>
            <div style={{ padding: "20px 0" }}>
              <form onSubmit={createExternalLink}>
                <FormRow>
                  <Label>
                    Title <sup>*</sup>
                  </Label>
                  <Input
                    defaultValue={editObj?.title}
                    placeholder="Add a link title here"
                    required
                    ref={title}
                  />
                </FormRow>
                <FormRow>
                  <Label>
                    URL <sup>*</sup>
                  </Label>
                  <Input
                    defaultValue={editObj?.url}
                    placeholder="Enter URL here "
                    required
                    ref={url}
                  />
                </FormRow>
                <FormRow>
                  <label htmlFor="profileImage">
                    <UploadThumbnail>Upload thumbnail</UploadThumbnail>{" "}
                    <span style={{ fontSize: "14px" }}>
                      {file?.name ? (
                        file?.name
                      ) : (
                        <span style={{ color: "red" }}> No file Chosen</span>
                      )}
                    </span>
                  </label>
                  <input
                    hidden
                    type="file"
                    id="profileImage"
                    accept=".png,jpeg,.jpg"
                    onChange={imageChange}
                  />
                  <Label>
                    For best image quality, we recommend a 400x400px PNG or JPG.
                  </Label>
                </FormRow>

                <Btn
                  style={{ marginTop: "20px" }}
                  bg={"#000"}
                  color={"white"}
                  block
                  type="submit"
                >
                  Save Link &nbsp;
                  {loading && (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  )}
                </Btn>
              </form>
            </div>
          </ModalContent>
        </ModalContainer>
      </Modal>
      <AddPaymentLink
        open={state.openAddPaymentLink}
        onDismiss={() => {
          updateState({ openAddPaymentLink: false });
        }}
        onSuccess={(paymentLinkType) => {
          if (paymentLinkType === "custom-link") {
            updateState({ openAddPaymentLink: false });
            setOpenAddExternalLink(true);
          } else {
            updateState({
              paymentLinkType: paymentLinkType,
              openPaymentLinkModal: true,
              openAddPaymentLink: false,
            });
          }
        }}
      />
      <PaymentLink
        onDismiss={() => {
          updateState({ openPaymentLinkModal: false });
        }}
        open={state.openPaymentLinkModal}
        paymentType={state.paymentLinkType}
        onSuccess={() => {
          updateState({ openPaymentLinkModal: false });
          getProfile();
        }}
      />
      <ProfileCompletion />
      <MainRow>
        <MainLeft>
          <UserShare />
          <InnerLeft>
            <Box mb={2}>
              <BackNavTitle title={"Sections"} />
            </Box>
            <CardList>
              {cardDetails.map((cardDetail, index) => (
                <CardListItem
                  key={index}
                  className={
                    cardDetail.status === "coming-soon" ? "d-none" : ""
                  }
                >
                  <SectionCard cardDetail={cardDetail} key={cardDetail.id} />
                </CardListItem>
              ))}
              {profileUser?.hasDigitalProduct == true && <ResultsChecker />}
              {externalLinks ? (
                externalLinks.map((externalLink, index) => (
                  <ExternalLink
                    className="animate__animated animate__fadeIn"
                    handleExternalLoad={handleExternalLoad}
                    key={index}
                    externalLink={externalLink}
                  />
                ))
              ) : (
                <>
                  <ShimmerThumbnail height={120} rounded />
                </>
              )}
              <AddLink
                onClick={() => {
                  updateState({ openAddPaymentLink: true });
                }}
              >
                {" "}
                Add Link
              </AddLink>
            </CardList>
          </InnerLeft>
        </MainLeft>
        <MainRight>
          <DashboardRight />
        </MainRight>
      </MainRow>
    </Container>
  );
};

export default Builder;

Builder.getLayout = function getLayout(page) {
  return (
    <Layout>
      <AuthLayout>{page}</AuthLayout>
    </Layout>
  );
};
