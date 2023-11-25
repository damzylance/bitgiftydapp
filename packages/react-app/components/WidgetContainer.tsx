import { HStack, Text, VStack } from "@chakra-ui/react";
import React, { FC, ReactNode } from "react";
import logo from "../public/assets/logo-inline-transparent.png";
import Image from "next/image";

interface Props {
  children: ReactNode;
}
const WidgetContainer: FC<Props> = ({ children }) => {
  return (
    <VStack w={"full"} bg={"#fff"}>
      <HStack w={"full"}>
        <HStack
          px={"6px"}
          py={"10px"}
          w={"full"}
          maxW={"500px"}
          margin={"auto"}
          bg={"#103D96"}
          justifyContent={"space-between"}
        >
          <Image alt="logo" style={{ width: "80px" }} src={logo} />
          <HStack>
            <Text color={"#fff"} fontSize={"small"} fontWeight={"500"}>
              GiftCard
            </Text>
            <Text color={"#fff"} fontSize={"small"} fontWeight={"500"}>
              Spend
            </Text>
          </HStack>
        </HStack>
      </HStack>
      <VStack width={"full"}>
        <VStack
          px={"6px"}
          py={"4px"}
          width={"full"}
          maxW={"500px"}
          margin={"auto"}
        >
          {children}
        </VStack>
      </VStack>
    </VStack>
  );
};

export default WidgetContainer;
