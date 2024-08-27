import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Flex,
  Box,
  Text,
  Divider,
} from "@chakra-ui/react";
import CardProductDetail from "../components/CardProductDetail";
import Layout from "../components/Layout";
import Review from "../components/Review";

const ProductDetailPage = () => {
  // Sample product data
  const productDescription =
    "This exquisite miniature ornamental plant is perfect for enhancing any space with a touch of natural beauty. Easy to care for and perfect for small spaces.";
  const careInstructions =
    "Water the plant moderately, keeping the soil moist but not soggy. Place it in indirect sunlight and ensure a stable temperature environment for optimal growth.";
  const features = [
    "Compact size suitable for desks and shelves",
    "Low maintenance, ideal for busy lifestyles",
    "Improves air quality and adds natural decor",
  ];

  return (
    <Layout>
      <CardProductDetail />
      <Divider />

      <Flex justify="center" mt={8}>
        <Tabs variant="soft-rounded" colorScheme="green" maxW={"7xl"}>
          <TabList>
            <Tab>Description</Tab>
            <Tab>Care Instructions</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box>
                <Text fontSize="lg" mb={4}>
                  {productDescription}
                </Text>
                <Text>
                  This plant not only adds a splash of greenery but also creates
                  a calming atmosphere. Perfect for enhancing office desks, home
                  shelves, or as a thoughtful gift for plant lovers.
                </Text>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box>
                <Text fontSize="lg" mb={4}>
                  {careInstructions}
                </Text>
                <Text>
                  Remember to avoid overwatering and place it in a bright, warm
                  area. Use well-draining soil for best results and trim any
                  dead leaves to keep the plant healthy.
                </Text>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
      <Review />
    </Layout>
  );
};

export default ProductDetailPage;
