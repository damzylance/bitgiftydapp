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
import { sendGiftCard, transferCUSD } from "@/utils/transaction";
import { useAccount } from "wagmi";
import Link from "next/link";
import GiftCardTemplate from "./GiftCardTemplate";
import axios from "axios";

type Props = {};
interface GiftCardResponse {
  status: number;
}

const CreateGiftCard = (props: Props) => {
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
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState({ link: "", id: "" });
  const amountMin = 0.1;

  const fetchTemplates = async () => {
    setLoading(true);

    await axios
      .get(`https://server.bitgifty.com/gift_cards/images`)
      .then((response) => {
        setLoading(false);
        setTemplates(response.data.results);
        setTemplate({
          link: response.data.results[0].link,
          id: response.data.results[0].id,
        });
      })
      .catch((error) => {
        setLoading(false);
        toast({ title: error.response?.data?.error, status: "error" });
      });
  };

  const createGiftCard = async (data: any) => {
    try {
      setLoading(true);
      const amount = data.amount;
      data.image = 1;
      data.currency = "cusd";
      data.address = address;
      console.log(data);

      const response = await transferCUSD(userAddress, data.amount);

      if (response.hash) {
        const giftCardResponse: any = await sendGiftCard(data); // Call to createGiftCard function
        console.log(giftCardResponse);

        if (giftCardResponse?.status === 201) {
          // Gift card created successfully
          toast({
            title:
              "Gift card created successfully and sent to recipient's email",
          });
        } else {
          toast({ title: "Failed to create gift card", status: "warning" });
        }
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
    fetchTemplates();
  }, [address, isConnected]);
  return (
    <GiftCardTemplate>
      <VStack width={"full"}>
        <form
          action=""
          onSubmit={handleSubmit(createGiftCard)}
          style={{ width: "100%" }}
        >
          <VStack gap={"18px"} width={"full"}>
            {" "}
            <FormControl width={"full"}>
              <FormLabel>Select your gift card design</FormLabel>
              <HStack alignItems={"flex-start"} width={"full"} gap={"30px"}>
                <Image
                  src={template.link}
                  width={250}
                  height={235}
                  priority
                  alt=""
                />
                <VStack gap={"4px"} height={"230px"} overflowY={"scroll"}>
                  {templates.length > 1 &&
                    templates.map((image: any, id) => {
                      return (
                        <Box
                          _hover={{ border: "1px solid blue" }}
                          border={
                            image.link === template.link ? "1px solid #fff" : ""
                          }
                          key={id}
                        >
                          <Image
                            src={image.link}
                            alt="giftcard-design"
                            width={80}
                            height={70}
                            style={{ objectFit: "contain" }}
                            onClick={() => {
                              setTemplate({ link: image.link, id: image.id });
                            }}
                          />
                        </Box>
                      );
                    })}
                </VStack>
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

export default CreateGiftCard;
