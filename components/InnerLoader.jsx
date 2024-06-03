import { useState } from "react";
import { ClipLoader, HashLoader } from "react-spinners";
import styled from "styled-components";

const LoadingContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 5px;
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InnerLoader = ({ iconSize }) => {
  let [loading] = useState(true);
  let [color] = useState("#ffffff");

  return (
    <div>
      <LoadingContainer>
        {/* <ClipLoader
          color={color}
          loading={loading}
          size={100}
          cssOverride={override}
        /> */}
        <ClipLoader color="#63595a" size={iconSize ? iconSize : 50} />
      </LoadingContainer>
    </div>
  );
};

export default InnerLoader;
