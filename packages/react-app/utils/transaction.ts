import { ethers, Contract, BrowserProvider, parseEther } from "ethers";

const CUSD_ADDRESS = "0x765de816845861e75a25fca122bb6898b8b1282a";

export const transferCUSD = async (
  address: string,
  userAddress: string,
  amount: string
) => {
  if (window.ethereum) {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(userAddress);

    let abi = ["function transfer (addres to, unit256 value)"];
    let CUSDContract = new Contract(CUSD_ADDRESS, abi, signer);
    let txn = await CUSDContract.transfer(address, parseEther(amount));
    let receipt = await txn;
  }
};
