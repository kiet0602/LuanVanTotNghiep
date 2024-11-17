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
                KÍCH THƯỚC & HÌNH THỨC CÂY
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Cây có thể lớn hơn hoặc nhỏ hơn một chút so với chậu trồng chúng tùy
            thuộc vào tình trạng sẵn có hoặc thời gian trong năm. Mặc dù chúng
            tôi cố gắng hết sức để vận chuyển những cây giống với những cây
            trong hình nhất có thể, nhưng xin lưu ý rằng tất cả các cây đều khác
            nhau và có màu sắc, hình dạng cũng như sự biến đổi sinh trưởng dựa
            trên môi trường hiện tại, thời gian trong năm và các yếu tố góp phần
            khác. Xin lưu ý rằng chúng tôi vận chuyển cây càng khô càng tốt
            trong những tháng mùa thu và mùa đông để tránh bị thối rễ hoặc đóng
            băng. Chúng sẽ mọc lại sau khi trồng!
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default AccordionDetailProduct;
