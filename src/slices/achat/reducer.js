import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import moment from "moment";
import { createUpdateAchat, deleteAchat, getAchat } from "./thunk";
moment.locale('fr')

export const initialState = {
  achats: [],
  error: {},
  isAchatSuccess: false,
};

const achatSlice = createSlice({
  name: "Achat",
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder.addCase(createUpdateAchat.fulfilled, (state, action) => {
      toast.success('Ajout réussie', { autoClose: 3000 })
      state.isAchatSuccess = true;
      if(!Array.isArray(action.payload.data)){
        let index = state.achats.findIndex(
          (c) => c.ach_id == action.payload.data.ach_id
        );
        if (index != -1) {
          state.achats[index] = action.payload.data;
        } else {
          state.achats.push(action.payload.data);
        }
      }else{
        state.achats = state.achats.concat(action.payload.data);
      }
    });
    builder.addCase(createUpdateAchat.rejected, (state, action) => {
      toast.error('Erreur d\'ajout !', { autoClose: 3000 })
      state.isAchatSuccess = false;
      state.error = action.payload || "Erreur lors de l'ajout !"
    });
    builder.addCase(getAchat.fulfilled, (state, action) => {
      state.isAchatSuccess = true;
      state.achats = action.payload.data || [];
    });
    builder.addCase(getAchat.rejected, (state, action) => {
      state.isAchatSuccess = false;
      state.error = action.payload || "Erreur lors de la recupération !"
    });
    builder.addCase(deleteAchat.fulfilled, (state, action) => {
      toast.success('Achat supprimé', { autoClose: 3000 });
      state.achats = state.achats.filter((ach) => ach.ach_id != action.payload.data)
      state.isAchatSuccess = true;
    });
    builder.addCase(deleteAchat.rejected, (state, action) => {
      state.isAchatSuccess = false;
      state.error = action.payload ||  "Erreur de suppression !"
    });
    // builder.addCase(deleteSalary.fulfilled, (state, action) => {
    //   toast.success('Salaire supprimé', { autoClose: 3000 })
    //   state.isSalarySuccess = true;
    //   state.salaries = state.salaries.filter((s) => s.sal_id != action.payload.data)
    // })
    // builder.addCase(deleteSalary.rejected, (state, action) => {
    //   toast.error('Erreur de suppression !', { autoClose: 3000 })
    //   state.isSalarySuccess = false;
    //   state.error = action.payload || "Erreur de suppression !"
    // });
    
  }
});

export default achatSlice.reducer;
