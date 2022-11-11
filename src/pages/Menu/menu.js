import { useState, useEffect } from "react";
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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { get } from "../../utils/api";

const theme = createTheme();

export default function Menu() {
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
      if (!menuDetailCategoryList.hasOwnProperty(menuMainCategory[categoryIndex])) return detail;
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

  useEffect(() => {
    async function getMenuCategory() {
      const res = await get("menus/category");
      if (res.status !== 200) return console.log("잘못된 요청");
      const mainCategoryList = Object.keys(res.data);

      setMenuMainCategory(mainCategoryList);
      setCurrentMenuCategory(mainCategoryList[0]);
      setMenuDetailCategoryList(res.data);
    }

    getMenuCategory();
  }, []);

  useEffect(() => {
    async function getMenuList() {
      if (!currentMenuCategory) return;
      const res = await get(`menus/${currentMenuCategory}`);
      if (res.status !== 200) return console.log("잘못된 요청");
      setMenuList(res.data);
    }

    getMenuList();
  }, [currentMenuCategory]);

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
        {menuDetailCategory[0] !== "unused" && menuDetailCategory.length !== 0 && (
          <Tabs
            value={menuDetailTabsIndex}
            onChange={handleDetailCategoryChange}
            variant="scrollable"
            scrollButtons={false}
            aria-label="naru-menu-detail-category"
          >
            {menuDetailCategory.map((category) => {
              return <Tab key={category} label={category} />;
            })}
          </Tabs>
        )}
      </AppBar>
      <main>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={3}>
            {menuList.map((menu) => {
              if (menu.category !== currentMenuCategory) return <div key={menu._id}></div>;
              if (menu.detailCategory === currentMenuDetailCategory || menu.detailCategory === "unused")
                return (
                  <Grid item key={menu._id} xs={12} sm={6} md={4}>
                    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                      <CardMedia component="img" image={menu.photo_url} alt={menu.name} />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {menu.name}
                        </Typography>
                        <Typography sx={{ mb: 1, color: "text.secondary" }}>{menu.description}</Typography>
                        <Typography align="right">₩ {menu.price.toLocaleString("ko-KR")}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              return <div key={menu._id}></div>;
            })}
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}
