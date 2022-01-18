import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { Resume } from "../interfaces/Resume";

const resumesSlice = createSlice({
    name: "resumes",
    initialState: [] as Array<Resume>,
    reducers: {
        addResume: (state, {payload}: PayloadAction<Resume>) => {
            state.push({...payload})
        }
    }
})

export const { addResume } = resumesSlice.actions

export default resumesSlice.reducer
