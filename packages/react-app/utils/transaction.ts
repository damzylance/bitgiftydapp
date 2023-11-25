import { ethers, Contract, BrowserProvider, parseEther } from "ethers";

const CUSD_ADDRESS = "0x765de816845861e75a25fca122bb6898b8b1282a";

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
        console.log(error);
        return error;
      });

    let abi = ["function transfer(address to, uint256 value)"];

    let CUSDContract = new Contract(CUSD_ADDRESS, abi, signer);
    let txn = await CUSDContract.transfer(address, parseEther(amount))
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    let receipt = await txn;
    return txn;
  }
};
