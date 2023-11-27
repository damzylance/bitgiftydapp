import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ProviderCard } from "./Airtime";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import axios from "axios";

const Cable = (props) => {
  const [page, setPage] = useState("list");
  const [merchants, setMerchants] = useState([
    { name: "DSTV", logo: "/assets/images/dstv.png", id: "BIL121" },
    { name: "GOTV", logo: "/assets/images/gotv.png", id: "BIL122" },
    { name: "STARTIMES", logo: "/assets/images/startimes.png", id: "BIL123" },
  ]);

  const [merchantName, setMerchantName] = useState(null);
  const [merchantId, setMerchantId] = useState(null);
  return (
    <>
      {page === "list" && (
        <VStack width={"full"} gap={"40px"} my={"40px"}>
          <Text fontSize={"2xl"} textAlign={"center"}>
            {" "}
            Plese Select Cable Provider
          </Text>
          <VStack width={"full"} gap={"10px"}>
            {merchants.length > 0
              ? merchants.map((provider, id) => {
                  return (
                    <ProviderCard
                      key={id}
                      action={() => {
                        setPage("buy");
                        setMerchantId(provider.id);
                        setMerchantName(provider.name);
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
        <CableForm
          onClose={props.action}
          name={merchantName}
          cable={merchantId}
          back={() => setPage("list")}
        />
      )}
    </>
  );
};
const CableForm = (props) => {
  const { userWallets, walletsLoading } = useWallets();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const [isLoading, setIsLoading] = useState(walletsLoading);
  const [plans, setPlans] = useState([]);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [nairaAmount, setNairaAmount] = useState();
  const [tokenToNairaRate, setTokenToNairaRate] = useState(0);
  const [currency, setCurrency] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);

  const handlePlanChange = (e) => {
    const nairaAmount = parseInt(e.target.value.split(",")[1]);
    setNairaAmount(parseInt(e.target.value.split(",")[1]));
    setTokenAmount(tokenToNairaRate * nairaAmount);
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

    setTokenAmount(rate * nairaAmount);
  };
  const fetchDataPlans = async () => {
    setIsLoading(true);
    await axios
      .get(
        `${process.env.REACT_APP_BASE_URL}utilities/v2/get-bill-category?bill-type=cable`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setPlans(
          response.data.data.filter((plan) => {
            return plan.biller_code === props.cable;
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
  const buyCable = async (data) => {
    data.country = "NG";
    data.bill_type = data.plan.split(",")[0];
    data.amount = data.plan.split(",")[1];
    delete data.plan;
    console.log(data);
    //
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
          toast({ title: response.data.message, status: "success" });
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
  useEffect(() => {
    fetchDataPlans();

    // fetchPlans();
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
            Subscribe For {props.name}
          </Text>
        </HStack>
      </HStack>
      <form style={{ width: "100%" }} onSubmit={handleSubmit(buyCable)}>
        <VStack width={"full"} gap={"20px"}>
          <FormControl>
            <FormLabel>Select Cable Plan</FormLabel>
            <Select
              fontSize={"16px"}
              {...register("plan", { onChange: handlePlanChange })}
              required
            >
              <option>Choose Plan</option>;
              {plans.map((plan, index) => {
                return (
                  <option value={[plan.biller_name, plan.amount]} key={index}>
                    {plan.biller_name} {plan.validity} (N{plan.amount})
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
          </FormControl>
          <FormControl>
            <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
              Smart Card Number
            </FormLabel>

            <Input
              fontSize={"16px"}
              border={"1px solid #f9f9f9"}
              outline={"none"}
              required
              name="customer"
              {...register("customer")}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize={"sm"} color={"blackAlpha.700"}>
              Pay with: Select Wallet
            </FormLabel>

            <Select
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

export default Cable;
