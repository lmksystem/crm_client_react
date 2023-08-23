import { createSlice } from "@reduxjs/toolkit";
import { getProducts, addProduct, updateProduct } from './thunk';

export const initialState = {
  products: [],
  error: {},
  isProductSuccess : false
};

const ProductSlice = createSlice({
  name: 'product',
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.products = action.payload.data;
      state.isProductSuccess = true;
    });
    builder.addCase(getProducts.rejected, (state, action) => {
      state.isProductGet = false;
      state.isProductGetFail = true;
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.products.push(action.payload.data);
      state.isProductSuccess = true;
    });
    builder.addCase(addProduct.rejected, (state, action) => {
      state.isProductAdd = false;
      state.isProductAddFail = true;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.products = state.products.map(product =>
        product.pro_id == action.payload.data.pro_id
          ? { ...product, ...action.payload.data }
          : product
      );
      state.isProductSuccess = true;
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.isProductAdd = false;
      state.isProductAddFail = true;
    });
  }
});

export default ProductSlice.reducer;