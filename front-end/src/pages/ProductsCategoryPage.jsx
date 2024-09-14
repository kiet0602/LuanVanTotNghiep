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

// component
import CardNew from "../components/CardNew";
//data
import imgSenda from "../assets/data/image/Senda/sen-da-chuoi-ngoc-dung.jpg";
// services

const ProductsCategory = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const { categoryId } = useParams();

  useEffect(() => {
    if (!categoryId) return;

    const fetchProductsCategoryID = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2000/api/product/getProductByCategoryId/${categoryId}`
        );
        setProducts(response.data);
        console.log(response.data);
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
    const fetchData = async () => {
      await Promise.all([fetchProductsCategoryID(), fetchCategory()]);
      setLoading(false); // Set loading to false after fetching
    };
    fetchData();
  }, [categoryId]);

  return (
    <Layout>
      {category && (
        <Tiltel
          key={category?._id}
          title={category?.categoryName}
          imageCategory={category?.imageCategory}
          descriptionCategory={category?.descriptionCategory}
          iconColor="#FF5733"
        />
      )}
      <Box bg={useColorModeValue("white", "black")}>
        <Container maxW="6xl" p={{ base: 5, md: 10 }}>
          {loading ? (
            <Box textAlign="center" mt={10}>
              <Spinner size="xl" />
            </Box>
          ) : products.length === 0 ? (
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
