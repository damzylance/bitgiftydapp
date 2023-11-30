import { HStack, Text, VStack } from "@chakra-ui/react";

type Props = {
  action: any;
  icon: any;
  text: any;
};
export const UtilityCard = (props: Props) => {
  return (
    <VStack
      boxShadow={
        "-9.1159px -18.2318px 24.3091px #fff, 9.1159px 18.2318px 24.3091px #eceef1"
      }
      border={"1px solid #c2dafa"}
      width={"90%"}
      cursor={"pointer"}
      backgroundColor={"#f9f9f9"}
      alignSelf={"center"}
      alignItems={"center"}
      borderRadius={"12px"}
      justifyContent={"center"}
      gap={"10px"}
      minH={"200px"}
      onClick={props.action}
    >
      <HStack
        width={"100px"}
        height={"100px"}
        justifyContent={"center"}
        background={"#f9f9f9"}
        boxShadow={
          "-6.98333px -24.4417px 23.2778px #fff, 6.98333px 24.4417px 23.2778px #e8f2ff"
        }
        borderRadius={"50%"}
        fontSize={"28px"}
        alignItems={"center"}
        color={"#0f3d97"}
        fontWeight={"extrabold"}
      >
        {props.icon}
      </HStack>

      <Text fontWeight={"600"}>{props.text}</Text>
    </VStack>
  );
};
