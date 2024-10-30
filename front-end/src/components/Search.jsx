import React from "react";
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

import { CiSearch } from "react-icons/ci";

function Search() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} borderRadius={40}>
        <CiSearch size={"30px"} />
      </Button>
      <Drawer onClose={onClose} isOpen={isOpen} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Bạn muốn tìm kiếm?</DrawerHeader>
          <DrawerBody>
            <InputSearch onClose={onClose} /> {/* Truyền onClose */}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Search;
