import React, { useEffect, useState } from "react";
import {
  Container,
  Heading,
  Flex,
  Text,
  Stack,
  HStack,
  Avatar,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { addComment, getCommentsByProduct } from "../service/commnetService.js";
import { VscComment, VscCommentDiscussion } from "react-icons/vsc";
import { TbPencilPlus } from "react-icons/tb";
import userTokenAtom from "../Atom/userAtom.js";
import { useRecoilState, useRecoilValue } from "recoil";

const Review = ({ productId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isReplyOpen,
    onOpen: onReplyOpen,
    onClose: onReplyClose,
  } = useDisclosure();
  const [showComment, setShowComment] = useState(false);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [parentId, setParentId] = useState(null);

  const token = useRecoilValue(userTokenAtom);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getCommentsByProduct(productId);
        setComments(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchComments();
  }, [productId]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleAddComment = async () => {
    try {
      if (!token) {
        alert("Bạn phải đăng nhập để gửi đánh giá.");
        return;
      }
      await addComment(productId, parentId, content, rating);
      onClose();
      onReplyClose();
      setContent("");
      setRating(0);
      setParentId(null);
      // Fetch comments again to update the state after adding a comment
      const data = await getCommentsByProduct(productId);
      setComments(data);
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error.message);
    }
  };

  const handleReply = (commentId) => {
    setParentId(commentId);
    onReplyOpen();
  };

  // Hàm đệ quy để hiển thị bình luận và phản hồi
  const renderComments = (comments) => {
    if (!Array.isArray(comments) || comments.length === 0)
      return (
        <Text fontSize="lg" color="gray.500" textAlign="center">
          Sản phẩm chưa được đánh giá bởi khách hàng.
        </Text>
      ); // Kiểm tra nếu comments hợp lệ

    return comments.map((review) => {
      // Kiểm tra nếu userId hợp lệ
      const username = review.userId?.username || "Người dùng ẩn danh"; // Thay thế nếu không có username
      const avatar =
        `http://localhost:2000/images/${review.userId?.avatar}` || ""; // Thay thế nếu không có avatar

      return (
        <Stack key={review._id} direction="column" maxW="2xl" spacing={3}>
          <HStack spacing={3}>
            <Avatar size="md" name={username} src={avatar} />
            <Flex direction="column">
              <Text fontWeight="bold" fontSize="md">
                {username}
              </Text>
              <Text fontWeight="light" fontSize="xs">
                {new Date(review.createdAt).toLocaleDateString()}
              </Text>
            </Flex>
          </HStack>
          {/* Hiển thị sao chỉ khi parentId là null */}
          {review.parentId === null && (
            <Flex my={3} alignItems="center" justifyContent="start">
              {Array.from(Array(review.rating).keys()).map((id) => (
                <Star key={id} fillColor="#EACA4E" />
              ))}
              {Array.from(Array(5 - review.rating).keys()).map((id) => (
                <Star key={id} fillColor="#e2e8f0" />
              ))}
            </Flex>
          )}
          <Text
            fontSize="0.87rem"
            textAlign="left"
            lineHeight="1.375"
            fontWeight="300"
          >
            {review.content}
          </Text>
          <Text
            color="gray.500"
            fontSize="sm"
            onClick={() => handleReply(review._id)}
            cursor="pointer"
          >
            Trả lời
          </Text>

          {Array.isArray(review.replies) && review.replies.length > 0 && (
            <Stack spacing={4} pl={5}>
              {renderComments(review.replies)}{" "}
              {/* Gọi hàm đệ quy để render các phản hồi */}
            </Stack>
          )}
        </Stack>
      );
    });
  };

  return (
    <Box bg={useColorModeValue("white", "gray.800")}>
      <Container maxW="7xl" p={{ base: 5, md: 10 }}>
        <Flex justifyContent="center">
          <Heading
            as="h3"
            size="lg"
            fontWeight="bold"
            textAlign="left"
            mb={{ base: "4", md: "2" }}
          >
            Đánh giá gần đây ({comments.length} đánh giá)
          </Heading>
        </Flex>
        <Flex
          justifyContent="center"
          alignItems="center"
          direction="column"
          mt={"20px"}
        >
          {!showComment ? (
            <>
              <VscCommentDiscussion fontSize={"30px"} />
              <Text
                _hover={{
                  color: "red",
                }}
                color={useColorModeValue("black", "black")}
                mb={"4"}
                onClick={() => setShowComment(true)}
                cursor="pointer"
                fontWeight="bold"
              >
                Xem nhận xét
              </Text>
            </>
          ) : (
            <>
              <VscCommentDiscussion fontSize={"30px"} />
              <Text
                _hover={{
                  color: "red",
                }}
                color={useColorModeValue("black", "black")}
                mb={"4"}
                onClick={() => setShowComment(false)}
                cursor="pointer"
                fontWeight="bold"
              >
                Ẩn nhận xét
              </Text>
            </>
          )}
        </Flex>
        {showComment && (
          <Stack direction="column" spacing={5} my={4}>
            {renderComments(comments)} {/* Sử dụng hàm renderComments */}
          </Stack>
        )}
        {showComment && (
          <Button
            gap={1}
            onClick={onOpen}
            mt="5px"
            px="50px"
            borderRadius="none"
            bg="yellow.100"
            color="black"
            fontWeight="300"
            boxShadow="sm" // Thêm bóng đổ nhẹ cho nút
          >
            <TbPencilPlus />
            Viết đánh giá
          </Button>
        )}

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Gửi Đánh Giá Của Bạn</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <Box>
                  <Text fontSize="lg" mb={2}>
                    Xếp Hạng:
                  </Text>
                  <HStack spacing={2}>
                    {Array.from(Array(5).keys()).map((id) => (
                      <Star
                        key={id}
                        fillColor={id < rating ? "#EACA4E" : "#e2e8f0"}
                        onClick={() => handleRatingChange(id + 1)}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </HStack>
                </Box>
                <Box>
                  <Text fontSize="lg" mb={2}>
                    Nhận Xét:
                  </Text>
                  <Input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Viết nhận xét của bạn ở đây..."
                    size="md"
                  />
                </Box>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={handleAddComment}
                mt="5px"
                px="50px"
                borderRadius="none"
                bg="yellow.300"
                color="black"
                fontWeight="300"
                boxShadow="sm" // Thêm bóng đổ nhẹ cho nút
              >
                Gửi đánh giá
              </Button>

              <Button
                onClick={onClose}
                ml={3}
                mt="5px"
                px="50px"
                borderRadius="none"
                bg="black"
                color="white"
                fontWeight="300"
                boxShadow="sm" // Thêm bóng đổ nhẹ cho nút
              >
                Đóng
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isReplyOpen} onClose={onReplyClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Gửi Phản Hồi Của Bạn</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <Box>
                  <Text fontSize="lg" mb={2}>
                    Trả lời:
                  </Text>
                  <Input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Viết phản hồi của bạn ở đây..."
                    size="md"
                  />
                </Box>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={handleAddComment}
                mt="5px"
                px="50px"
                borderRadius="none"
                bg="yellow.300"
                color="black"
                fontWeight="300"
                boxShadow="sm" // Thêm bóng đổ nhẹ cho nút
              >
                Gửi phản hồi
              </Button>

              <Button
                onClick={onReplyClose}
                ml={3}
                mt="5px"
                px="50px"
                borderRadius="none"
                bg="black"
                color="white"
                fontWeight="300"
                boxShadow="sm" // Thêm bóng đổ nhẹ cho nút
              >
                Đóng
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>{" "}
    </Box>
  );
};

const Star = ({ fillColor, onClick }) => {
  return (
    <svg
      style={{
        width: "1rem",
        height: "1rem",
        fill: fillColor,
        marginRight: "0.25rem",
      }}
      viewBox="0 0 1000 1000"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path d="M972 380c9 28 2 50-20 67L725 619l87 280c11 39-18 75-54 75-12 0-23-4-33-12L499 790 273 962a58 58 0 0 1-78-12 50 50 0 0 1-8-51l86-278L46 447c-21-17-28-39-19-67 8-24 29-40 52-40h280l87-279c7-23 28-39 52-39 25 0 47 17 54 41l87 277h280c24 0 45 16 53 40z" />
    </svg>
  );
};

export default Review;
