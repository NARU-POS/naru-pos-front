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
  const [tabsIndex, setTabsIndex] = useState(0);
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("stake");

  const handleChange = (_event, categoryIndex) => {
    setTabsIndex(categoryIndex);
    setCurrentCategory(categories[categoryIndex]);
  };

  useEffect(() => {
    async function getMenuList() {
      const res = await get("menus");
      if (res.status !== 200) console.log("잘못된 요청");

      const filterCategory = res.data.map((menu) => menu.category);
      const setMenuCategory = new Set(filterCategory);
      setMenus(res.data);
      setCategories([...setMenuCategory]);
    }

    getMenuList();
  }, []);

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
        <Tabs value={tabsIndex} onChange={handleChange} variant="scrollable" scrollButtons={false} aria-label="naru-menu-category">
          {categories.map((category) => (
            <Tab key={category} label={category} />
          ))}
        </Tabs>
      </AppBar>
      <main>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={3}>
            {menus.map(
              (menu) =>
                menu.category === currentCategory && (
                  <Grid item key={menu._id} xs={12} sm={6} md={4}>
                    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                      <CardMedia component="img" image={menu.photo_url} alt="random" />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {menu.name}
                        </Typography>
                        <Typography sx={{ mb: 1 }}>{menu.description}</Typography>
                        <Typography align="right">₩ {menu.price.toLocaleString("ko-KR")}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )
            )}
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}
