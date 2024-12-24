import { createSlice, current } from "@reduxjs/toolkit";
import { addLicense, createOrUpdateCompany, deleteLicense, getCompany, getLicense, updateCompany } from "./thunk";
import { toast } from "react-toastify";

import paysData from "../../Components/constants/paysPhone.json";

export const initialState = {
  company: {},
  devise: "€",
  license: [],
  error: {},
  isCompanySuccess: false,
  isCompanyCreated: false
};

const companySlice = createSlice({
  name: "Company",
  initialState,
  reducers: {
    updateLogo(state, action) {
      state.company[0].com_logo = action.payload;
    },
    updateCompanyData(state, action) {
      state.company[0] = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getCompany.fulfilled, (state, action) => {
      state.company = action.payload.data;
      state.devise = "€";
      state.isCompanyCreated = false;
      state.isCompanySuccess = true;
    });

    builder.addCase(getCompany.rejected, (state, action) => {
      state.error = action.payload.error || null;
      state.isCompanyCreated = false;
      state.isCompanySuccess = false;
    });

    builder.addCase(createOrUpdateCompany.fulfilled, (state, action) => {});

    builder.addCase(createOrUpdateCompany.rejected, (state, action) => {});

    builder.addCase(updateCompany.fulfilled, (state, action) => {
      state.company[0] = action.payload.data;
      toast.success("Mise à jour d'entrerpise résussie", { autoClose: 3000 });
      state.isCompanySuccess = true;
    });

    builder.addCase(updateCompany.rejected, (state, action) => {
      console.log("rejected ", action.payload);
      state.error = action.payload.error || null;
    });

    builder.addCase(addLicense.fulfilled, (state, action) => {
      state.license.push(action.payload.data);
      toast.success("Ajout d'un utilisateur résussie", { autoClose: 3000 });
    });

    builder.addCase(addLicense.rejected, (state, action) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(getLicense.fulfilled, (state, action) => {
      state.license = action.payload.data;
    });

    builder.addCase(getLicense.rejected, (state, action) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(deleteLicense.fulfilled, (state, action) => {
      state.license = state.filter((t) => t.use_id != action.payload);
    });

    builder.addCase(deleteLicense.rejected, (state, action) => {
      state.error = action.payload.error || null;
    });
  }
});

export const { updateLogo, updateCompanyData } = companySlice.actions;

export default companySlice.reducer;
