import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  faMagnifyingGlass,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Tạo các phiên bản motion của các component Chakra
const MotionInputGroup = motion(InputGroup);
const MotionButton = motion(Button);

const InputSearch = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleSearch(transcript);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const handleSearch = (searchQuery) => {
    if (!searchQuery) {
      alert("Please enter a search term");
      return;
    }

    navigate(`/search?query=${searchQuery || query}`);
    onClose(); // Đóng Drawer sau khi tìm kiếm
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
  };

  return (
    <MotionInputGroup
      maxW="30rem"
      d={{ base: "none", md: "block" }}
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Input
        placeholder="Tìm kiếm sản phẩm..."
        borderColor={useColorModeValue("gray.200", "gray.600")}
        _focus={{
          borderColor: useColorModeValue("blue.400", "blue.600"),
          boxShadow: "0 0 0 2px rgba(66, 153, 225, 0.6)",
        }}
        w={320}
        borderRadius="50px"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        bg={useColorModeValue("white", "gray.700")}
      />
      <InputRightElement width="4.5rem" top="50%" transform="translateY(-50%)">
        <MotionButton
          borderRadius="50%"
          bg={useColorModeValue("blue.500", "blue.300")}
          color="white"
          onClick={() => handleSearch(query)} // Sửa đổi sự kiện onClick
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          p={0}
          h="2.5rem"
          w="2.5rem"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </MotionButton>
        <MotionButton
          ml={3}
          borderRadius="50%"
          bg={useColorModeValue("green.500", "green.300")}
          color="white"
          onClick={handleVoiceSearch} // Kích hoạt ghi âm
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          p={0}
          h="2.5rem"
          w="2.5rem"
        >
          <FontAwesomeIcon icon={faMicrophone} />
        </MotionButton>
      </InputRightElement>
    </MotionInputGroup>
  );
};

export default InputSearch;
