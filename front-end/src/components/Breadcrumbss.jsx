import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

function Breadcrumbss() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb fontWeight="medium" fontSize="sm" marginTop={"35px"}>
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} to="/">
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        return (
          <BreadcrumbItem key={to} isCurrentPage={isLast}>
            <BreadcrumbLink as={Link} to={to}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}

export default Breadcrumbss;
