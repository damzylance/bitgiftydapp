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
import { useForm } from "react-hook-form";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
type Inputs = {
  customer: string;
  amount: string;
  type: string;
};

type Plan = { biller_name: string; amount: string };
export const DataForm = (props: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Inputs>();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState("null");
  const [tokenAmount, setTokenAmount] = useState(0);
  const [nairaAmount, setNairaAmount] = useState(0);
  const [tokenToNairaRate, setTokenToNairaRate] = useState(0);
  const [currency, setCurrency] = useState("");
  const [plans, setPlans] = useState([]);
  const [networkId, setNetworkId] = useState([]);
  const buyData = async (data: any) => {
    data.amount = parseInt(data.type.split(",")[1]);
    data.bill_type = data.type.split(",")[0];
    data.country = "NG";

    // data.token_amount = data.data.split(",")[1];
    // delete data.network;
    // delete data.data;
  };
  const fetchDataPlans = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_BASE_URL}utilities/v2/get-bill-category?bill-type=data_bundle`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPlans(
          response.data.data.filter((plan: any) => {
            return plan.biller_code === props.telco;
          })
        );
        setIsLoading(false);
      })
      .catch((error) => {
        toast({
          title: error.response.data.error,
          status: "warning",
        });
      });
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

  const handlePlanChange = (e: any) => {
    const nairaAmount = parseInt(e.target.value.split(",")[1]);
    setNairaAmount(parseInt(e.target.value.split(",")[1]));
    setTokenAmount(tokenToNairaRate * nairaAmount);
  };

  useEffect(() => {
    fetchDataPlans();
  }, []);
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
            BUY {props.name} DATA
          </Text>
        </HStack>
      </HStack>

      <form style={{ width: "100%" }} onSubmit={handleSubmit(buyData)}>
        <VStack width={"full"} gap={"20px"}>
          <FormControl>
            <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
              Data Plans
            </FormLabel>

            <Select
              fontSize={"16px"}
              {...register("type", { onChange: handlePlanChange })}
              required
            >
              <option>Choose Plan</option>;
              {plans.map((plan: Plan, index) => {
                return (
                  <option value={[plan.biller_name, plan.amount]} key={index}>
                    {plan.biller_name} (N{plan.amount})
                  </option>
                );
              })}
            </Select>
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
            <FormErrorMessage></FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
              Beneficiary Phone Number
            </FormLabel>

            <Input
              fontSize={"16px"}
              border={"1px solid #f9f9f9"}
              outline={"none"}
              type="tel"
              required
              minLength={11}
              maxLength={11}
              {...register("customer")}
            />
            <FormErrorMessage></FormErrorMessage>
          </FormControl>

          {/* <FormControl>
            <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
              Amount
            </FormLabel>

            <Input
              border={"1px solid #f9f9f9"}
              value={amount}
              outline={"none"}
              fontSize={"14px"}
              type="number"
              min={100}
              required
            />
            <FormErrorMessage></FormErrorMessage>
          </FormControl> */}

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
            Buy Data
          </Button>
        </VStack>
      </form>
    </VStack>
  );
};
