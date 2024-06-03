import styled from "styled-components";
import { mobile } from "../../responsive";
import { tablet, desktop } from "../../responsive";

import DashboardRight from "../../components/DashboardRight";
import { useRef, useState } from "react";
import { useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import BackNavTitle from "../../components/BackNavTitle";
import UserShare from "../../components/UserShareRow";
import {
  FormContainer,
  FormOption,
  FormSelect,
  SelectContainer,
} from "../../StyledComponents/common";
import { useReducer } from "react";
import { Checkbox, CircularProgress, FormControlLabel } from "@mui/material";
import clsx from "clsx";
import shopServices from "../../services/shopServices";
import axios from "axios";
import { centerToast } from "../../toast";
import Layout from "../../components/Layout";
import AuthLayout from "../../components/AuthLayout";
import { API_URL_V1 } from "../../helpers/constants";

const Container = styled.div``;
const MainRow = styled.div`
  display: flex;
`;
const MainLeft = styled.div`
  overflow-y: scroll;
  height: 100vh;
  padding-top: 32px;
  padding-bottom: 32px;
  flex: 2;
  background-color: #e8e8e8;
  ${mobile({ width: "100%", paddingTop: "0px", height: "100vh" })}
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

const Button = styled.button`
  padding: 15px;
  font-size: 14px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  ${mobile({ fontSize: "12px", padding: "12px" })}
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

const FormActionRow = styled.div`
  margin: 20px 0 0 0;
`;

const FormRowFlex = styled.div`
  display: flex;
  justify-content: space-between;
  ${tablet({ flexDirection: "column" })};
  ${mobile({ flexDirection: "column" })};
  ${desktop({ flexDirection: "row" })};
`;
const FormCol = styled.div`
  width: 100%;
`;

const ProductsContainer = styled.div`
  overflow-x: scroll;
  margin-top: 32px;
`;
const ProductsWrapper = styled.div`
  display: flex;
`;
const ProductCardColumn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-right: 15px;
`;
const ProductCard = styled.div`
  background: #fff;
  width: 183px;
  height: 300px;
  border-radius: 10px;
  padding: 10px 16px;
  position: relative;
`;
const ProductCardImageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
export const ProductCardImage = styled.img`
  object-fit: contain;
  width: 146px;
  height: 121px;
`;

const ProductDescription = styled.div`
  font-size: 12px;
  font-weight: 400;
  margin-top: 10px;
`;
const ProductTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  margin-top: 10px;
`;
const ProductPrice = styled.div`
  font-size: 15px;
  font-weight: 700;
  padding: 7px 0;
  position: absolute;
  bottom: 20px;
`;
const DeleteIconWrapper = styled.div`
  background: #dad8d8;
  padding: 17px;
  border-radius: 50%;

  ${mobile({ height: "50px", width: "50px" })}
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const fileCategory = {
  digitalPDF: "digitalPDF",
};

const productType = {
  DIGITAL: "DIGITAL",
  PHYSICAL: "PHYSICAL",
};

const Shop = () => {
  const [state, updateState] = useReducer(
    (state, newState) => {
      const update = { ...state, ...newState };
      if (
        update.itemName !== "" &&
        update.price !== "" &&
        update.quantity !== "" &&
        update.description !== "" &&
        update.featuredImage !== null &&
        update.productType !== ""
      ) {
        update.isFormValid = true;
      }

      return update;
    },
    {
      itemName: "",
      price: "",
      quantity: "",
      description: "",
      featuredImage: null,
      productType: "",
      productCategory: "",
      affiliateSellingPrice: "",
      profit: "",
      isActive: false,
      enableShortcut: false,
      fileCategory: fileCategory.digitalPDF,
      file: null,
      isFormValid: false,
      isCreatingProduct: false,
      products: [],
      isLoadingProducts: false,
      isDeletingProduct: false,
      deletingProductId: null,
    }
  );
  const featuredImageRef = useRef();
  const fileRef = useRef();
  if (typeof window !== "undefined") {
    var TOKEN = JSON.parse(localStorage.getItem("currentUser"))?.accessToken;
  }
  async function createProduct(e) {
    e.preventDefault();

    if (!state.featuredImage) {
      centerToast("error", "Oops!", "Please select a featured image");
      return;
    }
    const myHeaders = new Headers();
    myHeaders.append("x-access-token", TOKEN);
    myHeaders.append("Content-Type", "multipart/form-data");
    myHeaders.append("Accept", "application/json");

    const productFormData = new FormData();
    productFormData.append("itemName", state.itemName);
    productFormData.append("price", state.price);
    productFormData.append("quantity", state.quantity);
    if (state.featuredImage) {
      productFormData.append("featuredImage", state.featuredImage);
    }
    productFormData.append("productType", state.productType);
    productFormData.append("description", state.description);
    // productFormData.append(
    //   "affiliateSellingPrice",
    //   state.affiliateSellingPrice || ""
    // );
    // productFormData.append("profit", state.profit || "");
    productFormData.append("isActive", state.isActive);
    productFormData.append("enableShortcut", state.enableShortcut);
    productFormData.append("fileCategory", state.fileCategory);
    if (state.file) {
      productFormData.append("files", state.file);
    }

    updateState({ isCreatingProduct: true });
    axios({
      method: "POST",
      url: `${API_URL_V1}/shop/item`,
      data: productFormData,
      headers: {
        "Content-Type": "multipart/form-data",
        "x-access-token": TOKEN,
      },
    })
      .then(function (response) {
        //handle success
        updateState({ isCreatingProduct: false });
        centerToast("success", "Great", "Product created successfully");
        initState();
        getProducts();
      })
      .catch(function (error) {
        //handle error
        updateState({ isCreatingProduct: false });
        if (error?.response?.data) {
          centerToast("error", "Oops!", error.response.data.message);
        }
      });
  }

  function handleIsActiveChange(e) {
    updateState({ isActive: e.target.checked });
  }
  function handleEnableShortcutChange(e) {
    updateState({ enableShortcut: e.target.checked });
  }

  function deleteProduct(id) {
    try {
      updateState({ isDeletingProduct: true, deletingProductId: id });
      const res = shopServices.deleteProduct(id);
      getProducts();
    } catch (error) {
    } finally {
      updateState({ isDeletingProduct: false, deletingProductId: null });
    }
  }

  function initState() {
    updateState({
      itemName: "",
      price: "",
      quantity: "",
      description: "",
      featuredImage: null,
      productType: "",
      productCategory: "",
      affiliateSellingPrice: "",
      profit: "",
      isActive: false,
      enableShortcut: false,
      fileCategory: "",
      file: null,
      isFormValid: false,
    });
  }

  async function getProducts() {
    try {
      updateState({ isLoadingProducts: true });
      const { data } = await shopServices.getProducts();
      updateState({ products: data.results });
    } catch (error) {
    } finally {
      updateState({ isLoadingProducts: false });
    }
  }
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Container className="animate__animated animate__fadeIn">
      <MainRow>
        <MainLeft>
          <UserShare />
          <InnerLeft>
            <BackNavTitle title={"Shop Setup"} />
            <Form>
              <FormContainer>
                <FormRow>
                  <Label>Item Name</Label>
                  <Input
                    value={state?.itemName}
                    placeholder="Enter item name"
                    onChange={(e) => {
                      updateState({ itemName: e.target.value });
                    }}
                  />
                </FormRow>
                <FormRow>
                  <Label>Product Description</Label>
                  <Input
                    value={state?.description}
                    placeholder="Enter Product Description"
                    onChange={(e) => {
                      updateState({ description: e.target.value });
                    }}
                  />
                </FormRow>
                <FormRow>
                  <Label>Product Quantity</Label>
                  <Input
                    value={state?.quantity}
                    placeholder="Enter Product Quantity"
                    type={"number"}
                    onChange={(e) => {
                      updateState({ quantity: e.target.value });
                    }}
                  />
                </FormRow>

                <FormRowFlex style={{ gap: 13 }}>
                  <FormCol>
                    <Label>Price</Label>
                    <Input
                      value={state?.price}
                      type={"number"}
                      placeholder="Enter Product Price"
                      onChange={(e) => {
                        updateState({ price: e.target.value });
                      }}
                    />
                  </FormCol>
                  <FormCol>
                    <Label>Featured Image</Label>
                    <Input
                      type="file"
                      accept=".png,.jpeg,.jpg"
                      onChange={(e) => {
                        updateState({ featuredImage: e.target.files[0] });
                      }}
                    />
                  </FormCol>
                </FormRowFlex>
                <FormRowFlex style={{ gap: 13 }}>
                  <FormCol>
                    <Label>Product Type</Label>
                    <SelectContainer>
                      <FormSelect
                        onChange={(e) => {
                          updateState({ productType: e.target.value });
                        }}
                        value={state?.productType}
                      >
                        <FormOption value={""} disabled>
                          Select Product Type
                        </FormOption>
                        <FormOption value={"DIGITAL"}>
                          Digital Product (Ebook, Software, etc)
                        </FormOption>
                        <FormOption value={"PHYSICAL"}>
                          Physical Product (Shirt, Mobile Phone etc)
                        </FormOption>
                      </FormSelect>
                    </SelectContainer>
                  </FormCol>
                  {state?.productType === "DIGITAL" ? (
                    <FormCol>
                      <Label>File</Label>
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          updateState({ file: e.target.files[0] });
                        }}
                        placeholder="Add a tag or display name"
                      />
                    </FormCol>
                  ) : null}
                </FormRowFlex>

                <FormRowFlex style={{ gap: 13 }}>
                  <FormCol>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            color: "#000000e3",
                            "&.Mui-checked": {
                              color: "#000000e3",
                            },
                          }}
                          checked={state.isActive}
                          onChange={(e) => handleIsActiveChange(e)}
                        />
                      }
                      label="is Active"
                    />
                  </FormCol>
                  <FormCol>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            color: "#000000e3",
                            "&.Mui-checked": {
                              color: "#000000e3",
                            },
                          }}
                          checked={state.enableShortcut}
                          onChange={(e) => handleEnableShortcutChange(e)}
                        />
                      }
                      label="Enable Shortcut"
                    />
                  </FormCol>
                </FormRowFlex>
                {/* <FormRowFlex style={{ gap: 13 }}>
                  <FormCol>
                    <Label>Profit</Label>
                    <Input
                      placeholder="Enter Profit"
                      onChange={(e) => {
                        updateState({ profit: e.target.value });
                      }}
                    />
                  </FormCol>
                  <FormCol>
                    <Label>Affilliate Selling Price</Label>
                    <Input
                      placeholder="Enter Affiliate Selling Price"
                      onChange={(e) => {
                        updateState({ affiliateSellingPrice: e.target.value });
                      }}
                    />
                  </FormCol>
                </FormRowFlex> */}
                <FormActionRow>
                  <Button
                    onClick={createProduct}
                    disabled={!state.isFormValid || state.isCreatingProduct}
                  >
                    Submit
                    {state.isCreatingProduct ? (
                      <CircularProgress sx={{ color: "white" }} size={20} />
                    ) : null}
                  </Button>
                </FormActionRow>
              </FormContainer>
            </Form>
            <ProductsContainer>
              <ProductsWrapper>
                {state.isLoadingProducts ? (
                  <CircularProgress
                    sx={{ color: "black", margin: "auto" }}
                    size={20}
                  />
                ) : (
                  state?.products.map((product, i) => (
                    <ProductCardColumn key={i}>
                      <ProductCard>
                        <ProductCardImageWrapper>
                          <ProductCardImage src={product.featuredImage} />
                        </ProductCardImageWrapper>
                        <ProductTitle>
                          {product?.itemName?.length > 20
                            ? product?.itemName.substring(0, 20) + "..."
                            : product.itemName}
                        </ProductTitle>
                        <ProductDescription>
                          {product?.description?.length > 70
                            ? product?.description.substring(0, 70) + "..."
                            : product?.description}
                          {product?.description?.length}
                        </ProductDescription>
                        <ProductPrice>
                          GHS
                          {product?.price}
                        </ProductPrice>
                      </ProductCard>
                      <DeleteIconWrapper>
                        {state.isDeletingProduct &&
                        state.deletingProductId === product.id ? (
                          <CircularProgress sx={{ color: "black" }} size={20} />
                        ) : (
                          <DeleteIcon
                            onClick={() => deleteProduct(product.id)}
                            sx={{ color: red[500] }}
                          />
                        )}
                      </DeleteIconWrapper>
                    </ProductCardColumn>
                  ))
                )}
                {/* <ProductCardColumn>
                  <ProductCard>
                    <ProductCardImageWrapper>
                      <ProductCardImage src="/images/Image.png" />
                    </ProductCardImageWrapper>
                    <ProductTitle>Classic Shoe</ProductTitle>
                    <ProductDescription>
                      {"Lee Pucker design. Leather botinki for handsome designers.Free shipping.".substring(
                        0,
                        70
                      ) + "..."}
                    </ProductDescription>
                    <ProductPrice>GHS 13.95</ProductPrice>
                  </ProductCard>
                  <DeleteIconWrapper>
                    <DeleteIcon sx={{ color: red[500] }} />
                  </DeleteIconWrapper>
                </ProductCardColumn> */}
              </ProductsWrapper>
            </ProductsContainer>
          </InnerLeft>
        </MainLeft>
        <MainRight>
          <DashboardRight />
        </MainRight>
      </MainRow>
    </Container>
  );
};

export default Shop;

Shop.getLayout = function getLayout(page) {
  return (
    <Layout>
      <AuthLayout>{page}</AuthLayout>
    </Layout>
  );
};
