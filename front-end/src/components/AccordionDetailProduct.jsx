import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";

const AccordionDetailProduct = ({ description }) => {
  if (!description) {
    return;
  }

  return (
    <>
      <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box
                as="span"
                flex="1"
                textAlign="left"
                fontWeight="bold"
                fontFamily="'Playfair Display', serif"
              >
                MÔ TẢ CHI TIẾT
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>{description}</AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box
                as="span"
                flex="1"
                textAlign="left"
                fontWeight="bold"
                fontFamily="'Playfair Display', serif"
              >
                GIỚI THIỆU KÍCH THƯỚC
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Để giúp khách hàng dễ dàng lựa chọn cây cảnh mini phù hợp, bạn có
            thể phân loại cây theo ba kích thước chính: lớn, vừa và nhỏ. Cây
            cảnh cỡ lớn thường cao từ 30 - 50 cm và có tán cây rộng từ 20 - 40
            cm, phù hợp để trưng bày trong phòng khách, văn phòng lớn hoặc sân
            vườn. Những cây này thường có dáng thế độc đáo và rất thích hợp làm
            quà tặng cao cấp. Cây cỡ vừa có chiều cao từ 15 - 30 cm, tán cây
            rộng từ 10 - 20 cm, là lựa chọn lý tưởng cho không gian làm việc,
            bàn học, kệ sách hoặc góc nhà. Cây cảnh mini cỡ nhỏ, có chiều cao
            dưới 15 cm và tán cây dưới 10 cm, rất thích hợp cho các không gian
            nhỏ như bàn làm việc, quán café hoặc làm đồ trang trí cho các giá kệ
            nhỏ. Mỗi kích thước cây đều có những đặc điểm riêng, dễ dàng chăm
            sóc và di chuyển, giúp khách hàng lựa chọn được cây cảnh phù hợp với
            không gian và mục đích sử dụng của mình.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default AccordionDetailProduct;
