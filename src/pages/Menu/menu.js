import { useState, useEffect, memo } from "react";
import AppBar from "@mui/material/AppBar";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { get } from "../../utils/api";

const theme = createTheme();

export default function Menu() {
  const [showAlert, setShowAlert] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const [menuMainTabsIndex, setMenuMainTabsIndex] = useState(0);
  const [menuDetailTabsIndex, setMenuDetailTabsIndex] = useState(0);
  const [menuDetailCategoryList, setMenuDetailCategoryList] = useState({});
  const [menuMainCategory, setMenuMainCategory] = useState([]);
  const [menuDetailCategory, setMenuDetailCategory] = useState([]);
  const [currentMenuCategory, setCurrentMenuCategory] = useState("");
  const [currentMenuDetailCategory, setCurrentMenuDetailCategory] = useState("");

  const handleMainCategoryChange = (_event, categoryIndex) => {
    setMenuMainTabsIndex(categoryIndex);
    setCurrentMenuCategory(menuMainCategory[categoryIndex]);
    setMenuDetailCategory([]);
    setMenuDetailTabsIndex(0);

    Object.keys(menuDetailCategoryList).map((detail) => {
      if (menuMainCategory[categoryIndex] !== detail) return detail;
      setMenuDetailCategory(menuDetailCategoryList[detail]);
      setCurrentMenuDetailCategory(menuDetailCategoryList[detail][0]);
      return detail;
    });
    window.scrollTo(0, 0);
  };

  const handleDetailCategoryChange = (_event, categoryIndex) => {
    setMenuDetailTabsIndex(categoryIndex);
    setCurrentMenuDetailCategory(menuDetailCategory[categoryIndex]);
    window.scrollTo(0, 0);
  };

  const handleAlertClose = (_event, reason) => {
    if (reason === "clickaway") return;
    setShowAlert(false);
  };

  useEffect(() => {
    async function getMenuCategory() {
      try {
        const res = await get("menus/category");
        const mainCategoryList = Object.keys(res.data);

        setMenuMainCategory(mainCategoryList);
        setCurrentMenuCategory(mainCategoryList[0]);
        setMenuDetailCategoryList(res.data);
      } catch {
        setShowAlert(true);
      }
    }

    getMenuCategory();
  }, []);

  useEffect(() => {
    async function getMenuList() {
      if (!currentMenuCategory) return;
      try {
        const res = await get(`menus/${currentMenuCategory}`);
        setMenuList(res.data);
      } catch {
        setShowAlert(true);
      }
    }

    getMenuList();
  }, [currentMenuCategory]);

  const ShowMenuList = memo(({ menuId, name, description, photoUrl, price }) => {
    return (
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <CardMedia component="img" image={photoUrl} alt={name} />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h2">
              {name}
            </Typography>
            <Typography sx={{ mb: 1, color: "text.secondary" }}>{description}</Typography>
            <Typography align="right">₩ {price.toLocaleString("ko-KR")}</Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <RestaurantMenuIcon sx={{ mr: 2 }} />
          <Typography color="inherit" noWrap>
            Naru Restaurant & Coffee
          </Typography>
        </Toolbar>
      </AppBar>
      <AppBar position="sticky" sx={{ bgcolor: "white" }}>
        <Tabs
          value={menuMainTabsIndex}
          onChange={handleMainCategoryChange}
          variant="scrollable"
          scrollButtons={false}
          aria-label="naru-menu-category"
        >
          {menuMainCategory.map((category) => {
            return <Tab key={category} label={category} />;
          })}
        </Tabs>
        {menuDetailCategory[0] !== "unused" && menuDetailCategory.length !== 0 ? (
          <Tabs
            value={menuDetailTabsIndex}
            onChange={handleDetailCategoryChange}
            variant="scrollable"
            scrollButtons={false}
            aria-label="naru-menu-detail-category"
          >
            {menuDetailCategory.map((category) => (
              <Tab key={category} label={category} />
            ))}
          </Tabs>
        ) : null}
      </AppBar>
      <main>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={3}>
            {menuList.map((menu) => {
              if (menu.category !== currentMenuCategory) return null;
              if (menu.detailCategory === currentMenuDetailCategory || menu.detailCategory === "unused")
                return (
                  <ShowMenuList
                    key={menu._id}
                    name={menu.name}
                    description={menu.description}
                    photoUrl={menu.photo_url}
                    price={menu.price}
                  />
                );
              return null;
            })}
          </Grid>
        </Container>
      </main>
      <Snackbar open={showAlert} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert severity="error">카테고리를 불러오는데 실패했습니다.</Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
