import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { publicRequest } from "../requestMethods";
import { mobile } from "../responsive";
import { DivFlex, FlexCol } from "../StyledComponents/common";
import VerifiedIcon from "@mui/icons-material/Verified";
import { getBaseUrl } from "../helpers/constants";

const Container = styled.div`
  background: #fdfeff;
  padding-top: 30px;
`;

const UsersDiv = styled(DivFlex)`
  justify-content: center;
  ${mobile({ justifyContent: "start" })}
`;

const CardWrapper = styled.div`
  cursor: pointer;
  padding: 10px;
  text-align: center;
  /* width: 320px; */
  background: #fdfeff;
  transition: background 0.6s ease;
  border-radius: 10px;
  padding: 20px 20px 20px 20px;
  /* box-shadow: 0 8px 40px #0000002d; */
  box-shadow: 1px 4px 18px 0px #00000040;
  height: 100%;
`;

const ImageContainer = styled.div`
  height: 80px;
  width: 80px;
  ${mobile({ height: "80px", width: "80px" })}
  margin: 0 auto;
  box-shadow: 0 8px 40px #0000002d;
  border-radius: 50%;
  margin-bottom: 10px;
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;
const Username = styled.div`
  padding: 5px;
  border-radius: 5px;
  box-shadow: 1px 4px 18px 0px #00000040;
`;
const UsernameText = styled.h5`
  font-size: 14px;
  font-weight: 400;
  color: #000000a2;
  ${mobile({ fontSize: "12px" })}
`;
const Title = styled.h1`
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #000000;
  font-weight: 500;
  margin-bottom: 5px;
  letter-spacing: 0em;
  padding-top: 15px;
  justify-content: center;

  ${mobile({ fontSize: "14px" })}
`;
const SectionHead = styled.h3`
  font-size: 30px;
  font-weight: 400;
  text-align: center;
  ${mobile({
    fontSize: "26px",
    lineHeight: "2rem",
    width: "90%",
    textAlign: "center",
  })}
  letter-spacing: 0em;
  margin: 0 auto;
`;
const SubHeading = styled.h2`
  font-size: 50px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 15px;
  background: linear-gradient(to right, #8c0de2 0%, #fcb045 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
const RandomUsers = () => {
  const [randomUsers, setRandomUsers] = useState(null);
  const [title, setTitle] = useState("Influencers");
  useEffect(() => {
    const getRandomUsers = async () => {
      try {
        const res = await publicRequest.get(`/user/randomUsers`);
        if (res.status === 200) {
          setRandomUsers(res.data.results.data);
        }
      } catch (error) {}
    };
    getRandomUsers();
  }, []);

  useEffect(() => {
    function getRandomTitles() {
      const titles = [
        "Creators",
        "Artists",
        "Influencers",
        "Churches",
        "Musicians",
        "Organizations",
        "Sellers",
        "Groups",
      ];
      var title = titles[Math.floor(Math.random() * titles.length)];
      setTitle(title);
    }
    setInterval(() => {
      getRandomTitles();
    }, 2000);
  }, []);

  return (
    <Container>
      {randomUsers ? (
        <>
          <SectionHead>Built For</SectionHead>
          <SubHeading className="animate__animated animate__fadeIn">
            {title}
          </SubHeading>
          <UsersDiv
            style={{
              padding: "10px 20px 30px 20px",
              width: "100%",
              overflow: "scroll",
              background: "white",
            }}
            center
            gap={20}
          >
            {randomUsers?.map((user, i) => (
              <FlexCol key={i}>
                <Link href={`${getBaseUrl()}/${user?.username}`} legacyBehavior>
                  <CardWrapper>
                    <ImageContainer>
                      <Image
                        src={
                          user?.profilePicture
                            ? user?.profilePicture
                            : "/images/noAvatar.png"
                        }
                        alt=""
                      />
                    </ImageContainer>
                    <Username>
                      <UsernameText>nokofio.me/{user?.username}</UsernameText>
                    </Username>
                    <Title>
                      {user?.displayName}
                      {user?.verificationBadge && (
                        <VerifiedIcon
                          sx={{ marginLeft: "3px", color: "#40A0ED" }}
                        />
                      )}
                    </Title>
                  </CardWrapper>
                </Link>
              </FlexCol>
            ))}
          </UsersDiv>
        </>
      ) : null}
    </Container>
  );
};

export default RandomUsers;
