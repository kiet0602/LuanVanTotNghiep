import React, { useEffect, useState } from "react";
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
import Layout from "../components/Layout";
import axios from "axios";
import CardProduct from "../components/CardProduct";
import TitlleCustom from "../components/TitlleCustom";
import imgSenda from "../assets/data/image/Senda/sen-da-chuoi-ngoc-dung.jpg";
import { AiOutlineClose } from "react-icons/ai";
import { MdFilterListOff } from "react-icons/md";
import { MdFilterList } from "react-icons/md";

const ProductsPage = () => {
  const [query, setQuery] = useState(""); // Tìm kiếm theo tên sản phẩm
  const [originalProducts, setOriginalProducts] = useState([]); // Danh sách sản phẩm gốc
  const [priceRange, setPriceRange] = useState([0, 1000000]); // Khoảng giá
  const [sortBy, setSortBy] = useState(""); // Giá trị mặc định là không sắp xếp
  const [error, setError] = useState(null); // Lỗi
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(""); // Category được chọn
  const [selectedColor, setSelectedColor] = useState(""); // Màu sắc được chọn

  const [products, setProducts] = useState([]); // Dữ liệu sản phẩm hiện tại
  const [colors, setColors] = useState([]); // Dữ liệu sản phẩm hiện tại
  const [categoris, setCategoris] = useState([]); // Dữ liệu sản phẩm hiện tại
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Đảm bảo đặt loading là true trước khi fetch
        const response = await axios.get(
          `http://localhost:2000/api/product/getAllProducts`
        );
        if (response.status === 200) {
          setProducts(response.data);
          setOriginalProducts(response.data); // Cập nhật danh sách sản phẩm gốc
        } else {
          console.error("Failed to fetch product: ", response.status);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Không thể lấy sản phẩm.");
      } finally {
        setLoading(false); // Đặt lại loading là false sau khi fetch xong
      }
    };
    fetchProducts();
  }, []);

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

      // Lọc theo category
      const filteredByCategory =
        selectedCategory !== ""
          ? filteredByPrice.filter(
              (product) => product.category._id === selectedCategory
            )
          : filteredByPrice;

      // Lọc theo màu sắc
      const filteredByColor =
        selectedColor !== ""
          ? filteredByCategory.filter(
              (product) =>
                product.color && product.color.nameColor === selectedColor
            )
          : filteredByCategory;

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
      setProducts(sortedProducts);
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
    setSelectedCategory("");
    setProducts(originalProducts);
  };

  useEffect(() => {
    if (query === "") {
      setProducts(originalProducts);
    }
    handleFilter();
  }, [query, priceRange, selectedCategory, selectedColor, sortBy]);

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
    const fetchCategoris = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2000/api/category/getAllCategory`
        );
        if (response.status === 200) {
          setCategoris(response.data);
        } else {
          console.error("Failed to fetch product: ", response.status);
        }
      } catch (error) {
        setError("Không thể lấy sản phẩm.");
      }
    };
    fetchCategoris();
  }, []);

  return (
    <>
      <Layout>
        <TitlleCustom
          title={"Tất cả sản phẩm"}
          description={
            "Những sản phẩm này là những sản phẩm mà cửa hàng chúng tôi muốn gửi đến bạn "
          }
        />
        <Box bg={useColorModeValue("green.100", "gray.800")}>
          <Container maxW="6xl" p={{ base: 5, md: 10 }}>
            {/* Bộ lọc */}
            <Flex justify="center" align="center">
              <Button
                ml="40px"
                mb={"4"}
                px="50px"
                borderRadius="none"
                bg="white"
                color="black"
                fontWeight="300"
                boxShadow="sm"
                onClick={() => setShowFilter(!showFilter)}
              >
                {showFilter ? (
                  <>
                    <MdFilterListOff /> <Text pl={"10px"}>Ẩn Bộ Lọc</Text>
                  </>
                ) : (
                  <>
                    <MdFilterList /> <Text pl={"10px"}>Lọc sản phẩm</Text>
                  </>
                )}
              </Button>
            </Flex>
            {showFilter && (
              <Box>
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
                        onChange={(e) => setSortBy(e.target.value)}
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
                      <Text
                        ml={4}
                      >{`${priceRange[0]}Đ - ${priceRange[1]}Đ`}</Text>
                    </Flex>
                  </Box>

                  {/* Lọc theo Category */}
                  <FormControl mb={4}>
                    <FormLabel>Chọn loại sản phẩm</FormLabel>
                    <RadioGroup
                      onChange={setSelectedCategory}
                      value={selectedCategory}
                    >
                      <Flex wrap="wrap">
                        {categoris.map((category) => (
                          <Radio key={category._id} value={category._id} mr={4}>
                            {category.categoryName}
                          </Radio>
                        ))}
                      </Flex>
                    </RadioGroup>
                  </FormControl>

                  {/* Lọc theo Màu Sắc */}
                  <FormControl>
                    <FormLabel>Chọn màu sắc</FormLabel>
                    <RadioGroup
                      onChange={setSelectedColor}
                      value={selectedColor}
                    >
                      <Flex wrap="wrap">
                        {colors.map((color) => (
                          <Radio key={color._id} value={color.nameColor} mr={4}>
                            {color.nameColor}
                          </Radio>
                        ))}
                      </Flex>
                    </RadioGroup>
                  </FormControl>
                  <Flex justifyContent="flex-end">
                    {(query ||
                      selectedColor ||
                      selectedCategory ||
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
            )}

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
                  CHÚNG TÔI CHƯA CÓ SẢN PHẨM NÀY
                </Text>
              </Box>
            ) : (
              <CardProduct products={products} />
            )}
          </Container>
        </Box>
      </Layout>
    </>
  );
};

export default ProductsPage;
