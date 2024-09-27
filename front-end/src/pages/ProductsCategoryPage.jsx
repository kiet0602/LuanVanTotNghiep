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
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CardNew from "../components/CardNew";
import imgSenda from "../assets/data/image/Senda/sen-da-chuoi-ngoc-dung.jpg";
import { AiOutlineClose } from "react-icons/ai"; // Icon từ react-icons

const ProductsCategory = () => {
  const [products, setProducts] = useState([]); // Dữ liệu sản phẩm hiện tại
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState(""); // Tìm kiếm theo tên sản phẩm
  const [originalProducts, setOriginalProducts] = useState([]); // Danh sách sản phẩm gốc
  const [priceRange, setPriceRange] = useState([0, 1000000]); // Khoảng giá
  const [sortBy, setSortBy] = useState(""); // Giá trị mặc định là không sắp xếp
  const [error, setError] = useState(null); // Lỗi
  const { categoryId } = useParams();
  const [colors, setColors] = useState([]); // Dữ liệu sản phẩm hiện tại
  const [selectedColor, setSelectedColor] = useState(""); // Màu sắc được chọn

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2000/api/color/getAllcolor`
        );
        if (response.status === 200) {
          setColors(response.data);
        } else {
          console.error("Failed to fetch product: ", response.status);
        }
      } catch (error) {
        setError("Không thể lấy sản phẩm.");
      }
    };
    fetchColors();
  }, []);

  useEffect(() => {
    if (!categoryId) return;
    const fetchProductsCategoryID = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2000/api/product/getProductByCategoryId/${categoryId}`
        );

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
    setLoading(true);
    setError(null);
    try {
      // Lọc sản phẩm theo từ khóa tìm kiếm
      const filteredByQuery = originalProducts.filter((product) =>
        product.productName.toLowerCase().includes(query.toLowerCase())
      );

      // Lọc sản phẩm theo khoảng giá
      const filteredByPrice =
        priceRange.length === 2
          ? filteredByQuery.filter(
              (product) =>
                product.finalPrice >= priceRange[0] &&
                product.finalPrice <= priceRange[1]
            )
          : filteredByQuery;

      const filteredByColor =
        selectedColor !== ""
          ? filteredByPrice.filter(
              (product) =>
                product.color && product.color.nameColor === selectedColor
            )
          : filteredByPrice;

      // Sắp xếp sản phẩm
      const sortedProducts = filteredByColor.sort((a, b) => {
        if (sortBy === "") {
          return 0; // Không sắp xếp nếu không có giá trị
        }
        switch (sortBy) {
          case "priceAsc":
            return a.finalPrice - b.finalPrice;
          case "priceDesc":
            return b.finalPrice - a.finalPrice;
          case "rating":
            return b.rating - a.rating;
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

      setProducts(sortedProducts); // Cập nhật danh sách sản phẩm đã lọc và sắp xếp
    } catch (err) {
      console.error("Error during filtering:", err);
      setError("Không thể lọc sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setQuery("");
    setPriceRange([0, 1000000]);
    setSortBy("");
    setSelectedColor("");
    setProducts(originalProducts);
  };

  useEffect(() => {
    if (query === "") {
      setProducts(originalProducts);
    }
    handleFilter();
  }, [query, priceRange, sortBy, selectedColor]);

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
                <FormControl>
                  <FormLabel htmlFor="productSearch">
                    Tìm kiếm theo tên
                  </FormLabel>
                  <Input
                    id="productSearch"
                    placeholder="Nhập tên sản phẩm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="sortOptions">Sắp xếp theo</FormLabel>
                  <Select
                    id="sortOptions"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                    }}
                  >
                    <option value="">Không sắp xếp</option>
                    <option value="orderCount">Số lượng đặt hàng</option>
                    <option value="priceAsc">Giá thấp đến cao</option>
                    <option value="priceDesc">Giá cao đến thấp</option>
                    <option value="rating">Lượt đánh giá</option>
                    <option value="nameAsc">Tên A đến Z</option>
                    <option value="nameDesc">Tên Z đến A</option>
                  </Select>
                </FormControl>
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
                    width="800px"
                  >
                    <RangeSliderTrack>
                      <RangeSliderFilledTrack />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} />
                    <RangeSliderThumb index={1} />
                  </RangeSlider>
                  <Text ml={4}>{`${priceRange[0]}Đ - ${priceRange[1]}Đ`}</Text>
                </Flex>
              </Box>
              <FormControl mb={4}>
                <FormLabel>Chọn màu sắc</FormLabel>
                <RadioGroup onChange={setSelectedColor} value={selectedColor}>
                  <Flex wrap="wrap">
                    {colors.map((color) => (
                      <Radio key={color._id} value={color.nameColor} mr={4}>
                        {color.nameColor}
                      </Radio>
                    ))}
                  </Flex>
                </RadioGroup>
              </FormControl>
              <Flex justifyContent="flex-end" mb={4}>
                {(query ||
                  selectedColor ||
                  sortBy ||
                  priceRange[0] !== 0 ||
                  priceRange[1] !== 1000000) && (
                  <Button
                    colorScheme="red"
                    onClick={resetFilters}
                    leftIcon={<AiOutlineClose />}
                  >
                    Xóa lọc
                  </Button>
                )}
              </Flex>
            </Flex>
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
