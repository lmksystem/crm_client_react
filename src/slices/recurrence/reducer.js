import { createSlice } from "@reduxjs/toolkit";
import { addRecurrence, deleteRecurrence, getRecurrenceOfEntity, getRecurrences } from './thunk';

export const initialState = {
  recurrences: [],
  recurrenceOfEntity: [],
  error: {},
  isRecurrenceSuccess: false
};

const RecurrenceSlice = createSlice({
  name: 'recurrence',
  initialState,
  reducer: {
    removeRecurrenceById: (state, action) => {
      const idToRemove = action.payload;
      state.recurrences = state.recurrences.filter(recurrence => recurrence.rec_id !== idToRemove);
    },

  },
  extraReducers: (builder) => {
    builder.addCase(getRecurrences.fulfilled, (state, action) => {
  
      state.recurrences = action.payload.data;
      state.isRecurrenceSuccess = true;
      state.isRecurrenceAdd = false
    });

    builder.addCase(getRecurrences.rejected, (state, action) => {
      state.isrecurrenceGet = false;
      state.isRecurrencesGetFail = true;
    });
   
    builder.addCase(getRecurrenceOfEntity.fulfilled, (state, action) => {
      state.recurrenceOfEntity = action.payload.data;
      
    });

    builder.addCase(getRecurrenceOfEntity.rejected, (state, action) => {

    });

    builder.addCase(addRecurrence.fulfilled, (state, action) => {
      // state.recurrences.push(action.payload.data);
      state.isRecurrenceAdd = true;
      state.isRecurrenceSuccess = true;
    });

    builder.addCase(addRecurrence.rejected, (state, action) => {
      state.isRecurrenceAdd = false;
      state.isRecurrenceSuccess = true;
    });

    builder.addCase(deleteRecurrence.fulfilled, (state, action) => {
      state.recurrenceOfEntity = state.recurrenceOfEntity.filter((r) => r.rec_id != action.payload);
      state.isRecurrenceSuccess = true;
      state.isRecurrenceFail = false;
    });

    builder.addCase(deleteRecurrence.rejected, (state, action) => {
      state.error = action.payload?.data || null;
      state.isRecurrenceSuccess = false;
      state.isRecurrenceFail = true;
    });
  }
});
export const { removeRecurrenceById } = RecurrenceSlice.actions;
export default RecurrenceSlice.reducer;