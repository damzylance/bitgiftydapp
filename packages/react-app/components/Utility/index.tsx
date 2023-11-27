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
import Airtime from "./Airtime";
import Data from "./Data";
import Cable from "./Cable";
import Electricity from "./Electricity";
const Utility = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [type, setType] = useState("");
  return (
    <Container mt={"40px"}>
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
      <UtilityModal type={type} isOpen={isOpen} onClose={onClose} />
    </Container>
  );
};

const UtilityCard = (props) => {
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
const UtilityModal = (props) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <VStack width={"full"}>
            {" "}
            {props.type === "airtime" && <Airtime action={props.onClose} />}
            {props.type === "data" && <Data action={props.onClose} />}
            {props.type === "electricity" && (
              <Electricity action={props.onClose} />
            )}
            {props.type === "cable" && <Cable action={props.onClose} />}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Utility;
