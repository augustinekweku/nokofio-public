import { useState } from "react";
import { ClipLoader, HashLoader } from "react-spinners";
import styled from "styled-components";
import Lottie from "react-lottie-player";
import lottieJson from "../lottie/nokofio_loading_animation.json";

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background: #17161638;
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const FullPageLoader = ({ fullPageLoaderMsg }) => {
  let [loading] = useState(true);
  let [color] = useState("#ffffff");

  return (
    <div>
      <LoadingContainer>
        <div>
          <Lottie
            loop={true}
            animationData={lottieJson}
            play
            style={{ width: 150, height: 150 }}
          />{" "}
        </div>
        <br />
        <div style={{ textAlign: "center", color: "white", fontSize: "16px" }}>
          {fullPageLoaderMsg || null}
        </div>
      </LoadingContainer>
    </div>
  );
};

export default FullPageLoader;
