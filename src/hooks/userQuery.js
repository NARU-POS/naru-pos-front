import { useQuery, useMutation, useQueryClient } from "react-query";
import { get, post } from "../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useGetCurrentUser() {
  const queryclient = useQueryClient();

  return useQuery(
    "userState",
    async () => {
      const res = await get("users/current");
      return { userState: res.data, isLogin: !!res.data };
    },
    {
      staleTime: Infinity,
      onError: () =>
        queryclient.setQueryData("userState", {
          isLogin: false,
          userState: { role: "guest" },
        }),
    }
  );
}

export const useUserLoginHandler = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(async (loginData) => await post("users/login", loginData), {
    onSuccess: (res) => {
      const jwtToken = res.data.token;
      localStorage.setItem("userToken", jwtToken);
      queryClient.invalidateQueries("userState");
      navigate("/admin");
    },
    onError: (err) => toast.error(err.message),
  });
};
