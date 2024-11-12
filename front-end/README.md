# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

{
headers: {
Authorization: `Bearer ${token}`, // Gửi token JWT để xác thực
},
}

b1: - npm create vite@latest
b2: cd (file vừa tạo) - npm i
b3: - npm run dev
b4: xóa index.css and app.css
b5: - npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion
b6:

    <!--     <Button
                mt="5px"
                px="50px"
                borderRadius="none"
                bg="white"
                color="black"
                fontWeight="300"
                boxShadow="sm" // Thêm bóng đổ nhẹ cho nút
              >
                Mua Ngay
              </Button> -->

              lineHeight="35px"

                 letterSpacing="3px" // Tạo khoảng cách giữa các chữ

    bg={useColorModeValue("orange.100", "orange.950")}
    bg={useColorModeValue("white", "black")}

    fontFamily="'Playfair Display', serif"
    fontFamily="'Allura', cursive"
    fontFamily= "'Quicksand', sans-serif"

    fontWeight="bold"

    fontSize="20px"

    borderRadius="full"

    cursor={"pointer"}

    backgroundColor="green.200"

    bg={useColorModeValue("white", "gray.800")}

    color={useColorModeValue("green.800", "green.200")}
    color="black.200"

    as="i"

    textTransform="uppercase"

    _hover={{
          color: hoverColor,
        }}

        1. "lightHorizontalLines"

Vẽ đường kẻ ngang nhẹ giữa các hàng.
Thích hợp cho bảng không quá phức tạp. 2. "noBorders"
Không có đường kẻ nào, không có đường biên cho bảng.
Thích hợp cho các bảng đơn giản không cần phân cách rõ ràng giữa các ô. 3. "headerLineOnly"
Vẽ đường kẻ chỉ ở phần tiêu đề của bảng, không có đường kẻ cho các hàng bên dưới.
Tốt cho bảng có tiêu đề rõ ràng. 4. "lightVerticalLines"
Vẽ đường kẻ dọc nhẹ giữa các cột.
Thích hợp cho bảng có nhiều cột. 5. "noPadding"
Không có độ đệm (padding) cho các ô trong bảng, giúp các ô khít lại với nhau. 6. "compact"
Tương tự như noPadding, nhưng chỉ áp dụng cho các hàng và cột mà không có độ đệm. 7. "evenlyDistributed"
Cố định chiều rộng của các cột, giúp phân bố đồng đều. 8. Tùy chỉnh Layout
Bạn có thể tự định nghĩa layout của riêng mình bằng cách sử dụng các thuộc tính như hLineWidth, vLineWidth, hLineColor, vLineColor, v.v.
