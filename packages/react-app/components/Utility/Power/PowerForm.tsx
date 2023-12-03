import { buyElectricity } from "@/utils/transaction";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
type Inputs = {
  customer: string;
  amount: string;
};

export const PowerForm = (props: any) => {
  console.log(props.disco);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [nairaAmount, setNairaAmount] = useState(0);
  const [tokenToNairaRate, setTokenToNairaRate] = useState(0);
  const [currency, setCurrency] = useState("");

  const handlePlanChange = (e: any) => {
    const nairaAmount = parseInt(e.target.value.split(",")[1]);
    setNairaAmount(parseInt(e.target.value.split(",")[1]));
    setTokenAmount(tokenToNairaRate * nairaAmount);
  };
  const handleAmountChange = (e: any) => {
    const tempNairaAmount = e.target.value;
    setNairaAmount(tempNairaAmount);
    if (currency === "usdt_tron" || currency === "cusd") {
      setTokenAmount(tempNairaAmount / tokenToNairaRate);
    } else {
      setTokenAmount(tokenToNairaRate * tempNairaAmount);
    }
  };

  const fetchRate = async (currency: string) => {
    let rate;
    if (currency === "btc") {
      currency = "bitcoin";
    }

    if (currency === "naira") {
      rate = 1;
      setTokenToNairaRate(parseFloat("1"));
    } else if (currency === "usdt_tron" || currency === "cusd") {
      setIsLoading(true);
      await axios
        .get(`${process.env.REACT_APP_BASE_URL}swap/get-dollar-price`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setTokenToNairaRate(parseFloat(response.data));
          setIsLoading(false);
          rate = parseFloat(response.data);
        })
        .catch((error) => {
          setIsLoading(false);
          toast({
            title: error.response.data.error,
            status: "warning",
          });
        });
    } else {
      setIsLoading(true);
      await axios
        .get(
          `${process.env.REACT_APP_BASE_URL}utilities/v2/naira/${currency}`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setTokenToNairaRate(parseFloat(response.data));
          setIsLoading(false);
          rate = parseFloat(response.data);
        })
        .catch((error) => {
          setIsLoading(false);
          toast({
            title: error.response.data.error,
            status: "warning",
          });
        });
    }

    return rate;
  };

  //   setIsLoading(true);
  //   axios
  //     .get(
  //       `${process.env.REACT_APP_BASE_URL}utilities/v2/get-bill-category?bill-type=power`,
  //       {
  //         headers: {
  //           Authorization: `Token ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       console.log(response);
  //       setIsLoading(false);

  //       setPlans(
  //         response.data.data.filter((plan) => {
  //           return plan.biller_code === props.cable;
  //         })
  //       );
  //     })
  //     .catch((error) => {});
  // }, []);

  return (
    <VStack my={"40px"} gap={"20px"} width={"full"}>
      <HStack width={"full"} alignItems={"center"}>
        <ArrowBackIcon
          fontSize={"20px"}
          cursor={"pointer"}
          onClick={props.back}
        />
        <HStack width={"full"} justifyContent={"cener"}>
          <Text
            textAlign={"center"}
            fontSize={"2xl"}
            textTransform={"uppercase"}
            width={"full"}
          >
            {props.name}
          </Text>
        </HStack>
      </HStack>
      <form style={{ width: "100%" }} onSubmit={handleSubmit(buyElectricity)}>
        <VStack width={"full"} gap={"20px"}>
          <FormControl>
            <FormLabel>Select Meter Type</FormLabel>
            <Select fontSize={"16px"} disabled>
              <option value={"prepaid"}>Prepaid</option>
              <option value={"postpaid"}>Postpaid</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
              Meter Number
            </FormLabel>

            <Input
              fontSize={"16px"}
              border={"1px solid #f9f9f9"}
              outline={"none"}
              type="tel"
              required
              {...register("customer")}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
              Amount (₦)
            </FormLabel>

            <Input
              border={"1px solid #f9f9f9"}
              outline={"none"}
              fontSize={"16px"}
              type="number"
              min={50}
              required
              {...register("amount", {
                onChange: handleAmountChange,
              })}
            />
            <HStack
              width={"full"}
              alignItems={"center"}
              justifyContent={"space-between"}
              mt={"5px"}
            >
              <Text fontSize={"xs"} textAlign={"right"}>
                ≈{" "}
                {currency === "btc"
                  ? tokenAmount.toFixed(6)
                  : tokenAmount.toFixed(3)}{" "}
                {currency}
              </Text>
              <Text color={"red"} fontSize={"xx-small"}>
                {errors.amount && errors.amount.message}
              </Text>
            </HStack>

            <FormErrorMessage>
              {errors.amount && errors.amount.message}
            </FormErrorMessage>
          </FormControl>

          <Button
            isLoading={isLoading}
            type="submit"
            width={"full"}
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
            Pay
          </Button>
        </VStack>
      </form>
    </VStack>
  );
};
