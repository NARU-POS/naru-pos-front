import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Skeleton } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useGetMenuList } from "../../hooks/menuQuery";
import { IMG } from "../../utils/constans";
import { useEffect } from "react";

const setSpicyLevel = (spicy) => {
  if (spicy === 0) return null;
  return new Array(spicy)
    .fill()
    .map((level, index) => (
      <img key={`spicy${index}`} src={IMG.SPICY} style={{ width: "1.5rem", height: "1.1rem" }} alt={`spicy${level}`} />
    ));
};

const setMenuStatus = (status) => {
  if (status === "unused") return null;
  return <img key={`status${status}`} src={IMG[status]} style={{ width: "2rem", height: "1.1rem" }} alt={`status${status}`} />;
};

export default function MenuList({ currentMainCategory, currentDetailCategory }) {
  const { data: menuList, isFetching, refetch } = useGetMenuList(currentMainCategory, currentDetailCategory);

  useEffect(() => {
    refetch();
  }, [currentMainCategory, currentDetailCategory, refetch]);

  if (isFetching)
    return (
      <div style={{ width: "80%", height: "80%", margin: "0 auto" }}>
        <Skeleton width="100%" height={400} />
        <Skeleton variant="text" sx={{ fontSize: "2rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1.3rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1.3rem" }} />
      </div>
    );

  function ShowMenuList({ name, description, photoUrl, price, spicy, status }) {
    const spicyLevel = setSpicyLevel(spicy);
    const menuStatus = setMenuStatus(status);

    return (
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {description.length !== 0 ? (
            <CardMedia>
              <img width="100%" height="100%" src={photoUrl} alt={name} />
            </CardMedia>
          ) : null}
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h2">
              <>
                {menuStatus} {name}
                {spicyLevel}
              </>
            </Typography>
            <Typography sx={{ mb: 1, color: "text.secondary" }}>{description}</Typography>
            <Typography align="right">₩ {price.toLocaleString("ko-KR")}</Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  }

  return (
    <main>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={3}>
          {menuList.map((menu) => {
            if (
              menu.category === currentMainCategory &&
              (menu.detailCategory === currentDetailCategory || menu.detailCategory === "unused")
            )
              return (
                <ShowMenuList
                  key={menu._id}
                  name={menu.name}
                  description={menu.description}
                  photoUrl={menu.photo_url}
                  price={menu.price}
                  spicy={menu.spicy}
                  status={menu.status}
                />
              );
            return null;
          })}
        </Grid>
      </Container>
    </main>
  );
}
