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
import React, { useEffect, useState } from "react";
import { ProviderCard } from "./Airtime";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import axios from "axios";

const Electricity = (props) => {
  const [page, setPage] = useState("list");
  const [merchants, setMerchants] = useState([
    { name: "IKEDC PREPAID", id: "BIL113" },
    { name: "EKEDC PREPAID TOPUP", id: "BIL112" },
    {
      name: "ABUJA DISCO Prepaid",
      id: "BIL204",
    },
    {
      name: "IBADAN DISCO ELECTRICITY PREPAID",
      id: "BIL114",
    },
    { name: "KANO DISCO PREPAID TOPUP", id: "BIL120" },

    {
      name: "KADUNA PREPAID",
      id: "BIL119",
    },
  ]);

  const [merchantName, setMerchantName] = useState(null);
  const [merchantId, setMerchantId] = useState(null);
  return (
    <>
      {page === "list" && (
        <VStack width={"full"} gap={"40px"} my={"40px"}>
          <Text fontSize={"2xl"} textAlign={"center"}>
            {" "}
            Plese Select Your Disco
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
                      logo={"/assets/images/idea.png"}
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
          disco={merchantId}
          back={() => setPage("list")}
        />
      )}
    </>
  );
};
const CableForm = (props) => {
  const { userWallets } = useWallets();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [nairaAmount, setNairaAmount] = useState();
  const [tokenToNairaRate, setTokenToNairaRate] = useState(0);
  const [currency, setCurrency] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);

  //   const handlePlanChange = (e) => {
  //     const nairaAmount = parseInt(e.target.value.split(",")[1]);
  //     setNairaAmount(parseInt(e.target.value.split(",")[1]));
  //     setTokenAmount(tokenToNairaRate * nairaAmount);
  //   };
  const handleAmountChange = (e) => {
    const tempNairaAmount = e.target.value;
    setNairaAmount(tempNairaAmount);
    if (currency === "usdt_tron" || currency === "cusd") {
      setTokenAmount(tempNairaAmount / tokenToNairaRate);
    } else {
      setTokenAmount(tokenToNairaRate * tempNairaAmount);
    }
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
    data.bill_type = props.name;
    data.country = "NG";

    // data.wallet_from = data.wallet_from.toLowerCase();
    // data.token_amount = data.data.split(",")[1];

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
          console.log(response.data);
          setIsLoading(false);
          toast({
            title: "Purchase successful",
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
  // useEffect(() => {
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
      <form style={{ width: "100%" }} onSubmit={handleSubmit(buyCable)}>
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
              name="customer"
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

export default Electricity;
