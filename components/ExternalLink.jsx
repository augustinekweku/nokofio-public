import Link from "next/link";
import styled from "styled-components";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import { Box, CircularProgress, Modal, Typography } from "@mui/material";
import {
  Btn,
  CloseButton,
  ModalContainer,
  ModalContent,
  ModalTop,
  TopRight,
} from "../StyledComponents/common";
import { useState } from "react";
import { useRef } from "react";
import { userRequest } from "../requestMethods";
import { logoutUser } from "../utils";
import { topToast } from "../toast";
import CancelIcon from "@mui/icons-material/Cancel";
import { mobile } from "../responsive";
import { useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import { Delete, Edit } from "@mui/icons-material";
import Swal from "sweetalert2";
import { ApiErrorParser } from "../helpers";
import UserServices from "../services/UserServices";
import { useSelector } from "react-redux";

const LinkCardWrapper = styled.div`
  position: relative;
  padding: 10px 28px;
  display: flex;
  width: 100%;
  min-height: 70px;
  ${mobile({ padding: "24px 5px" })}

  background-color: #ffffff;
  /* cursor: pointer; */
  border-radius: 8px;
  margin-bottom: 15px;
`;
const LinkInfoWrapper = styled.div`
  padding: 10px 28px;
  width: 100%;
  background-color: #ffffff;
  /* cursor: pointer; */
  border-radius: 8px;
`;
const CardInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const CardInnerLeftWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-grow: 1;
`;
const CardInnerLeftIcon = styled.div`
  margin-right: 20px;
  color: black;
  display: flex;
  align-items: center;
`;
const CardSubtitle = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: black;
`;
const CardInnerLeftInfo = styled.div`
  word-wrap: anywhere;
`;
const CardTitle = styled.div`
  display: flex;
  align-items: center;
  color: black;
  font-size: 16px;
  font-weight: 400;
`;
const CardInnerRightWrapper = styled.div``;
const CardInnerRight = styled.div`
  display: flex;
  align-items: center;
`;
const CardInnerRightIcon = styled.div`
  margin: 0 20px;
  padding: 11px;

  display: flex;
  align-items: center;
  background: #f5f5f5;
  ${mobile({ padding: "10px" })}
  border-radius: 50%;
`;
const DeleteIconWrapper = styled.div`
  padding: 14px;
  border-radius: 50%;
  height: 15px;
  width: 15px;
  ${mobile({ height: "10px", width: "10px", padding: "10px" })}
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LinkThumbnail = styled.img`
  width: 30px;
  height: 100%;
  object-fit: cover;
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

const ExternalLink = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = useRef();
  const url = useRef();
  const [file, setFile] = useState(null);
  const [editObj, setEditObj] = useState(null);
  const [isDeletingLink, setIsDeletingLink] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(false);
  const userProfile = useSelector((state) => state.user.user);
  const [error, setError] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditObj(null);
    setFile(null);
  };

  const handleEdit = async (obj) => {
    setOpen(true);
    setEditObj(obj);
  };

  const editExternalLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
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
                    linkId: editObj.linkId,
                    title: title.current.value,
                    url: url.current.value,
                    thumbnail: thumbnail_url,
                  });
                  if (res.status === 200) {
                    setLoading(false);
                    setEditObj(null);
                    topToast("success", "Link updated successfully");
                    setOpen(false);
                    setFile(null);
                    onSuccess();
                  }
                } catch (error) {
                  setError(ApiErrorParser(error));
                  setEditObj(null);
                  setLoading(false);
                  if (error.response.status === 401) {
                    logoutUser();
                  }
                }
              }
            );
          }
        );
      } else {
        const res = await userRequest.post(`/sections/externalLink`, {
          linkId: editObj.linkId,
          title: title.current.value,
          url: url.current.value,
        });
        if (res.status === 200) {
          setEditObj(null);
          setLoading(false);
          onSuccess();
          topToast("success", "Link updated successfully");
          setOpen(false);
        }
      }
    } catch (error) {
      setError(ApiErrorParser(error));
      setEditObj(null);
      setLoading(false);
      // if (error.response.status === 401) {
      //   logoutUser();
      // }
    }
  };
  const deleteExternalLink = async (link) => {
    setError(null);
    Swal.fire({
      title: "Are you sure you want to delete this custom link?",
      text: `"${link?.url}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-secondary ms-1",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsDeletingLink(true);
          const res = await userRequest.delete(
            `sections/externalLink/${link.linkId}`
          );
          if (res.status === 200) {
            topToast("success", "Link deleted successfully");
            setIsDeletingLink(false);
          }
          onSuccess();
        } catch (error) {
          setLoading(false);
          if (error.response.status === 401) {
            logoutUser();
          }
        } finally {
          setIsDeletingLink(false);
          setDeletingIndex(null);
        }
      }
    });
  };
  // This function will be triggered when the file field change
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size > 10000000) {
        centerToast("error", "File size is larger than 10MB");
        setFile(null);
      } else {
        setFile(e.target.files[0]);
      }
    }
  };

  useEffect(() => {
    if (open) {
      setError(null);
    }
  }, [open]);

  return (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalContainer>
          <ModalTop justifyContent={"space-between"}>
            <div>
              <b>External Link</b>
            </div>
            <TopRight>
              <CloseButton>
                <CancelIcon onClick={handleClose} />
              </CloseButton>
            </TopRight>
          </ModalTop>
          <ModalContent>
            <div style={{ padding: "20px 0" }}>
              <Typography
                variant={"subtitle1"}
                textAlign={"center"}
                color={"red"}
              >
                {error ? error : null}
              </Typography>
              <form onSubmit={editExternalLink}>
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
      {userProfile?.externalLinks?.map((link, index) => (
        <Box
          key={index}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          mb={2}
          backgroundColor={"#F5F5F5"}
          p={2}
          borderRadius={2}
        >
          <Box display={"flex"} alignItems={"center"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                link?.thumbnail
                  ? link?.thumbnail
                  : "/images/svg/custom-link.svg"
              }
              alt={"custom link icon"}
              style={{
                marginRight: "15px",
                width: "40px",
                height: "40px",
                objectFit: "contain",
              }}
            />
            <Box>
              <Typography variant={"subtitle1"} fontWeight={"bold"}>
                {link?.title}
              </Typography>
              <Typography variant={"subtitle2"} color={"GrayText"}>
                {link?.url}
              </Typography>
            </Box>
          </Box>
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <Typography variant="p" color={"#0466c8da"}>
              <Edit
                sx={{ cursor: "pointer" }}
                fontSize="small"
                onClick={() => handleEdit(link)}
              />
            </Typography>
            <Typography variant="p" color={"#c81b04dc"}>
              {isDeletingLink && deletingIndex === index ? (
                <CircularProgress size={20} />
              ) : (
                <Delete
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setDeletingIndex(index);
                    deleteExternalLink(link);
                  }}
                  fontSize="small"
                />
              )}
            </Typography>
          </Box>
        </Box>
      ))}
    </>
  );
};

export default ExternalLink;
