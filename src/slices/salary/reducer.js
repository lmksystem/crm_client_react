import { createSlice } from "@reduxjs/toolkit";
import { addNewTransaction, createUpdateSalary, deleteSalary, deleteTransaction, getSalary, getTransaction, getTransactionByMonth, getTransactionList, getTransactionPricePeriode } from "./thunk";
import { toast } from "react-toastify";
import moment from "moment";
moment.locale('fr')

export const initialState = {
  salaries: [],
  error: {},
  isSalarySuccess: false,
};

const salarySlice = createSlice({
  name: "Salary",
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder.addCase(createUpdateSalary.fulfilled, (state, action) => {
      toast.success('Ajout réussie', { autoClose: 3000 })
      state.isSalarySuccess = true;
      state.salaries.push(action.payload.data);
    });
    builder.addCase(createUpdateSalary.rejected, (state, action) => {
      toast.error('Erreur d\'ajout !', { autoClose: 3000 })
      state.isSalarySuccess = false;
      state.error = action.payload || "Erreur lors de l'ajout !"
    });
    builder.addCase(getSalary.fulfilled, (state, action) => {
      state.isSalarySuccess = true;
      state.salaries = action.payload.data || [];
    });
    builder.addCase(getSalary.rejected, (state, action) => {
      state.isSalarySuccess = false;
      state.error = action.payload || "Erreur lors de la recupération !"
    });
    builder.addCase(deleteSalary.fulfilled, (state, action) => {
      toast.success('Salaire supprimé', { autoClose: 3000 })
      state.isSalarySuccess = true;
      state.salaries = state.salaries.filter((s) => s.sal_id != action.payload.data)
    })
    builder.addCase(deleteSalary.rejected, (state, action) => {
      toast.error('Erreur de suppression !', { autoClose: 3000 })
      state.isSalarySuccess = false;
      state.error = action.payload || "Erreur de suppression !"
    });
    
  }
});

export default salarySlice.reducer;
