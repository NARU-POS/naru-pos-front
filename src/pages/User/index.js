import SignUp from "./Register";
import { useParams } from "react-router-dom";
import SignIn from "./Login";
import { useQueryClient } from "react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function User() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLogin, userState } = queryClient.getQueryData("userState");

  useEffect(() => {
    if (isLogin && userState.role === "admin") navigate("/admin");
    if (isLogin) navigate(`/menus/stake/unused/${userState.role}`);
  }, [navigate, isLogin, userState]);
  const type = params.type === "register" ? <SignUp /> : <SignIn />;

  return type;
}
