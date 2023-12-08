import WidgetContainer from "@/components/WidgetContainer";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import MenuCard from "@/components/MenuCard";
import redeemIcon from "../public/assets/redeem_giftcard.png";
import gitfcardIcon from "../public/assets/giftcard.png";
import spend from "../public/assets/spend.png";

import Image from "next/image";

export default function Home({}) {
  const [userAddress, setUserAddress] = useState("");
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);

  return (
    <VStack width={"full"} mt={"20px"} gap={"40px"}>
      <HStack gap={"18px"}>
        <MenuCard
          link="/giftcard/create"
          icon={gitfcardIcon}
          title={"Redeem GiftCard"}
        />
        <MenuCard
          link="/giftcard/redeem"
          icon={redeemIcon}
          title={"Create GiftCard"}
        />
      </HStack>
      <HStack
        position={"relative"}
        width={"312px"}
        height={"150px"}
        bg={"#103D96"}
        borderRadius={"16px"}
        justifyContent={"center"}
        gap={"20px"}
      >
        <Box position={"absolute"} top={0} left={0}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="160"
            height="67"
            viewBox="0 0 160 67"
            fill="none"
          >
            <g filter="url(#filter0_b_1255_577)">
              <ellipse
                cx="75.983"
                cy="12.5923"
                rx="86.2339"
                ry="49.7206"
                transform="rotate(-17.6537 75.983 12.5923)"
                fill="#D9D9D9"
                fill-opacity="0.1"
              />
            </g>
            <defs>
              <filter
                id="filter0_b_1255_577"
                x="-42.5765"
                y="-76.5351"
                width="237.119"
                height="178.255"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="17.5" />
                <feComposite
                  in2="SourceAlpha"
                  operator="in"
                  result="effect1_backgroundBlur_1255_577"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_backgroundBlur_1255_577"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </Box>
        <HStack width={"full"} justifyContent={"flex-end"}>
          {" "}
          <Image src={spend} alt="spend" />
        </HStack>
        <VStack width={"full"} alignItems={"flex-start"}>
          <Text fontSize={"16px"} fontWeight={"600"} color={"#fff"}>
            Spend
          </Text>
          <Text fontSize={"12px"} fontWeight={"400"} color={"#fff"}>
            Pay for day to day utilities
          </Text>
        </VStack>
        <Box position={"absolute"} bottom={0} right={0}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="59"
            viewBox="0 0 25 59"
            fill="none"
          >
            <g filter="url(#filter0_b_1255_578)">
              <ellipse
                cx="41.0001"
                cy="44"
                rx="47"
                ry="36"
                transform="rotate(-53.0861 41.0001 44)"
                fill="#D9D9D9"
                fill-opacity="0.1"
              />
            </g>
            <defs>
              <filter
                id="filter0_b_1255_578"
                x="-34.3157"
                y="-34.3622"
                width="150.631"
                height="156.724"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="17.5" />
                <feComposite
                  in2="SourceAlpha"
                  operator="in"
                  result="effect1_backgroundBlur_1255_578"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_backgroundBlur_1255_578"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </Box>
      </HStack>
      <div className="h1">
        There you go... a canvas for your next Celo project!
      </div>
      {isConnected && (
        <div className="h2 text-center">Your address: {userAddress}</div>
      )}
      {process.env.NEXT_PUBLIC_SC}
    </VStack>
  );
}
