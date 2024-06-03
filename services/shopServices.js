import HttpClient from "../helpers/http-client";
const httpClient = new HttpClient();

 const createProduct = async (productObj) => {
    //add authorization headers to userRequest
    // httpClient.addAuthorizationHeaders({
    //     "Content-Type": "multipart/form-data",
    // });
    //post product
    return await httpClient.userRequest.post(`/shop/item`, productObj);





}
 const getProducts = async () => {
    return await httpClient.userRequest.get(`/shop/item`);
}
 const getProductsForPublic = async (username) => {
    return await httpClient.publicRequest.get(`/shop/item/public?username=${username}`);
}
const deleteProduct = async (id) => {
    return await httpClient.userRequest.delete(`/shop/item/${id}`);
}




const shopServices = {
    createProduct,
    getProducts,
    getProductsForPublic,
    deleteProduct

}

export default shopServices;