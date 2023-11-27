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
import Link from "next/link";
import GiftCardTemplate from "./GiftCardTemplate";

type Props = {};

const Create = (props: Props) => {
  const toast = useToast();
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

  const createGiftCard = async (data: any) => {
    try {
      setLoading(true);
      const amount = data.amount;
      const response = await transferCUSD(
        "0x1d277449c7e389e50651feb7af2cdf96366474bf",
        userAddress,
        data.amount
      );

      if (response.hash) {
        toast({
          title: "Giftcard created successfully and sent to recipient's email",
        });
      } else if (response.message.includes("ethers-user-denied")) {
        toast({ title: "User rejected transaction", status: "warning" });
      } else {
        toast({ title: "An error occurred", status: "warning" });
      }
    } catch (error: any) {
      console.log(error);
      toast({ title: error.message, status: "warning" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);
  return (
    <GiftCardTemplate>
      <VStack width={"full"}>
        <Image src={design} width={240} height={230} priority alt="" />
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
                <Box _hover={{ border: "1px solid blue" }}>
                  <Image
                    src={design}
                    alt="giftcard-design"
                    width={80}
                    height={70}
                  />
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
    </GiftCardTemplate>
  );
};

export default Create;
