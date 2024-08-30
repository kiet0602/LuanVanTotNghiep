import React from "react";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import {
  faSeedling,
  faCheckCircle,
  faHandsHelping,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Header = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const messages = [
    { text: "Bảo hành cây trong 30 ngày", icon: faSeedling },
    { text: "Chất lượng đảm bảo", icon: faCheckCircle },
    { text: "Hỗ trợ chăm sóc cây", icon: faHandsHelping },
    { text: "Giao hàng tận nơi", icon: faTruck },
  ];

  return (
    <Box
      bg={useColorModeValue("black", "white")}
      fontWeight={"bold"}
      color={useColorModeValue("white", "black")}
      display="flex"
      justifyContent="center"
    >
      <Box width="100%" maxWidth="300px">
        <Slider {...settings}>
          {messages.map((message, index) => (
            <Box key={index} display="flex">
              <Flex alignItems="center" justifyContent="center" gap={2}>
                <Text>
                  <FontAwesomeIcon icon={message.icon} size="lg" />
                </Text>
                <Text>{message.text}</Text>
              </Flex>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default Header;
