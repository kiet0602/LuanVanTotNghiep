# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

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
