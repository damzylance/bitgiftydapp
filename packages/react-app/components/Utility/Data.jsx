import React, { useEffect, useState } from "react";
import { ProviderCard } from "./Airtime";
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

const Data = (props) => {
  const telcos = [
    { name: "mtn", logo: "/assets/images/mtn_logo.png", id: "BIL108" },
    { name: "glo", logo: "/assets/images/glo_logo.webp", id: "BIL109" },
    { name: "airtel", logo: "/assets/images/airtel_logo.png", id: "BIL110" },
    { name: "9mobile", logo: "/assets/images/9mobile_logo.jpeg", id: "BIL111" },
  ];

  const [page, setPage] = useState("list");
  const [telco, setTelco] = useState(null);
  const [name, setName] = useState(null);

  return (
    <>
      {page === "list" && (
        <VStack width={"full"} gap={"40px"} my={"40px"}>
          <Text fontSize={"2xl"}>Plese Select Telco Provider</Text>

          <VStack width={"full"} gap={"10px"}>
            {telcos.length > 0
              ? telcos.map((provider) => {
                  return (
                    <ProviderCard
                      action={() => {
                        setPage("buy");
                        setTelco(provider.id);
                        setName(provider.name);
                      }}
                      name={provider.name}
                      logo={provider.logo}
                    />
                  );
                })
              : ""}
          </VStack>
        </VStack>
      )}
      {page === "buy" && (
        <DataForm
          telco={telco}
          onClose={props.action}
          name={name}
          back={() => setPage("list")}
        />
      )}
    </>
  );
};

const DataForm = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const { userWallets } = useWallets();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [using, setUsing] = useState(null);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [nairaAmount, setNairaAmount] = useState(null);
  const [tokenToNairaRate, setTokenToNairaRate] = useState(0);
  const [currency, setCurrency] = useState("");
  const [plans, setPlans] = useState([]);
  const [networkId, setNetworkId] = useState([]);
  const buyData = async (data) => {
    data.amount = parseInt(data.type.split(",")[1]);
    data.bill_type = data.type.split(",")[0];
    data.country = "NG";

    // data.token_amount = data.data.split(",")[1];
    // delete data.network;
    // delete data.data;

    if (tokenAmount >= walletBalance) {
      toast({ title: "insufficient balance", status: "warning" });
    } else {
      setIsLoading(true);
      await axios
        .post(
          `${process.env.REACT_APP_BASE_URL}utilities/v2/initialize-payment/`,
          data,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setIsLoading(false);
          toast({
            title: "Data purchase successful",
            status: "success",
          });
          props.onClose();
        })
        .catch((error) => {
          setIsLoading(false);
          toast({
            title: error.response.data.error,
            status: "warning",
          });
        });
    }
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
          response.data.data.filter((plan) => {
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

  const fetchRate = async (currency) => {
    let rate;
    if (currency === "btc") {
      currency = "bitcoin";
    }

    if (currency === "naira") {
      rate = 1;
      setTokenToNairaRate(parseFloat(1));
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
  const handleCurrencyChange = async (e) => {
    const network = e.target.value;
    setCurrency(e.target.value);
    for (let index = 0; index < userWallets.length; index++) {
      if (userWallets[index][0] === network) {
        setWalletBalance(userWallets[index][1].balance.availableBalance);
      }
    }

    const rate = await fetchRate(e.target.value);
    // alert(currency);
    if (network === "usdt_tron" || network === "cusd") {
      setTokenAmount(nairaAmount / rate);
    } else {
      setTokenAmount(rate * nairaAmount);
    }
  };
  const handlePlanChange = (e) => {
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
              {plans.map((plan, index) => {
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
              name="customer"
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

          <FormControl>
            <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
              Pay with: Select Wallet
            </FormLabel>

            <Select
              textTransform={"uppercase"}
              {...register("chain", { onChange: handleCurrencyChange })}
              required
            >
              <option>Select Coin</option>;
              {userWallets
                .filter((wallet) => {
                  return wallet[0] !== "eth";
                })
                .map((wallet, index) => {
                  return (
                    <option value={wallet[0]} key={index}>
                      {wallet[0]}
                    </option>
                  );
                })}
            </Select>
            <Text mt={"10px"}>Balance: {walletBalance}</Text>
            <FormErrorMessage></FormErrorMessage>
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
            Buy Data
          </Button>
        </VStack>
      </form>
    </VStack>
  );
};
export default Data;
