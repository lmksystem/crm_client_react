import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTransactionBank as getTransactionBankApi } from "../../helpers/backend_helper";
import { toast } from "react-toastify";

export const getTransactionBank = createAsyncThunk(
  "transactionBank/getTransactionBank",
  async (perdiodeCalendar) => {
    try {
      const response = await getTransactionBankApi(perdiodeCalendar);
      console.log("its reponse ", response);
      return response;
    } catch (error) {
      toast.error("Transaction Bank Read Failed", { autoClose: 3000 });
      return error;
    }
  }
);
