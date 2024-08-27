import { Text, useColorMode } from "@chakra-ui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";

const ButtonIconModeColor = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Text
      fontSize={"35px"}
      onClick={toggleColorMode}
      cursor={"pointer"}
      zIndex={10}
    >
      {colorMode === "light" ? (
        <FontAwesomeIcon icon={faToggleOn} style={{ color: "black" }} />
      ) : (
        <FontAwesomeIcon icon={faToggleOff} style={{ color: "white" }} />
      )}
    </Text>
  );
};
export default ButtonIconModeColor;
