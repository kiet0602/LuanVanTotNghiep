//thư viện UI
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
//thư viện

//Hook Custom

//Components

//data
const ButtonSighIn = ({ handleLogin, isLoading }) => {
  //khai báo

  return (
    <Center>
      <Stack align={"center"} w={"full"}>
        <Button
          bgGradient="linear(to-l, #0ea5e9, #2563eb)"
          variant={"solid"}
          w={"full"}
          onClick={handleLogin}
          isLoading={isLoading}
        >
          Đăng nhập
        </Button>
        {/* Facebook */}
        {/* <Button w={"full"} colorScheme={"facebook"} leftIcon={<FaFacebook />}>
          <Center>
            <Text>Tiếp tục với Facebook</Text>
          </Center>
        </Button> */}
        {/* Google */}
        {/* <Button w={"full"} variant={"outline"} leftIcon={<FcGoogle />}>
          <Center>
            <Text>Tiếp tục với Google</Text>
          </Center>
        </Button> */}
      </Stack>
    </Center>
  );
};
export default ButtonSighIn;
