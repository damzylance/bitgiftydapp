import React, { ReactNode, useState } from "react";
import {
  Container,
  Grid,
  GridItem,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  MdConnectedTv,
  MdElectricBolt,
  MdPhoneCallback,
  MdPhoneInTalk,
  MdWifiTethering,
} from "react-icons/md";
import Airtime from "./Airtime/Airtime";
import { UtilityCard } from "./UtilityCard";
import { UtilityModal } from "./UtilityModal";
import Link from "next/link";
import { ChevronRightIcon } from "@chakra-ui/icons";

const Utility = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [type, setType] = useState("");
  return (
    <Container>
      <Text textAlign={"center"} fontWeight={"500"} mb={"20px"}>
        Bills Payment
      </Text>
      <Grid
        width={"full"}
        templateColumns="repeat(2, 1fr)"
        borderRadius={"12px"}
        gap={"20px"}
        justifyItems={"center"}
        alignItems={"center"}
      >
        <UtilityCard
          icon={<MdPhoneInTalk />}
          text={"Airtime"}
          action={() => {
            setType("airtime");
            onOpen();
          }}
        />
        <UtilityCard
          icon={<MdWifiTethering />}
          text={"Data"}
          action={() => {
            setType("data");
            onOpen();
          }}
        />
        <UtilityCard
          icon={<MdElectricBolt />}
          text={"Electricity"}
          action={() => {
            setType("electricity");
            onOpen();
          }}
        />
        <UtilityCard
          icon={<MdConnectedTv />}
          text={"Cable"}
          action={() => {
            setType("cable");
            onOpen();
          }}
        />
      </Grid>
      <Link href={"/transaction-history"}>
        <HStack width={"full"} justifyContent={"center"} mt={"40px"}>
          <Text fontSize={"sm"}>Transaction History</Text>
          <ChevronRightIcon fontSize={"lg"} />
        </HStack>
      </Link>
      <UtilityModal type={type} isOpen={isOpen} onClose={onClose} />
    </Container>
  );
};

export default Utility;
