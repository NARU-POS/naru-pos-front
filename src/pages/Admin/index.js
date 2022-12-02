import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useEffect } from "react";

export default function Admin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLogin, userState } = queryClient.getQueryData("userState");

  useEffect(() => {
    if (userState.role !== "admin") {
      alert("접근 권한이 없습니다.");
      navigate(`/menus/stake/unused/${userState.role}`);
    }
  }, [navigate, isLogin, userState]);

  return <div>관리자 페이지</div>;
}
