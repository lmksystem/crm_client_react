import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import moment from "moment";
import { createUpdateAchat, deleteAchat, getAchat, getAchatLinkTransaction, getCategorieAchat, linkTransToAchat, updateMatchAmount } from "./thunk";
moment.locale('fr')

export const initialState = {
  achats: [],
  categories: [],
  error: {},
  isAchatSuccess: false,
};

const achatSlice = createSlice({
  name: "Achat",
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder.addCase(createUpdateAchat.fulfilled, (state, action) => {
      state.isAchatSuccess = true;
      if (!Array.isArray(action.payload.data)) {
        let index = state.achats.findIndex((c) => c.ach_id == action.payload.data.ach_id);

        if (index != -1) {
          state.achats[index] = { ...state.achats[index], ...action.payload.data };
        } else {
          state.achats.push(action.payload.data);
        }

      } else {
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
      state.error = action.payload || "Erreur de suppression !"
    });

    builder.addCase(getAchatLinkTransaction.fulfilled, (state, action) => {
      state.isAchatSuccess = true;
      state.achats = action.payload.data || [];
    });
    builder.addCase(getAchatLinkTransaction.rejected, (state, action) => {
      state.isAchatSuccess = false;
      state.error = action.payload || "Erreur lors de la recupération !"
    });
    builder.addCase(linkTransToAchat.fulfilled, (state, action) => {
      state.isAchatSuccess = true;
      state.achats = state.achats.map((ach) =>
        ach.ach_id == action.payload.data.ach_id
          ? { ...action.payload.data, old: (ach.old == 1 ? 0 : 1), aba_match_amount: (action.payload.data?.aba_match_amount ? action.payload.data.aba_match_amount : 0), ach_rp: (action.payload.data?.ach_rp ? action.payload.data.ach_rp : 0) }
          : ach
      );
    });
    builder.addCase(linkTransToAchat.rejected, (state, action) => {
      state.isAchatSuccess = false;
      state.error = action.payload || "Erreur lors de la recupération !";
    });

    builder.addCase(updateMatchAmount.fulfilled, (state, action) => {
      state.isAchatSuccess = true;
      state.achats = state.achats.map((ach) =>
        ach.ach_id == action.payload.data.ach_id
          ? action.payload.data
          : ach
      );
    });
    builder.addCase(updateMatchAmount.rejected, (state, action) => {
      state.isAchatSuccess = false;
      state.error = action.payload || "Erreur lors de la recupération !";
    });
    builder.addCase(getCategorieAchat.fulfilled, (state, action) => {
      state.isAchatSuccess = true;
      state.categories = action.payload.data || [];
    });
    builder.addCase(getCategorieAchat.rejected, (state, action) => {
      state.isAchatSuccess = false;
      state.error = action.payload || "Erreur lors de la recupération !"
    });


  }
});

export default achatSlice.reducer;
