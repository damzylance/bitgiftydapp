import WidgetContainer from "@/components/WidgetContainer";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Create from "@/components/giftcard/create";

export default function Home({}) {
  const [userAddress, setUserAddress] = useState("");
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);

  return (
    <WidgetContainer>
      <Create />
      <div className="flex flex-col justify-center items-center">
        <div className="h1">
          There you go... a canvas for your next Celo project!
        </div>
        {isConnected && (
          <div className="h2 text-center">Your address: {userAddress}</div>
        )}
      </div>
    </WidgetContainer>
  );
}
