import React, { Fragment, useState } from "react";
import {
  Container,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  VStack,
  Flex,
  Text,
  Icon,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { GoLocation } from "react-icons/go";
import { BsPhone } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import axios from "axios";

const contactOptions = [
  {
    label: "Địa chỉ",
    value: "Đường 3/2, Phường Xuân Khánh, Quận Ninh Kiều, Thành Phố Cần Thơ ",
    icon: GoLocation,
  },
  {
    label: "Số điện thoại",
    value: "+84 3570888331",
    icon: BsPhone,
  },
  {
    label: "Địa chỉ Email",
    value: "kietB2003838@student.ctu.edu.vn",
    icon: HiOutlineMail,
  },
];
import { toast } from "react-toastify";
const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const toast = useToast();

  const createContact = async (e) => {
    e.preventDefault(); // Ngăn chặn form gửi mặc định
    try {
      const response = await axios.post(
        `http://localhost:2000/api/contact/createContact`,
        {
          name,
          email,
          title,
          message,
        }
      );

      // Kiểm tra phản hồi và hiển thị thông báo thành công
      if (response.status === 201) {
        toast.success("Đã gửi liên hệ thành công.");
        // Xóa các trường sau khi gửi thành công
        setName("");
        setEmail("");
        setTitle("");
        setMessage("");
      }
    } catch (error) {
      // Thông báo lỗi nếu có
      toast.error("Gửi liên hệ thất bại, vui lòng thử lại");
      console.log(error);
    }
  };

  return (
    <Container maxW="7xl" py={10} px={{ base: 5, md: 8 }}>
      <Stack spacing={10}>
        <Flex align="center" justifyContent="center" direction="column">
          <Heading fontSize="4xl" mb={2}>
            Liên hệ với chúng tôi
          </Heading>
          <Text fontSize="md" textAlign="center">
            Chúng tôi luôn chào đón bạn đến với cửa hàng Plant Paradise, chúng
            tôi sẽ giải đáp thắc mắc của bạn khi tin nhắn được gửi đến chúng
            tôi.
          </Text>
        </Flex>
        <Stack
          spacing={{ base: 6, md: 0 }}
          direction={{ base: "column", md: "row" }}
          justifyContent="space-between"
        >
          {contactOptions.map((option, index) => (
            <Fragment key={index}>
              <Stack
                spacing={3}
                direction="column"
                justifyContent="center"
                alignItems="center"
                px={3}
              >
                <Icon as={option.icon} w={10} h={10} color="green.400" />
                <Text fontSize="lg" fontWeight="semibold">
                  {option.label}
                </Text>
                <Text fontSize="md" textAlign="center">
                  {option.value}
                </Text>
              </Stack>
              {contactOptions.length - 1 !== index && (
                <Flex display={{ base: "none", md: "flex" }}>
                  <Divider orientation="vertical" />
                </Flex>
              )}
            </Fragment>
          ))}
        </Stack>
        <VStack
          as="form"
          spacing={8}
          w="100%"
          bg={useColorModeValue("white", "gray.700")}
          rounded="lg"
          boxShadow="lg"
          p={{ base: 5, sm: 10 }}
          onSubmit={createContact}
        >
          <VStack spacing={4} w="100%">
            <Stack
              w="100%"
              spacing={3}
              direction={{ base: "column", md: "row" }}
            >
              <FormControl id="name" isRequired>
                <FormLabel>Tên của bạn</FormLabel>
                <Input
                  type="text"
                  placeholder="Ahmad"
                  rounded="md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Địa chỉ email của bạn</FormLabel>
                <Input
                  type="email"
                  placeholder="test@test.com"
                  rounded="md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
            </Stack>
            <FormControl id="subject" isRequired>
              <FormLabel>Tiêu đề</FormLabel>
              <Input
                type="text"
                placeholder="Are you available for freelance work?"
                rounded="md"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl id="message" isRequired>
              <FormLabel>Nội dung tin nhắn</FormLabel>
              <Textarea
                size="lg"
                placeholder="Nhập tin nhắn của bạn"
                rounded="md"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </FormControl>
          </VStack>
          <VStack w="100%">
            <Button
              type="submit"
              bg="green.300"
              color="white"
              _hover={{
                bg: "green.500",
              }}
              rounded="md"
              w={{ base: "100%", md: "max-content" }}
            >
              Gửi tin nhắn
            </Button>
          </VStack>
        </VStack>
      </Stack>
    </Container>
  );
};

export default ContactUs;
