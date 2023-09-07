import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Include Both Helper File with needed methods
import {
  getProducts as getProductsApi,
  addProduct as addProductApi,
  updateProduct as updateProductApi
} from "../../helpers/backend_helper";

export const getProducts = createAsyncThunk("product/getProducts", async () => {
  try {
    const response = getProductsApi();
    return response;
  } catch (error) {
    return error;
  }
});

export const addProduct = createAsyncThunk("product/addProduct", async (product) => {
  try {
    const response = addProductApi(product);
    toast.success("Produit ajouté", { autoClose: 3000 });
    return response;
  } catch (error) {
    toast.error("Echec de l'ajout", { autoClose: 3000 });
    return error;
  }
});

export const updateProduct = createAsyncThunk("product/updateProduct", async (product) => {
  try {
    const response = updateProductApi(product);
    toast.success("Produit mis à jour", { autoClose: 3000 });
    return response;
  } catch (error) {
    toast.error("Echec de la mise à jour", { autoClose: 3000 });
    return error;
  }
});
