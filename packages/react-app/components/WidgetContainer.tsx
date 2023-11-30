import { HStack, Text, VStack } from "@chakra-ui/react";
import React, { FC, ReactNode, useEffect, useState } from "react";
import logo from "../public/assets/logo-inline-transparent.png";
import Image from "next/image";
import Link from "next/link";
import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

interface Props {
  children: ReactNode;
}
const WidgetContainer: FC<Props> = ({ children }) => {
  const [hideConnectBtn, setHideConnectBtn] = useState(false);

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      setHideConnectBtn(true);
      connect();
    }
  }, []);

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
            <Link href={"/giftcard/create"}>
              <Text
                color={"#fff"}
                fontSize={"small"}
                fontWeight={"500"}
                _hover={{ textDecoration: "underline", fontWeight: "700" }}
              >
                GiftCard
              </Text>
            </Link>
            <Link href={"/spend/"}>
              {" "}
              <Text
                color={"#fff"}
                fontSize={"small"}
                fontWeight={"500"}
                _hover={{ textDecoration: "underline", fontWeight: "700" }}
              >
                Spend
              </Text>
            </Link>
          </HStack>
        </HStack>
      </HStack>
      <VStack py={"4px"} width={"full"} maxW={"500px"} margin={"auto"}>
        {children}
      </VStack>
    </VStack>
  );
};

export default WidgetContainer;
