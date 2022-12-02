import { useParams } from "react-router-dom";
import Category from "./Category";
import MenuList from "./MenuList";

export default function Menu() {
  const params = useParams();
  const tableNumber = params.tableNumber;

  const props = {
    currentMainCategory: params.mainCategory,
    currentDetailCategory: params.detailCategory,
    tableNumber,
  };

  return (
    <>
      <Category {...props} />
      <MenuList {...props} />
    </>
  );
}
