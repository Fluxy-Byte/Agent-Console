import { combineReducers } from "@reduxjs/toolkit";
import { activeCompanyReducer } from "./slices/active-company-slice";
import { authReducer } from "./slices/auth-slice";

export const rootReducer = combineReducers({
  auth: authReducer,
  activeCompany: activeCompanyReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
