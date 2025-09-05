import { baseApi } from "./api/baseApi";
import userReducer from "./Slices/userSlice";
export const reducer = {
  user: userReducer,

  [baseApi.reducerPath]: baseApi.reducer,
};
