import { useState } from "react";
import { ClipLoader, HashLoader } from "react-spinners";
import styled from "styled-components";

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 5px;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  /* background: rgba(0, 0, 0, 0.5); */
`;

const RelativeInnerLoader = ({ iconSize }) => {
  let [loading] = useState(true);
  let [color] = useState("#ffffff");

  return (
    <LoadingContainer>
      {/* <ClipLoader
          color={color}
          loading={loading}
          size={100}
          cssOverride={override}
        /> */}
      <ClipLoader color="#63595a" size={iconSize ? iconSize : 50} />
    </LoadingContainer>
  );
};

export default RelativeInnerLoader;
