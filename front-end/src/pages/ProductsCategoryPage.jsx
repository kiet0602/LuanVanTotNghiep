import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Tiltel from "../components/Tiltel";
import {
  Box,
  Container,
  useColorModeValue,
  Spinner,
  Image,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CardNew from "../components/CardNew";
import imgSenda from "../assets/data/image/Senda/sen-da-chuoi-ngoc-dung.jpg";

const ProductsCategory = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);

  const { categoryId } = useParams();

  useEffect(() => {
    if (!categoryId) return;

    const fetchProductsCategoryID = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2000/api/product/getProductByCategoryId/${categoryId}`
        );
        setProducts(response.data);
      } catch (error) {
        toast.error("Không thể lấy sản phẩm theo thể loại.");
      }
    };

    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2000/api/category/getCategoryById/${categoryId}`
        );
        setCategory(response.data);
      } catch (error) {
        toast.error("Không thể lấy tên thể loại này.");
      }
    };
    fetchProductsCategoryID();
    fetchCategory();
  }, [categoryId]);

  return (
    <Layout>
      <Box bg={useColorModeValue("white", "black")}>
        <Container maxW="6xl" p={{ base: 5, md: 10 }}>
          {category && (
            <Tiltel
              key={category?._id}
              title={category?.categoryName}
              imageCategory={category?.imageCategory}
              iconColor="#FF5733"
            />
          )}

          {products.length === 0 ? (
            <Box textAlign="center" mt={10}>
              <Image
                borderRadius={"20px"}
                src={imgSenda}
                alt="No Products"
                h={100}
                w={100}
                mx="auto"
              />
              <Text fontWeight={"bold"} mt={4}>
                XIN LỖI CHÚNG TÔI CHƯA CÓ SẢN PHẨM NÀY
              </Text>
            </Box>
          ) : (
            <CardNew products={products} />
          )}
        </Container>
      </Box>
    </Layout>
  );
};

export default ProductsCategory;
