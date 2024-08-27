import React, { Fragment, useRef, useState } from "react";
import {
  Container,
  Box,
  chakra,
  Flex,
  VStack,
  Grid,
  Divider,
  Link,
  useColorModeValue,
  Button,
  Icon,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
// Nhập các biểu tượng từ gói react-icons
import { FaRegComment, FaRegHeart, FaRegEye } from "react-icons/fa";
import ModalDetailOrders from "./ModalDetailOrders";

const articles = [
  {
    title: "Started 2022 by updating portfolio website",
    link: "https://mahmad.me/blog/started-2022-by-updating-portfolio-website-1jde-temp-slug-4553258",
    created_at: "21 Jan 2022",
    meta: {
      reactions: 225,
      comments: 20,
      views: 500,
    },
  },
  {
    title: "Started 2022 by updating portfolio website",
    link: "https://mahmad.me/blog/started-2022-by-updating-portfolio-website-1jde-temp-slug-4553258",
    created_at: "21 Jan 2022",
    meta: {
      reactions: 225,
      comments: 20,
      views: 500,
    },
  },
  {
    title: "Started 2022 by updating portfolio website",
    link: "https://mahmad.me/blog/started-2022-by-updating-portfolio-website-1jde-temp-slug-4553258",
    created_at: "21 Jan 2022",
    meta: {
      reactions: 225,
      comments: 20,
      views: 500,
    },
  },
  {
    title: "Create professional portfolio website with Nextjs and ChakraUI",
    link: "https://mahmad.me/blog/create-professional-portfolio-website-with-nextjs-and-chakraui-4lkn",
    created_at: "20 Jun 2021",
    meta: {
      reactions: 400,
      comments: 25,
      views: 300,
    },
  },
  {
    title: `Find out what's new in my portfolio website`,
    link: "https://mahmad.me/blog/what-s-new-in-my-portfolio-websitea",
    created_at: "31 Sept 2022",
    meta: {
      reactions: 5,
      comments: 15,
      views: 150,
    },
  },
  {
    title: `Find out what's new in my portfolio website`,
    link: "https://mahmad.me/blog/what-s-new-in-my-portfolio-websitea",
    created_at: "31 Sept 2022",
    meta: {
      reactions: 5,
      comments: 15,
      views: 150,
    },
  },
  {
    title: `Find out what's new in my portfolio website`,
    link: "https://mahmad.me/blog/what-s-new-in-my-portfolio-websitea",
    created_at: "31 Sept 2022",
    meta: {
      reactions: 5,
      comments: 15,
      views: 150,
    },
  },
];

const ListOrderUser = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openModal = (article) => {
    setSelectedArticle(article);
    onOpen();
  };
  return (
    <>
      <Box bg={useColorModeValue("white", "black")}>
        <Container maxW="10xl" p={{ base: 5, md: 10 }}>
          <Flex justifyContent="left" mb={3}>
            <chakra.h3 fontSize="2xl" fontWeight="bold" textAlign="center">
              Danh sách đơn hàng
            </chakra.h3>
          </Flex>
          <Box
            border="1px solid"
            borderColor="gray.400"
            overflowY="scroll"
            maxHeight="400px"
          >
            <VStack spacing={0}>
              {articles.map((article, index) => (
                <Fragment key={index}>
                  <Grid
                    templateRows={{ base: "auto auto", md: "auto" }}
                    w="100%"
                    templateColumns={{ base: "unset", md: "4fr 2fr 2fr" }}
                    p={{ base: 2, sm: 4 }}
                    gap={3}
                    alignItems="center"
                    _hover={{ bg: useColorModeValue("gray.200", "gray.700") }}
                  >
                    <Box gridColumnEnd={{ base: "span 2", md: "unset" }}>
                      <chakra.h3
                        as={Link}
                        href={article.link}
                        isExternal
                        fontWeight="bold"
                        fontSize="lg"
                      >
                        {article.title}
                      </chakra.h3>
                      <chakra.p
                        fontWeight="medium"
                        fontSize="sm"
                        color={useColorModeValue("gray.600", "gray.300")}
                      >
                        Published: {article.created_at}
                      </chakra.p>
                    </Box>
                    <HStack
                      spacing={{ base: 0, sm: 3 }}
                      alignItems="center"
                      fontWeight="medium"
                      fontSize={{ base: "xs", sm: "sm" }}
                      color={useColorModeValue("gray.600", "gray.300")}
                    >
                      <ArticleStat
                        icon={FaRegComment}
                        value={article.meta.comments}
                      />
                      <ArticleStat
                        icon={FaRegHeart}
                        value={article.meta.reactions}
                      />
                      <ArticleStat icon={FaRegEye} value={article.meta.views} />
                    </HStack>
                    <Button
                      padding={2}
                      justifySelf="flex-end"
                      onClick={() => openModal(article)}
                    >
                      Xem chi tiết
                    </Button>
                  </Grid>
                  {articles.length - 1 !== index && <Divider m={0} />}
                </Fragment>
              ))}
            </VStack>
          </Box>

          <ModalDetailOrders
            isOpen={isOpen}
            onClose={onClose}
            data={selectedArticle}
          />
        </Container>
      </Box>
    </>
  );
};

const ArticleStat = ({ icon, value }) => {
  return (
    <Flex p={1} alignItems="center">
      <Icon as={icon} w={5} h={5} mr={2} />
      <chakra.span>{value}</chakra.span>
    </Flex>
  );
};

export default ListOrderUser;
