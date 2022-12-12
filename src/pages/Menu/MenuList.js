import { useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Button, Skeleton } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useGetMenuList } from "../../hooks/menuQuery";
import { IMG, MENU_SPICY, MENU_STATUS } from "../../utils/constants";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useDeleteMenu } from "../../hooks/menuQuery";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import MenuItem from "@mui/material/MenuItem";

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
  const queryClient = useQueryClient();
  const mutation = useDeleteMenu();
  const menuCategory = queryClient.getQueryData("menuMainCategory");
  const { isLogin, userState } = queryClient.getQueryData("userState");
  const [open, setOpen] = useState(false);
  const [updateData, setUpdateData] = useState({
    name: "",
    description: "",
    notice: "",
    price: 0,
    detailCategory: "unused",
    category: "",
    spicy: 0,
    status: "unused",
    photo_url: "",
  });

  useEffect(() => {
    refetch();
  }, [currentMainCategory, currentDetailCategory, refetch]);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(updateData);
  }

  function handleChange(e, key) {
    setUpdateData({ ...updateData, [key]: e.target.value });
  }

  const deleteHandler = (menuId) => {
    const isDelete = window.confirm("메뉴를 삭제하시겠습니까?");
    if (!isDelete) return;
    mutation.mutate(menuId);
  };

  const handleClickOpen = (props) => {
    setUpdateData(props);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isFetching)
    return (
      <div style={{ width: "80%", height: "80%", margin: "0 auto" }}>
        <Skeleton width="100%" height={400} />
        <Skeleton variant="text" sx={{ fontSize: "2rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1.3rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1.3rem" }} />
      </div>
    );

  const menuDetailCategory = [
    ...new Set(
      Object.values(menuCategory).reduce((acc, cur) => {
        const newArr = [...acc, ...cur];
        return newArr;
      }, [])
    ),
  ];

  function ShowMenuList(props) {
    const { menuId, name, description, photoUrl, price, spicy, status, notice } = props;
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
            {notice !== "unused" ? <Typography sx={{ mb: 1, color: "text.secondary" }}>{notice}</Typography> : null}
            <Typography align="right">₩ {price.toLocaleString("ko-KR")}</Typography>
            {isLogin && userState.role === "admin" ? (
              <>
                <Button onClick={() => handleClickOpen(props)}>수정</Button>
                <Button onClick={() => deleteHandler(menuId)}>삭제</Button>
              </>
            ) : null}
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
                  menuId={menu._id}
                  name={menu.name}
                  description={menu.description}
                  photoUrl={menu.photo_url}
                  price={menu.price}
                  spicy={menu.spicy}
                  status={menu.status}
                  category={menu.category}
                  detailCategory={menu.detailCategory}
                  notice={menu.notice}
                />
              );
            return null;
          })}
        </Grid>
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField value={updateData.name} margin="dense" id="name" label="이름" type="name" fullWidth variant="standard" />
            <TextField
              value={updateData.description}
              margin="dense"
              id="description"
              label="설명"
              type="description"
              fullWidth
              variant="standard"
            />
            <TextField value={updateData.notice} margin="dense" id="notice" label="안내" type="notice" fullWidth variant="standard" />
            <TextField value={updateData.price} margin="dense" id="price" label="가격" type="price" fullWidth variant="standard" />
            <TextField
              select
              onChange={(e) => handleChange(e, "category")}
              value={updateData.category}
              margin="dense"
              id="category"
              label="카테고리"
              type="category"
              fullWidth
              variant="standard"
            >
              {Object.keys(menuCategory).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              onChange={(e) => handleChange(e, "detailCategory")}
              value={updateData.detailCategory}
              margin="dense"
              id="detailCategory"
              label="세부 카테고리"
              type="detailCategory"
              fullWidth
              variant="standard"
            >
              {menuDetailCategory.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              onChange={(e) => handleChange(e, "status")}
              value={updateData.status}
              margin="dense"
              id="status"
              label="상태"
              type="status"
              fullWidth
              variant="standard"
            >
              {Object.values(MENU_STATUS).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              value={updateData.spicy}
              onChange={(e) => handleChange(e, "spicy")}
              margin="dense"
              id="spicy"
              label="맵기"
              type="spicy"
              fullWidth
              variant="standard"
            >
              {MENU_SPICY.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <DialogActions>
              <Button onClick={handleClose}>취소</Button>
              <Button type="submit" onClick={handleClose}>
                완료
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </main>
  );
}
