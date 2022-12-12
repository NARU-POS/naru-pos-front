import { useQuery, useMutation, useQueryClient } from "react-query";
import { get, del } from "../utils/api";
import toast from "react-hot-toast";

export function useGetMenuCategory() {
  return useQuery(
    "menuMainCategory",
    async () => {
      const res = await get("menus/category");
      return res.data;
    },
    {
      onError: (err) => toast.error(err.message),
      staleTime: Infinity,
    }
  );
}

export function useGetMenuList(mainCategory, detailCategory) {
  return useQuery(
    "menuList",
    async () => {
      const res = await get(`menus/${mainCategory}/${detailCategory}`);
      return res.data;
    },
    {
      onError: (err) => toast.error(err.message),
      staleTime: 5000,
      cacheTime: 5000,
    }
  );
}

export function useDeleteMenu(menuId) {
  const queryClient = useQueryClient();
  return useMutation(async (loginData) => await del(`menus/${menuId}`, loginData), {
    onSuccess: (res) => {
      queryClient.invalidateQueries("menuList");
      toast.success(res.data.message);
    },
    onError: (err) => toast.error(err.message),
  });
}
