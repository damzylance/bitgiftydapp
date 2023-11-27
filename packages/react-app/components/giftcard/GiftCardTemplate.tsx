import React, { FC, ReactNode, useState } from "react";
import { Box, Button, Divider, Flex, VStack } from "@chakra-ui/react";

import { RxCardStack, RxPlus } from "react-icons/rx";
import { MdRedeem } from "react-icons/md";
import WidgetContainer from "../WidgetContainer";
import Link from "next/link";
interface Props {
  children: ReactNode;
}
const GiftCardTemplate: FC<Props> = ({ children }) => {
  if (typeof window !== "undefined") {
    const pathname: string = window.location.pathname;
    console.log("Current Pathname:", pathname);
  } else {
    console.log(
      "Window object is not available (possibly server-side rendering)."
    );
  }
  //   let page = window.location.pathname.split("/");
  //   console.log(page);
  //   window.location.pathname.split("/")[1];

  return (
    <VStack>
      <Flex height={"50px"} gap={5} mt={"10px"}>
        <Link href={"/giftcard/create"}>
          <Button
            borderRadius={"none"}
            rightIcon={<RxPlus />}
            variant={"outline"}
            size={["md", "md", "lg"]}
          >
            Create
          </Button>
        </Link>
        <Link href={"/giftcard/redeem"}>
          <Button
            size={["md", "md", "lg"]}
            rightIcon={<MdRedeem />}
            // variant={page === "redeem" ? "solid" : "outline"}
            // bg={
            //   page === "redeem"
            //     ? " linear-gradient(106deg, #103D96 27.69%, #306FE9 102.01%)"
            //     : ""
            // }
            borderRadius={"none"}
          >
            Reedeem
          </Button>
        </Link>
        <Link href={"/giftcard/cards"}>
          <Button
            size={["md", "md", "lg"]}
            rightIcon={<RxCardStack />}
            borderRadius={"none"}
            // variant={page === "cards" ? "solid" : "outline"}
            // bg={
            //   page === "cards"
            //     ? " linear-gradient(106deg, #103D96 27.69%, #306FE9 102.01%)"
            //     : ""
            // }
          >
            My Cards
          </Button>
        </Link>
      </Flex>
      <Box width={"full"}>{children}</Box>
    </VStack>
  );
};

export default GiftCardTemplate;
