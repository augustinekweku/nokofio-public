import styled from "styled-components";
import Lottie from "react-lottie-player";
import lottieJson from "../../lottie/error-occurred.json";

const GifContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const FailedGif = () => {
  return (
    <GifContainer>
      <Lottie
        loop={false}
        animationData={lottieJson}
        play
        style={{ width: 150, height: 150 }}
      />{" "}
    </GifContainer>
  );
};

export default FailedGif;

