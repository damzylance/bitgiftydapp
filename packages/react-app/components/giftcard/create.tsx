import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Textarea,
  Toast,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { RxCardStack, RxPlus } from "react-icons/rx";
import { MdRedeem } from "react-icons/md";
import Image from "next/image";
import design from "../../public/assets/bitgifty-birthday01.jpg";
import { useForm } from "react-hook-form";
import { newKitFromWeb3 } from "@celo/contractkit";
import { transferCUSD } from "@/utils/transaction";
import { useAccount } from "wagmi";

type Props = {};

const Create = (props: Props) => {
  const [userAddress, setUserAddress] = useState("");
  const { address, isConnected } = useAccount();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const [totalAmount, setTotalAmount] = useState();
  const [loading, setLoading] = useState(false);
  const [fee, setFee] = useState("1");
  const [checkEmail, setCheckEmail] = useState(false);
  const amountMin = 0.1;

  // const createCard = async () => {
  //   if (window.ethereum && window.ethereum) {
  //     newKitFromWeb3(provider);
  //     kit.web3.eth.requestAccounts().then((result) => {
  //       kit.defaultAccount = result[0];
  //       let displayText = `...${kit.defaultAccount.substring(0, 8)}...`;
  //     });
  //   } else {
  //     console.log("ETH wallet not active");
  //   }
  // };
  const createGiftCard = async (data: any) => {
    // const amount = data.amount;
    setLoading(true);
    await transferCUSD(
      "0x1d277449c7e389e50651feb7af2cdf96366474bf",
      userAddress as string,
      data.amount as string
    )
      .then((response) => {
        Toast({ title: "success", status: "success" });
        setLoading(false);
      })
      .catch((error) => {
        Toast({ title: error.message, status: "warning" });
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);
  return (
    <VStack w={"full"}>
      <Flex height={"50px"} width={"full"} gap={5} px={"6px"}>
        <Button
          borderRadius={"none"}
          rightIcon={<RxPlus />}
          background={
            " linear-gradient(106deg, #103D96 27.69%, #306FE9 102.01%)"
          }
          variant={"solid"}
          size={["md", "md", "lg"]}
        >
          Create
        </Button>

        <Button
          size={["md", "md", "lg"]}
          rightIcon={<MdRedeem />}
          variant={"outline"}
          borderRadius={"none"}
        >
          Reedeem
        </Button>

        <Button
          size={["md", "md", "lg"]}
          variant={"outline"}
          rightIcon={<RxCardStack />}
          borderRadius={"none"}
        >
          My Cards
        </Button>
      </Flex>
      <VStack width={"full"}>
        <Image src={design} width={240} height={230} alt="" />
        <form
          action=""
          onSubmit={handleSubmit(createGiftCard)}
          style={{ width: "100%", flex: "2" }}
        >
          <VStack gap={"18px"} width={"full"}>
            {" "}
            <FormControl>
              <FormLabel>Select your gift card design</FormLabel>
              <HStack
                gap={"4px"}
                width={["full", "full", "500px"]}
                overflowX={"scroll"}
              >
                <Box>
                  <HStack
                    width={"80px"}
                    height={"70px "}
                    //   key={image.id}
                    bgImage={`url(./assets/bitgifty-birthday01.jpg)`}
                    backgroundSize={"cover"}
                    bgRepeat={"no-repeat"}
                    backgroundPosition={"center"}
                    borderRadius={"base"}
                    cursor={"pointer"}
                    //   border={image.link === template.link ? "1px solid #fff" : ""}
                    _hover={{ border: "1px solid blue" }}
                    //   onClick={() => {
                    //     setTemplate({ link: image.link, id: image.id });
                    //   }}
                  ></HStack>
                </Box>
                <Box>
                  <HStack
                    width={"100px"}
                    height={"70px "}
                    //   key={image.id}
                    bgImage={`url(./assets/bitgifty-birthday01.jpg)`}
                    backgroundSize={"cover"}
                    backgroundPosition={"center"}
                    borderRadius={"base"}
                    cursor={"pointer"}
                    //   border={image.link === template.link ? "1px solid #fff" : ""}
                    _hover={{ border: "1px solid blue" }}
                    //   onClick={() => {
                    //     setTemplate({ link: image.link, id: image.id });
                    //   }}
                  ></HStack>
                </Box>
                <Box>
                  <HStack
                    width={"100px"}
                    height={"70px "}
                    //   key={image.id}
                    bgImage={`url(./assets/bitgifty-birthday01.jpg)`}
                    backgroundSize={"cover"}
                    backgroundPosition={"center"}
                    borderRadius={"base"}
                    cursor={"pointer"}
                    //   border={image.link === template.link ? "1px solid #fff" : ""}
                    _hover={{ border: "1px solid blue" }}
                    //   onClick={() => {
                    //     setTemplate({ link: image.link, id: image.id });
                    //   }}
                  ></HStack>
                </Box>
                <Box>
                  <HStack
                    width={"100px"}
                    height={"70px "}
                    //   key={image.id}
                    bgImage={`url(./assets/bitgifty-birthday01.jpg)`}
                    backgroundSize={"cover"}
                    backgroundPosition={"center"}
                    borderRadius={"base"}
                    cursor={"pointer"}
                    //   border={image.link === template.link ? "1px solid #fff" : ""}
                    _hover={{ border: "1px solid blue" }}
                    //   onClick={() => {
                    //     setTemplate({ link: image.link, id: image.id });
                    //   }}
                  ></HStack>
                </Box>
              </HStack>
            </FormControl>
            <HStack width={"full"}>
              {" "}
              <FormControl flex={1}>
                <FormLabel fontSize={"small"}> Amount</FormLabel>
                <InputGroup>
                  {" "}
                  <Input
                    required
                    type={"text"}
                    pl={"2px"}
                    {...register("amount", {
                      onChange: (e) => {
                        // setDollarAmount(parseFloat(e.target.value) * rate);
                      },
                      min: {
                        value: amountMin,
                        message: `Minimum amount is ${amountMin}`,
                      },
                    })}
                  />
                  <InputRightElement>
                    <Text
                      color={"green"}
                      opacity={"0.5"}
                      fontWeight={"500"}
                      fontSize={"small"}
                    >
                      cUSD
                    </Text>
                  </InputRightElement>
                </InputGroup>

                <FormErrorMessage fontSize={"small"}></FormErrorMessage>
              </FormControl>
              <FormControl flex={2}>
                <FormLabel fontSize={"small"}>Receipent Email</FormLabel>
                <Input
                  placeholder="friend@mail.com"
                  type="email"
                  required
                  background={"brand.50"}
                  {...register("receipent_email")}
                />
              </FormControl>
            </HStack>
            <HStack
              width={"full"}
              flexDir={["column", "column", "row"]}
              alignItems={"flex-start"}
              gap={"20px"}
            >
              <FormControl>
                <FormLabel fontSize={"small"}>Note (optional)</FormLabel>
                <Textarea background={"brand.50"} {...register("note")} />
              </FormControl>
            </HStack>
            <Box width={"full"}>
              <Button
                width={"full"}
                isLoading={loading}
                type="submit"
                size={"lg"}
                borderRadius={"none"}
                background={
                  " linear-gradient(106deg, #103D96 27.69%, #306FE9 102.01%)"
                }
                _hover={{
                  background:
                    "linear-gradient(106deg, #103D96 27.69%, #306FE9 102.01%)",
                }}
                variant={"solid"}
              >
                Create & Send
              </Button>
              <Text>{userAddress}</Text>
            </Box>
          </VStack>
        </form>
      </VStack>
    </VStack>
  );
};

export default Create;
