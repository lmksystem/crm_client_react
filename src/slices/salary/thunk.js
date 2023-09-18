import { createAsyncThunk } from "@reduxjs/toolkit";
import {
getSalary as getSalaryApi,
createUpdateSalary as createUpdateSalaryApi,
} from "../../helpers/backend_helper";
import { toast } from "react-toastify";






export const createUpdateSalary = createAsyncThunk("salary/createUpdateSalary", async (data) => {
  try {
    const response = await createUpdateSalaryApi(data);
    return response;
  }
  catch (error) {
    console.log("error createUpdateSalary",error)
    toast.error("Salary Post Failed", { autoClose: 3000 });
    return error;
  }
});

export const getSalary = createAsyncThunk("salary/getSalary", async (year) => {
  try {
    const response = await getSalaryApi(year);
    console.log(response)
    return response;
  }
  catch (error) {
    toast.error("Salary Get Failed", { autoClose: 3000 });
    return error;
  }
});

// export const sendInvocieByEmail = createAsyncThunk("invoice/sendInvocieByEmail", async (id) => {
//   try {
//     const response = await sendInvocieByEmailApi(id);
//     return response;
//   }
//   catch (error) {
//     toast.error("Invoice Delete Failed", { autoClose: 3000 });
//     return error;
//   }
// });

// export const deleteTransaction = createAsyncThunk("invoice/deleteTransaction", async (id) => {
//   try {
//     const response = deleteTransactionApi(id);
//     return response;
//   }
//   catch (error) {
//     toast.error("Invoice Delete Failed", { autoClose: 3000 });
//     return error;
//   }
// });

// export const getTransactionList = createAsyncThunk("invoice/getTransactionList", async (id) => {
//   try {
//     const response = getTransactionListApi(id);
//     return response;
//   }
//   catch (error) {
//     toast.error("Invoice Delete Failed", { autoClose: 3000 });
//     return error;
//   }
// });

// export const getTransactionPricePeriode = createAsyncThunk("transaction/getTransactionPricePeriode", async (data) => {
//   try {
//     const response =await getTransactionPricePeriodeApi(data);
//     return response;
//   } 
//   catch (error) {
//     toast.error("Transaction Read Failed", { autoClose: 3000 });
//     return error;
//   }
// });

// export const getTransactionByMonth = createAsyncThunk("transaction/getTransactionByMonth", async (data) => {
//   try {
//     const response =await getTransactionByMonthApi(data);
//     // console.log("response getTransactionByMonth",response)
//     return response;
//   } 
//   catch (error) {
//     toast.error("Transaction Read Failed", { autoClose: 3000 });
//     return error;
//   }
// });