import { createSlice } from "@reduxjs/toolkit";
import { createUpdateEmployee, deleteEmployee, getEmployees } from "./thunk";
// import {

// } from "./thunk";

export const initialState = {
  employees: [],
  error: {},
  isEmployeSuccess:true,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getEmployees.fulfilled, (state, action) => {
      state.employees = action.payload.data;
      state.isEmployeSuccess = true;

    });
    builder.addCase(getEmployees.rejected, (state, action) => {
      state.error = action.payload || null;
      state.isEmployeSuccess = false;

    });
    builder.addCase(createUpdateEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload.data);
        state.isEmployeSuccess = true;
      });
      
      builder.addCase(createUpdateEmployee.rejected, (state, action) => {
        state.error = action.payload || null;
        state.isEmployeSuccess = false;
      });


      builder.addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = (state.employees || []).filter(
            (employee) => employee.use_id != action.payload
          );
        });
  
      builder.addCase(deleteEmployee.rejected, (state, action) => {
        state.error = action.payload.msg || null;
      });
  },
});

export default employeeSlice.reducer;
