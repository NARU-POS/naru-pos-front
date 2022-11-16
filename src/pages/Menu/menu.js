import React, { useState, useEffect } from "react";
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
import { Skeleton } from "@mui/material";
import { img } from "../../utils/constans";

const theme = createTheme({
  typography: {
    fontFamily: "Noto Sans KR",
  },
});

export default function Menu() {
  const [showAlert, setShowAlert] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const [menuMainTabsIndex, setMenuMainTabsIndex] = useState(0);
  const [menuDetailTabsIndex, setMenuDetailTabsIndex] = useState(0);
  const [menuDetailCategoryList, setMenuDetailCategoryList] = useState({});
  const [menuMainCategory, setMenuMainCategory] = useState([]);
  const [menuDetailCategory, setMenuDetailCategory] = useState([]);
  const [currentMenuCategory, setCurrentMenuCategory] = useState("unused");
  const [currentMenuDetailCategory, setCurrentMenuDetailCategory] = useState("unused");
  const [loading, setLoading] = useState(false);

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
      } catch (err) {
        if (err.response.status !== 400) setShowAlert(true);
      }
    }

    getMenuCategory();
  }, []);

  useEffect(() => {
    async function getMenuList() {
      if (!currentMenuCategory) return;
      setLoading(true);
      const img = new Image();
      try {
        const res = await get(`menus/${currentMenuCategory}/${currentMenuDetailCategory}`);
        setMenuList(res.data);
        img.src = res.data[0].photo_url;
        img.onload = () => {
          setLoading(false);
        };
      } catch (err) {
        if (err.response.status !== 400) setShowAlert(true);
      }
    }

    getMenuList();
  }, [currentMenuCategory, currentMenuDetailCategory]);

  const MenuTitle = ({ name, spicyLevel }) => {
    return (
      <>
        {name}
        {spicyLevel}
      </>
    );
  };

  const setSpicyLevel = (spicy) => {
    if (spicy === 0) return null;
    return new Array(spicy)
      .fill()
      .map((level, index) => (
        <img key={`spicy${index}`} src={img.spicy} style={{ width: "1.5rem", height: "1.1rem" }} alt={`spicy${level}`} />
      ));
  };

  const ShowMenuList = ({ menuId, name, description, photoUrl, price, spicy }) => {
    const spicyLevel = setSpicyLevel(spicy);

    return (
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <CardMedia>
            {loading ? <Skeleton width="100%" height={400} /> : <img width="100%" height="100%" src={photoUrl} alt={name} />}
          </CardMedia>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h2">
              {loading ? <Skeleton /> : <MenuTitle key={menuId} name={name} spicyLevel={spicyLevel} />}
            </Typography>
            <Typography sx={{ mb: 1, color: "text.secondary" }}>{loading ? <Skeleton /> : description}</Typography>
            <Typography align="right">₩ {loading ? <Skeleton /> : price.toLocaleString("ko-KR")}</Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

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
            {menuList.map((menu, index) => {
              if (
                menu.category === currentMenuCategory &&
                (menu.detailCategory === currentMenuDetailCategory || menu.detailCategory === "unused")
              )
                return (
                  <ShowMenuList
                    key={index}
                    menuId={menu._id}
                    name={menu.name}
                    description={menu.description}
                    photoUrl={menu.photo_url}
                    price={menu.price}
                    spicy={menu.spicy}
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
