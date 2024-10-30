import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

function Breadcrumbss() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb fontWeight="bold" fontSize="18px" pt={"35px"}>
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} to="/">
          Trang chủ
        </BreadcrumbLink>
      </BreadcrumbItem>
      {pathnames.map((value, index) => {
        // Giải mã URL để hiển thị ký tự đặc biệt chính xác
        const decodedValue = decodeURIComponent(value);

        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        return (
          <BreadcrumbItem key={to} isCurrentPage={isLast}>
            <BreadcrumbLink as={Link} to={to}>
              {decodedValue.charAt(0).toUpperCase() + decodedValue.slice(1) ===
              "ProductDetail"
                ? "Chi tiết sản phẩm"
                : decodedValue.charAt(0).toUpperCase() +
                    decodedValue.slice(1) ===
                  "ProfileUser"
                ? "Hồ sơ cá nhân"
                : decodedValue.charAt(0).toUpperCase() + decodedValue.slice(1)}
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}

export default Breadcrumbss;
