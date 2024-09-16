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
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Select,
  Button,
  HStack,
  Input,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CardNew from "../components/CardNew";
import imgSenda from "../assets/data/image/Senda/sen-da-chuoi-ngoc-dung.jpg";

const ProductsCategory = () => {
  const [products, setProducts] = useState([]); // Dữ liệu sản phẩm hiện tại
  const [originalProducts, setOriginalProducts] = useState([]); // Danh sách sản phẩm gốc
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState(""); // Tìm kiếm theo tên sản phẩm
  const [priceRange, setPriceRange] = useState([0, 1000000]); // Khoảng giá
  const [sortBy, setSortBy] = useState("orderCount"); // Sắp xếp theo
  const [error, setError] = useState(null); // Lỗi
  const { categoryId } = useParams();

  useEffect(() => {
    if (!categoryId) return;

    const fetchProductsCategoryID = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2000/api/product/getProductByCategoryId/${categoryId}`
        );
        console.log("Products by Category ID:", response.data);
        setProducts(response.data); // Lưu dữ liệu sản phẩm chưa lọc
        setOriginalProducts(response.data); // Cập nhật danh sách sản phẩm gốc
      } catch (error) {
        toast.error("Không thể lấy sản phẩm theo thể loại.");
        console.error("Error fetching products by category:", error);
      }
    };

    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2000/api/category/getCategoryById/${categoryId}`
        );
        console.log("Category Data:", response.data);
        setCategory(response.data);
      } catch (error) {
        toast.error("Không thể lấy tên thể loại này.");
        console.error("Error fetching category:", error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchProductsCategoryID(), fetchCategory()]);
      setLoading(false);
    };

    fetchData();
  }, [categoryId]);

  // Hàm xử lý lọc sản phẩm
  const handleFilter = () => {
    console.log("Handle Filter called");
    console.log("Query:", query);
    console.log("Price Range:", priceRange);
    console.log("Sort By:", sortBy);
    setLoading(true);
    setError(null);

    try {
      // Lọc sản phẩm theo từ khóa tìm kiếm
      const filteredByQuery = originalProducts.filter((product) =>
        product.productName.toLowerCase().includes(query.toLowerCase())
      );

      // Lọc sản phẩm theo khoảng giá
      const filteredByPrice = filteredByQuery.filter(
        (product) =>
          product.finalPrice >= priceRange[0] &&
          product.finalPrice <= priceRange[1]
      );

      // Sắp xếp sản phẩm
      const sortedProducts = filteredByPrice.sort((a, b) => {
        switch (sortBy) {
          case "priceAsc":
            return a.finalPrice - b.finalPrice;
          case "priceDesc":
            return b.finalPrice - a.finalPrice;
          case "rating":
            return b.rating - a.rating; // Giả sử có thuộc tính rating
          case "nameAsc":
            return a.productName.localeCompare(b.productName);
          case "nameDesc":
            return b.productName.localeCompare(a.productName);
          case "orderCount":
            return b.orderCount - a.orderCount;
          default:
            return 0;
        }
      });

      console.log("Filtered Products:", sortedProducts);
      setProducts(sortedProducts); // Cập nhật danh sách sản phẩm đã lọc và sắp xếp
    } catch (err) {
      console.error("Error during filtering:", err);
      setError("Không thể lọc sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query === "") {
      setProducts(originalProducts);
    }
  }, []);

  return (
    <Layout>
      {category && (
        <Tiltel
          key={category._id}
          title={category.categoryName}
          imageCategory={category.imageCategory}
          descriptionCategory={category.descriptionCategory}
          iconColor="#FF5733"
        />
      )}
      <Box bg={useColorModeValue("white", "black")}>
        <Container maxW="6xl" p={{ base: 5, md: 10 }}>
          {/* Bộ lọc */}
          <Box mb={6}>
            <Flex direction="column" mb={4}>
              <Flex mb={4} align="center" gap={4}>
                <Input
                  placeholder="Tìm kiếm theo tên sản phẩm"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  flex="1"
                />
                <Select
                  value={sortBy}
                  onChange={(e) => {
                    console.log("Sort By Changed:", e.target.value);
                    setSortBy(e.target.value);
                  }}
                  width="auto"
                >
                  <option value="orderCount">Số lượng đặt hàng</option>
                  <option value="priceAsc">Giá thấp đến cao</option>
                  <option value="priceDesc">Giá cao đến thấp</option>
                  <option value="rating">Lượt đánh giá</option>
                  <option value="nameAsc">Tên A đến Z</option>
                  <option value="nameDesc">Tên Z đến A</option>
                </Select>
              </Flex>
              <Box mb={4}>
                <Flex align="center" gap={4}>
                  <Text mr={4}>Giá:</Text>
                  <RangeSlider
                    aria-label={["min", "max"]}
                    min={0}
                    max={1000000}
                    step={1000}
                    defaultValue={priceRange}
                    onChangeEnd={(values) => {
                      console.log("Price Range Changed:", values);
                      setPriceRange(values);
                    }}
                    width="870px"
                  >
                    <RangeSliderTrack>
                      <RangeSliderFilledTrack />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} />
                    <RangeSliderThumb index={1} />
                  </RangeSlider>
                  <Text
                    ml={4}
                  >{`${priceRange[0]}VNĐ - ${priceRange[1]}VNĐ`}</Text>
                </Flex>
              </Box>
            </Flex>
            <Button colorScheme="teal" onClick={handleFilter}>
              Áp dụng bộ lọc
            </Button>
          </Box>

          {loading ? (
            <Box textAlign="center" mt={10}>
              <Spinner size="xl" />
            </Box>
          ) : error ? (
            <Box textAlign="center" mt={10}>
              <Text color="red.500" fontWeight="bold">
                {error}
              </Text>
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
