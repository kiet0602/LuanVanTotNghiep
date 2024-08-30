import React from "react";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

// Tạo các phiên bản motion của các component Chakra
const MotionInputGroup = motion(InputGroup);
const MotionButton = motion(Button);

const InputSearch = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <MotionInputGroup
        maxW="26rem"
        d={{ base: "none", md: "block" }}
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Input
          placeholder="Search..."
          borderColor={useColorModeValue("white", "gray.300")}
          borderRadius="20px"
        />
        <InputRightElement>
          <MotionButton
            borderRadius="0 20px 20px 0"
            onClick={onToggle}
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </MotionButton>
        </InputRightElement>
      </MotionInputGroup>
    </>
  );
};

export default InputSearch;
