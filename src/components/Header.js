import AppBar from "@mui/material/AppBar";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import Toolbar from "@mui/material/Toolbar";
import { Button } from "@mui/material";
import { useQueryClient } from "react-query";
import Typography from "@mui/material/Typography";

export default function Header() {
  const queryClient = useQueryClient();
  const { isLogin } = queryClient.getQueryData("userState");

  return (
    <AppBar position="static">
      <Toolbar>
        <RestaurantMenuIcon sx={{ mr: 2 }} />
        <Typography color="inherit" noWrap>
          Naru Restaurant & Coffee
        </Typography>
        {isLogin ? (
          <Button
            onClick={(e) => {
              localStorage.removeItem("userToken");
              queryClient.invalidateQueries("userState");
            }}
          >
            로그아웃
          </Button>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}
