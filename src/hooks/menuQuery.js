import { useQuery } from "react-query";
import { get } from "../utils/api";
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
