import React, { useState } from "react";
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from "@chakra-ui/react";
import InputSearch from "./InputSearch";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Search() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} m={4} borderRadius={40}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </Button>
      <Drawer onClose={onClose} isOpen={isOpen} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Bạn muốn tìm kiếm?</DrawerHeader>
          <DrawerBody>
            {" "}
            <InputSearch />{" "}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Search;
