import { useGetMenuCategory } from "../../hooks/menuQuery";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppBar from "@mui/material/AppBar";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";

export default function Category({ currentMainCategory, currentDetailCategory }) {
  const navigate = useNavigate();
  const { data: menuCategory, isLoading } = useGetMenuCategory();

  if (isLoading) return <Skeleton variant="rounded" width="100%" height={200} />;

  const menuMainCategoryList = Object.keys(menuCategory);
  const menuDetailCategoryList = menuCategory;
  const tabsIndex = {
    mainTabs: menuMainCategoryList.indexOf(currentMainCategory),
    detailTabs: menuDetailCategoryList[currentMainCategory].indexOf(currentDetailCategory),
  };

  const handleMainCategoryChange = (_event, categoryIndex) => {
    const changeMainCategory = menuMainCategoryList[categoryIndex];
    const changeDetailCategory = menuDetailCategoryList[changeMainCategory][0];
    navigate(`/menus/${changeMainCategory}/${changeDetailCategory}`);
  };

  const handleDetailCategoryChange = (_event, categoryIndex) => {
    const changeDetailCategory = menuDetailCategoryList[currentMainCategory][categoryIndex];
    navigate(`/menus/${currentMainCategory}/${changeDetailCategory}`);
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "white" }}>
      <Tabs
        value={tabsIndex.mainTabs}
        onChange={handleMainCategoryChange}
        variant="scrollable"
        scrollButtons={false}
        aria-label="naru-menu-category"
      >
        {menuMainCategoryList.map((category) => {
          return <Tab key={category} label={category} />;
        })}
      </Tabs>
      {currentDetailCategory !== "unused" && menuCategory[currentMainCategory].length !== 0 ? (
        <Tabs
          value={tabsIndex.detailTabs}
          onChange={handleDetailCategoryChange}
          variant="scrollable"
          scrollButtons={false}
          aria-label="naru-menu-detail-category"
        >
          {menuCategory[currentMainCategory].map((category) => (
            <Tab key={category} label={category} />
          ))}
        </Tabs>
      ) : null}
    </AppBar>
  );
}
