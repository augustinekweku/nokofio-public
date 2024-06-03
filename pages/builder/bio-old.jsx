import styled from "styled-components";

import { desktopLarge, mobile, xl } from "../../responsive";
import { tablet, desktop } from "../../responsive";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useState } from "react";
import DashboardRight from "../../components/DashboardRight";
import UserShare from "../../components/UserShareRow";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { publicRequest, userRequest } from "../../requestMethods";
import { useRef } from "react";
import { centerToast, topToast } from "../../toast";
import { CircularProgress, Typography } from "@mui/material";
import { setProfileUser } from "../../redux/userRedux";
import { useDispatch } from "react-redux";
import BackNavTitle from "../../components/BackNavTitle";
import { useSelector } from "react-redux";
import { logoutUser } from "../../utils";
import { FormContainer } from "../../StyledComponents/common";
import { setFullPageLoading } from "../../redux/fullPageLoadingRedux";

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

const TopRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 26px;
  padding-top: 16px;
`;

const BioContainerWrapper = styled.div`
  /* ${desktop({ paddingTop: "25px" })}
  ${desktopLarge({ paddingTop: "25px" })}
  ${xl({ paddingTop: "25px" })} */
`;

const AvatarContainer = styled.div`
  width: 80px;
  height: 80px;
  margin-right: 48px;
  position: relative;
`;
const AvatarImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;
const UploadColumn = styled.div``;
const UploadText = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0em;
  margin-bottom: 8px;
`;
const UploadButton = styled.div`
  border: none;
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
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

const Heading = styled.h1`
  padding-bottom: 10px;
  font-size: 32px;
  font-weight: 600;
  ${mobile({ fontSize: "24px" })}
`;

const Button = styled.button`
  padding: 15px;
  font-size: 14px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  ${mobile({ fontSize: "12px", padding: "12px" })}
  display: flex;
  align-items: center;
`;

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
  height: 128px;
  background: #f5f5f5;
  border-radius: 8px 8px 8px 8px;
  border: none;
  margin-bottom: 20px;
  &:focus {
    outline: none;
  }
`;
export const LabelSpan = styled.span`
  color: #989898;
`;
const RemoveImageBtn = styled.div`
  position: absolute;
  top: 0;
  right: 0px;
`;
const EditIcon = styled.div`
  cursor: pointer;
  & > p {
    color: white;
    font-weight: 600;
    margin: 0;
  }
`;
const EditIconWrapper = styled.div`
  background: rgba(0, 0, 0, 0);
  position: absolute;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  display: flex;

  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }
`;

const FormActionRow = styled.div``;

