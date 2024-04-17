import React, { FC, ReactNode, useEffect, useState } from "react";
import { Box, Button, Divider, Flex, VStack } from "@chakra-ui/react";

import { RxCardStack, RxPlus } from "react-icons/rx";
import { MdRedeem } from "react-icons/md";
import Link from "next/link";
interface Props {
  children: ReactNode;
}
const GiftCardTemplate: FC<Props> = ({ children }) => {
  const [page, setPage] = useState("");

  useEffect(() => {
    // Check if window is defined before using it
    if (typeof window !== "undefined") {
      const currentPage = window.location.pathname.split("/")[2];
      console.log("Current Pathname:", currentPage);
      setPage(currentPage);
    }
  }, []);

  return (
    <VStack w={"95%"} maxW={"500px"} margin={"auto"}>
      <Flex height={"50px"} gap={5} mt={"10px"}>
        <Link href={"/giftcard/create"}>
          <Button
            borderRadius={"none"}
            rightIcon={<RxPlus />}
            variant={page === "create" ? "solid" : "outline"}
            size={["sm", "md", "lg"]}
            bg={
              page === "create"
                ? " linear-gradient(106deg, #103D96 27.69%, #306FE9 102.01%)"
                : ""
            }
          >
            Create
          </Button>
        </Link>
        <Link href={"/giftcard/redeem"}>
          <Button
            size={["sm", "md", "lg"]}
            rightIcon={<MdRedeem />}
            variant={page === "redeem" ? "solid" : "outline"}
            bg={
              page === "redeem"
                ? " linear-gradient(106deg, #103D96 27.69%, #306FE9 102.01%)"
                : ""
            }
            borderRadius={"none"}
          >
            Reedeem
          </Button>
        </Link>
        <Link href={"/giftcard/cards"}>
          <Button
            size={["sm", "md", "lg"]}
            rightIcon={<RxCardStack />}
            borderRadius={"none"}
            variant={page === "cards" ? "solid" : "outline"}
            bg={
              page === "cards"
                ? " linear-gradient(106deg, #103D96 27.69%, #306FE9 102.01%)"
                : ""
            }
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