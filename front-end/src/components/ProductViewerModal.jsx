import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  useDisclosure,
  Box,
  Text,
} from "@chakra-ui/react";

const ProductViewerModal = ({ product }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log(product);

  return (
    <>
      {/* Nút để mở modal */}
      <Button
        onClick={onOpen}
        mt="5px"
        px="50px"
        borderRadius="none"
        bg="white"
        color="black"
        fontWeight="300"
        boxShadow="sm" // Thêm bóng đổ nhẹ cho nút
      >
        Xem video sản phẩm
      </Button>

      {/* Modal Chakra UI */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> Video sản phẩm </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
          >
            {product?.video?.length > 0 ? (
              <>
                <Text fontFamily="'Playfair Display', serif" pb={"20px"}>
                  Sản phẩm {product?.productName}{" "}
                </Text>
                <Box as="video" borderRadius={"10px"} controls width="100%">
                  <source
                    src={`http://localhost:2000/images/${product.video}`}
                  />
                </Box>
              </>
            ) : (
              <p>Không có video để hiển thị</p>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={onClose}
              px="50px"
              borderRadius="none"
              bg="white"
              color="black"
              fontWeight="300"
              boxShadow="sm" // Thêm bóng đổ nhẹ cho nút
            >
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductViewerModal;
