import React from "react";
import {
  Box,
  Heading,
  Image,
  Text,
  Divider,
  HStack,
  Tag,
  Wrap,
  WrapItem,
  useColorModeValue,
  Container,
  VStack,
} from "@chakra-ui/react";

const ReturnShiping = () => {
  return (
    <Container maxW="4xl" p="12">
      <Heading as="h1" fontWeight={"bold"} textAlign={"center"}>
        Giao hàng & đổi trả
      </Heading>
      <Heading as="h2" fontFamily="'Quicksand', sans-serif" marginTop="20">
        GIAO HÀNG ?
      </Heading>
      <Heading
        fontSize={"25px"}
        fontFamily="'Quicksand', sans-serif"
        marginTop="5"
      >
        Khi nào:
      </Heading>
      <Text as="p" fontSize="lg" mt={5}>
        Chúng tôi giao hàng từ thứ 2 đến thứ 6 hằng tuần.
      </Text>{" "}
      <Heading
        fontSize={"25px"}
        fontFamily="'Quicksand', sans-serif"
        marginTop="5"
      >
        Cách thức:
      </Heading>
      <Text as="p" fontSize="lg" mt={5}>
        Việc vận chuyển sẽ thông qua Dịch vụ Bưu chính Hoa Kỳ trong phạm vi Hoa
        Kỳ và các lãnh thổ lân cận của nó CHỈ. Chúng tôi không vận chuyển quốc
        tế do quy định về nông nghiệp.
      </Text>
      <Text as="p" fontSize="lg" mt={5}>
        Tất cả các cây của chúng tôi đều được gửi không có rễ và không có chậu
        vườn gốc. Điều này được thực hiện nhằm bảo vệ cây và giảm chi phí vận
        chuyển. Khi nhận được cây của bạn, hãy chắc chắn loại bỏ chúng khỏi bao
        bì ngay lập tức, repot bằng đất khô, và cung cấp đủ ánh sáng mặt trời.
        Tưới nước khi cần, đảm bảo chỉ tưới nước lại khi đất đã hoàn toàn khô.
        Cây xương rồng rất cứng cáp và sẽ phục hồi dễ dàng với sự chăm sóc thích
        hợp.
      </Text>
      <Heading
        fontSize={"25px"}
        fontFamily="'Quicksand', sans-serif"
        marginTop="5"
      >
        Xử lý đơn hàng:
      </Heading>
      <Text as="p" fontSize="lg" mt={5}>
        Vui lòng cho phép 1-3 ngày làm việc để đơn hàng của bạn được xử lý vì
        mất một khoảng thời gian hợp lý để tháo dỡ, làm khô, gói và đóng hộp các
        cây. Thời gian xử lý bổ sung có thể cần thiết trong các đợt giảm giá
        hoặc khuyến mãi do khối lượng đơn hàng cao hơn mức trung bình. Chúng tôi
        cảm ơn bạn vì sự kiên nhẫn khi chúng tôi luôn cố gắng làm việc nhanh
        nhất có thể để đóng gói và vận chuyển đơn hàng của bạn!
      </Text>
      <Text as="p" fontSize="lg" mt={5}>
        Chúng tôi đóng gói sản phẩm bằng tay và rất cẩn thận để đảm bảo rằng
        chúng đến được điểm đến cuối cùng một cách an toàn.
      </Text>
      <Heading
        fontSize={"25px"}
        fontFamily="'Quicksand', sans-serif"
        marginTop="5"
      >
        Xử lý đơn hàng:
      </Heading>
      <Text as="p" fontSize="lg" mt={5}>
        Vui lòng cho phép 1-3 ngày làm việc để đơn hàng của bạn được xử lý vì
        mất một khoảng thời gian hợp lý để tháo dỡ, làm khô, gói và đóng hộp các
        cây. Thời gian xử lý bổ sung có thể cần thiết trong các đợt giảm giá
        hoặc khuyến mãi do khối lượng đơn hàng cao hơn mức trung bình. Chúng tôi
        cảm ơn bạn vì sự kiên nhẫn khi chúng tôi luôn cố gắng làm việc nhanh
        nhất có thể để đóng gói và vận chuyển đơn hàng của bạn!
      </Text>
      <Text as="p" fontSize="lg" mt={5}>
        Chúng tôi đóng gói sản phẩm bằng tay và rất cẩn thận để đảm bảo rằng
        chúng đến được điểm đến cuối cùng một cách an toàn.
      </Text>
      <Heading
        fontSize={"25px"}
        fontFamily="'Quicksand', sans-serif"
        marginTop="5"
      >
        Xử lý đơn hàng:
      </Heading>
      <Text as="p" fontSize="lg" mt={5}>
        Vui lòng cho phép 1-3 ngày làm việc để đơn hàng của bạn được xử lý vì
        mất một khoảng thời gian hợp lý để tháo dỡ, làm khô, gói và đóng hộp các
        cây. Thời gian xử lý bổ sung có thể cần thiết trong các đợt giảm giá
        hoặc khuyến mãi do khối lượng đơn hàng cao hơn mức trung bình. Chúng tôi
        cảm ơn bạn vì sự kiên nhẫn khi chúng tôi luôn cố gắng làm việc nhanh
        nhất có thể để đóng gói và vận chuyển đơn hàng của bạn!
      </Text>
      <Text as="p" fontSize="lg" mt={5}>
        Chúng tôi đóng gói sản phẩm bằng tay và rất cẩn thận để đảm bảo rằng
        chúng đến được điểm đến cuối cùng một cách an toàn.
      </Text>
      <Divider marginTop="5" />
      <Heading as="h2">ĐỔI TRẢ</Heading>
      <Text as="p" fontSize="lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
        condimentum quam arcu, eu tempus tortor molestie at. Vestibulum pretium
        condimentum dignissim. Vestibulum ultrices vitae nisi sed imperdiet.
        Mauris quis erat consequat, commodo massa quis, feugiat sapien.
        Suspendisse placerat vulputate posuere. Curabitur neque tortor, mattis
        nec lacus non, placerat congue elit.
      </Text>
      <Text as="p" fontSize="lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
        condimentum quam arcu, eu tempus tortor molestie at. Vestibulum pretium
        condimentum dignissim. Vestibulum ultrices vitae nisi sed imperdiet.
        Mauris quis erat consequat, commodo massa quis, feugiat sapien.
        Suspendisse placerat vulputate posuere. Curabitur neque tortor, mattis
        nec lacus non, placerat congue elit.
      </Text>
      <Text as="p" fontSize="lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
        condimentum quam arcu, eu tempus tortor molestie at. Vestibulum pretium
        condimentum dignissim. Vestibulum ultrices vitae nisi sed imperdiet.
        Mauris quis erat consequat, commodo massa quis, feugiat sapien.
        Suspendisse placerat vulputate posuere. Curabitur neque tortor, mattis
        nec lacus non, placerat congue elit.
      </Text>
    </Container>
  );
};

export default ReturnShiping;
