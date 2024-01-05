import axios from "axios";
import { ethers, Contract, BrowserProvider, parseEther } from "ethers";

const CUSD_ADDRESS = process.env.NEXT_PUBLIC_SC as string;
const CEUR_ADDRESS = "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F";

//Generate and send giftcard

// interface MyObject {
//   amount: string;
//   receipent_email: string;
//   address: string;
//   note: string;
//   image: string;
// }

export const sendGiftCard = async (data: any) => {
  console.log(data);
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}create-giftcard/`,
      data
    );
    console.log(response.data);
    return response;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
};
export const buyAirtime = async (data: any) => {
  console.log(data);
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}create-bill-transaction/`,
      data
    );
    console.log(response.data);
    return response;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
};
export const buyElectricity = () => {
  console.log("electricity");
};
// Transfer cusd

export const transferCUSD = async (userAddress: string, amount: string) => {
  if (window.ethereum) {
    console.log(parseEther(amount));
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider
      .getSigner(userAddress)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("signer", error);
        return error;
      });

    let abi = ["function transfer(address to, uint256 value)"];

    let CUSDContract = new Contract(CEUR_ADDRESS, abi, signer);
    let txn = await CUSDContract.transfer(
      process.env.NEXT_PUBLIC_MW,
      parseEther(amount)
    )
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
    let receipt = await txn;
    return receipt;
  }
};
