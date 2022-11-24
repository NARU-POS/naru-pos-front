import AppBar from "@mui/material/AppBar";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <RestaurantMenuIcon sx={{ mr: 2 }} />
        <Typography color="inherit" noWrap>
          Naru Restaurant & Coffee
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
