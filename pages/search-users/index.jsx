import Link from "next/link";
import styled from "styled-components";
import PublicNavbar from "../../components/PublicNavbar";
import { mobile } from "../../responsive";
import { Btn, Button, DivFlex, FlexCol } from "../../StyledComponents/common";

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

const UsersDiv = styled(DivFlex)`
  justify-content: center;
  ${mobile({ justifyContent: "start" })}
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
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 5px;
  letter-spacing: 0em;
  margin-top: 15px;
  ${mobile({ fontSize: "14px" })}
`;

const Input = styled.input`
  padding: 12px 14px 12px 14px;
  width: 100%;
  height: 48px;
  background: #f5f5f5;
  border-radius: 8px;
  border: none;
  &:focus {
    outline: none;
  }
`;

const index = () => {
  return (
    <div>
      <PublicNavbar />
      <Input required placeholder="Enter password" />

      <Btn bg="#fbb516" color="#151515">
        {" "}
        Search
      </Btn>

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
        {/* {randomUsers?.map((user, i) => (
              <FlexCol key={i}>
                <Link href={`https://nokofio.me/${user?.username}`}>
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
                    <Title>{user?.displayName}</Title>
                  </CardWrapper>
                </Link>
              </FlexCol>
            ))} */}
      </UsersDiv>
    </div>
  );
};

export default index;
