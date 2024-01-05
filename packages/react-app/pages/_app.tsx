import { Alfajores, Celo } from "@celo/rainbowkit-celo/chains";
import celoGroups from "@celo/rainbowkit-celo/lists";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../Theme";
import logo from "../public/assets/logo-inline-transparent.png";
import WidgetContainer from "@/components/WidgetContainer";
const projectId = process.env.NEXT_PUBLIC_WC_ID as string;
const { chains, publicClient } = configureChains(
  [Celo, Alfajores],
  [publicProvider()]
);

// const connectors = [new InjectedConnector({ chains })];

const connectors = celoGroups({ chains, projectId });

const appInfo = {
  appName: "Celo Composer",
};

const wagmiConfig = createConfig({
  connectors,
  publicClient: publicClient,
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} appInfo={appInfo} coolMode={true}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default App;
