import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import resumes from "../slices/resumesSlice"

export const store = configureStore({
  reducer: {
    resumes
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
