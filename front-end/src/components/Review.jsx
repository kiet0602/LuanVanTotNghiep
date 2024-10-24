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
} from "@chakra-ui/react";
import { addComment, getCommentsByProduct } from "../service/commnetService.js";

const Review = ({ productId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [parentId, setParentId] = useState(null);

  const userData = localStorage.getItem("userCurrent");
  const userCurrent = userData ? JSON.parse(userData) : null;
  const token = userCurrent?.token;

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
    onOpen();
  };

  // Hàm đệ quy để hiển thị bình luận và phản hồi
  const renderComments = (comments) => {
    if (!Array.isArray(comments) || comments.length === 0) return null; // Kiểm tra nếu comments hợp lệ

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
    <Container maxW="7xl" p={{ base: 5, md: 10 }}>
      <Flex justifyContent="center">
        <Heading
          as="h3"
          size="lg"
          fontWeight="bold"
          textAlign="left"
          mb={{ base: "4", md: "2" }}
        >
          Đánh giá gần đây
        </Heading>
      </Flex>
      <Stack direction="column" spacing={5} my={4}>
        {renderComments(comments)} {/* Sử dụng hàm renderComments */}
      </Stack>
      <Button onClick={onOpen} colorScheme="blue">
        Đánh giá
      </Button>
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
            <Button colorScheme="blue" onClick={handleAddComment}>
              Gửi
            </Button>
            <Button variant="outline" ml={3} onClick={onClose}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
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
