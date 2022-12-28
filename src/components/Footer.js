import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {"나루 대표 정희 경남 창녕군 남지읍 낙동로 277 전화 : 0507-1351-5373"}
      <br />
      {"E-mail : handwoong@gmail.com 사업자등록번호 : 684-43-00498"}
      <br />
      {"Copyright © 나루 All rights Reserved."}
    </Typography>
  );
}

export default function StickyFooter() {
  return (
    <>
      <CssBaseline />
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: (theme) => (theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[800]),
        }}
      >
        <Container maxWidth="sm">
          <Copyright />
        </Container>
      </Box>
    </>
  );
}
