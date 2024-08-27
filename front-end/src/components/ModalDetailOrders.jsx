import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";

const ModalDetailOrders = ({ isOpen, onClose, data }) => {
  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{data?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{data?.created_at}</Text>
            <Text mt={4}>{data?.link}</Text>
            <Text mt={4}>Reactions: {data?.meta.reactions}</Text>
            <Text mt={2}>Comments: {data?.meta.comments}</Text>
            <Text mt={2}>Views: {data?.meta.views}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Đóng</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalDetailOrders;
