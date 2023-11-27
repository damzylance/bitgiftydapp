import { ethers, Contract, BrowserProvider, parseEther } from "ethers";

const CUSD_ADDRESS = process.env.NEXT_PUBLIC_MW as string;

//Generate and send giftcard

export const createGiftCard = async () => {};

// Transfer cusd

export const transferCUSD = async (
  address: string,
  userAddress: string,
  amount: string
) => {
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

    let CUSDContract = new Contract(CUSD_ADDRESS, abi, signer);
    let txn = await CUSDContract.transfer(address, parseEther(amount))
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