const Bio = () => {
  const [selectedImage, setSelectedImage] = useState();
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [newImgUrl, setNewImgUrl] = useState("");
  const [newThumbnailUrl, setNewThumbnailUrl] = useState("");
  const profileUser = useSelector((state) => state.user.user);

  const [loading, setloading] = useState(false);
  const [isUploadingProfileImg, setIsUploadingProfileImg] = useState(false);
  const [uploadProgrgess, setUploadProgress] = useState(0);

  const dispatch = useDispatch();

  const displayName = useRef();
  const pageTitle = useRef();
  const bio = useRef();

  // This function will be triggered when the file field change
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
  const thumbnailChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size > 10000000) {
        centerToast("error", "File size is larger than 10MB");
        setThumbnail(null);
      } else {
        setThumbnail(e.target.files[0]);
      }
    }
  };

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedImage = () => {
    setSelectedImage();
  };

  const handleProfilePicUpload = () => {
    if (file) {
      const fileName = new Date().getTime() + file.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, "images/profile-pics/" + fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      setIsUploadingProfileImg(true);
      dispatch(
        setFullPageLoading({
          status: true,
          message: "Uploading Profile Image...",
        })
      );
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(parseInt(progress));
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
          setloading(false);
          setIsUploadingProfileImg(false);
          dispatch(setFullPageLoading({ status: false }));
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            setFile(null);
            setIsUploadingProfileImg(false);
            dispatch(setFullPageLoading({ status: false }));
            let url =
              downloadURL.replace(
                "https://firebasestorage.googleapis.com",
                "https://ik.imagekit.io/ilhgsdh4z/"
              ) + "?tr=bl-6";
            let serverUrl =
              downloadURL.replace(
                "https://firebasestorage.googleapis.com",
                "https://ik.imagekit.io/ilhgsdh4z/tr:q-10/"
              ) + "?tr=bl-6";

            setNewImgUrl(url);
            const profileObj = {
              profilePicture: url,
              serverProfileImage: serverUrl,
            };

            try {
              const res = await userRequest.post(
                `/user/profileBio`,
                profileObj
              );
              if (res.status === 200) {
                getProfile();
                // topToast("success", "Profile Picture Updated successfully");
              }
            } catch (error) {
              if (error.response.status === 401) {
                logoutUser();
              }
            }
          });
        }
      );
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setloading(true);

    if (thumbnail) {
      handleProfilePicUpload();
      const fileName = new Date().getTime() + thumbnail.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, "images/cover-photos/" + fileName);
      const uploadTask = uploadBytesResumable(storageRef, thumbnail);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          //     // Observe state change events such as progress, pause, and resume
          //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          // const progress =
          //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done");
          //     // switch (snapshot.state) {
          //     //   case "paused":
          //     //     console.log("Upload is paused");
          //     //     break;
          //     //   case "running":
          //     //     console.log("Upload is running");
          //     //     break;
          //     //   default:
          //     // }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log("Upload failed", error);
          setloading(false);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            let url =
              downloadURL.replace(
                "https://firebasestorage.googleapis.com",
                "https://ik.imagekit.io/ilhgsdh4z/"
              ) + "?tr=bl-6";

            const profileObj = {
              displayName: displayName.current.value,
              bio: bio.current.value,
              pageTitle: pageTitle.current.value,
              thumbnail: url,
            };

            try {
              const res = await userRequest.post(
                `/user/profileBio`,
                profileObj
              );
              if (res.status === 200) {
                setloading(false);
                getProfile();
                topToast("success", "Profile Updated successfully");
              }
            } catch (error) {
              setloading(false);
              if (error.response.status === 401) {
                logoutUser();
              }
            }
          });
        }
      );
    } else {
      handleProfilePicUpload();
      const profileObj = {
        displayName: displayName.current.value,
        bio: bio.current.value,
        pageTitle: pageTitle.current.value,
      };

      try {
        const res = await userRequest.post(`/user/profileBio`, profileObj);
        if (res.status === 200) {
          setloading(false);
          getProfile();
          topToast("success", "Profile  Updated successfully");
        }
      } catch (error) {
        setloading(false);
        if (error.response.status === 401) {
          logoutUser();
        }
      }
    }
  };

  const getProfile = async () => {
    const cookies = parseCookies();
    const cookiesObj = { cookies };
    const user = JSON.parse(cookiesObj.cookies.nokofio_user);
    try {
      const res = await publicRequest.get(`/user/me?username=${user.username}`);
      const donationRes = await userRequest.get(`donation/transactions/amount`);
      const donationTransactionsRes = await userRequest.get(
        `donation/transactions/`
      );

      if (
        res.status === 200 &&
        donationRes.status === 200 &&
        donationTransactionsRes.status === 200
      ) {
        const profileUserObj = {
          ...res.data.results.data,
          amountDonated: donationRes.data,
          donationsCount: donationTransactionsRes.data.results.data.length,
        };
        dispatch(setProfileUser(profileUserObj));
      }
    } catch (error) {
      if (error.response.status === 401) {
        // Destroy
        destroyCookie(null, "nokofio_user");
        location.href = "/login";
      }
    }
  };

  return (
    <Container className="animate__animated animate__fadeIn">
      <MainRow>
        <MainLeft>
          <UserShare />
          <InnerLeft>
            <BackNavTitle title={"Bio"} />
            <Form onSubmit={handleProfileUpdate}>
              <BioContainerWrapper>
                <FormContainer>
                  <TopRow>
                    <div>
                      <Label>Profile Photo</Label>
                      <AvatarContainer>
                        <RemoveImageBtn onClick={removeSelectedImage}>
                          {selectedImage && (
                            <CancelIcon
                              color="error"
                              sx={{ background: "white", borderRadius: "50px" }}
                            />
                          )}
                        </RemoveImageBtn>
                        <EditIconWrapper>
                          <label htmlFor="profileImage" className="shareOption">
                            <EditIcon>
                              <p>
                                {profileUser?.profilePicture ? "Edit" : "Add"}
                              </p>
                            </EditIcon>
                          </label>
                        </EditIconWrapper>
                        {selectedImage ? (
                          <AvatarImg src={URL.createObjectURL(selectedImage)} />
                        ) : (
                          <label htmlFor="profileImage" className="shareOption">
                            <AvatarImg
                              src={
                                profileUser?.profilePicture
                                  ? profileUser?.profilePicture
                                  : "/images/noAvatar.png"
                              }
                            />
                          </label>
                        )}
                      </AvatarContainer>
                    </div>
                    <UploadColumn className="">
                      <label htmlFor="profileImage" className="shareOption">
                        <UploadButton>
                          <CloudUploadIcon /> &nbsp; Upload
                        </UploadButton>
                      </label>
                      <input
                        hidden
                        type="file"
                        id="profileImage"
                        accept=".png,jpeg,.jpg"
                        onChange={imageChange}
                      />
                    </UploadColumn>
                  </TopRow>
                  <FormRow>
                    <Label>
                      {" "}
                      Display Name *{" "}
                      <LabelSpan> (Maximum characters: 30)</LabelSpan>
                    </Label>
                    <Input
                      defaultValue={profileUser?.displayName}
                      placeholder="eg. Samuel Obeng"
                      ref={displayName}
                      maxLength="30"
                    />
                  </FormRow>
                  <FormRow>
                    <Label>
                      Page Title
                      <LabelSpan> (Maximum characters: 50)</LabelSpan>
                    </Label>
                    <Input
                      defaultValue={profileUser?.pageTitle}
                      placeholder="eg. Social Media Influencer"
                      ref={pageTitle}
                      required
                      maxLength="50"
                    />
                  </FormRow>
                  <FormRow>
                    <Label>
                      Bio <LabelSpan> (Maximum characters: 200)</LabelSpan>
                    </Label>
                    <InputTextarea
                      defaultValue={profileUser?.bio}
                      type="text"
                      placeholder="Enter bio"
                      ref={bio}
                      maxLength="200"
                    />
                  </FormRow>
                  <FormRow>
                    <Label>
                      Banner{" "}
                      <LabelSpan>(Upload a photo for your banner)</LabelSpan>{" "}
                    </Label>
                    <Input
                      className="d-none"
                      type="text"
                      placeholder="Enter youtube link"
                    />
                    <Input
                      type="file"
                      accept=".png,.jpeg,.jpg"
                      placeholder="Add a tag or display name"
                      onChange={thumbnailChange}
                    />
                  </FormRow>
                  <FormActionRow>
                    <Button type="submit" disabled={loading}>
                      <Typography>Submit</Typography> &nbsp;
                      {loading && (
                        <CircularProgress size={20} sx={{ color: "white" }} />
                      )}
                    </Button>
                  </FormActionRow>
                </FormContainer>
              </BioContainerWrapper>
            </Form>
          </InnerLeft>
        </MainLeft>
        <MainRight>
          <DashboardRight />
        </MainRight>
      </MainRow>
    </Container>
  );
};

export default Bio;
