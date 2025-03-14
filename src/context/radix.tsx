import { createContext, useContext, ReactNode, useState, useEffect } from "react";

import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
import {
  RadixDappToolkit,
  RadixNetwork,
  Logger,
  DataRequestBuilder,
  generateRolaChallenge,
} from "@radixdlt/radix-dapp-toolkit";

const logger = Logger();
const dAppDefinitionAddress = import.meta.env.VITE_DAPP_DEFINITION_ADDRESS;
const networkId = RadixNetwork.Stokenet;

// Lazy initialization to prevent SSR errors
let dAppToolkitInstance: RadixDappToolkit | null = null;


// Define the type for the context
interface RadixianContextType {
  dAppToolkit?: RadixDappToolkit,
  gatewayApi?: GatewayApiClient,
}


// Create the context with an initial value
const RadixianContext: React.Context<RadixianContextType | undefined> = createContext<RadixianContextType | undefined>(undefined);

const RadixianProvider = ({ children }: { children: ReactNode }) => {
  const [dAppToolkit, setDAppToolkit] = useState<RadixDappToolkit>();
  const [gatewayApi, setGatewayApi] = useState<GatewayApiClient>();

  useEffect(() => {
    if (typeof window !== "undefined" && !dAppToolkitInstance) {
      const toolkit = RadixDappToolkit({
        dAppDefinitionAddress,
        networkId,
        logger,
      });

      toolkit.walletApi.provideChallengeGenerator(async () =>
        generateRolaChallenge()
      );

      toolkit.walletApi.setRequestData(
        DataRequestBuilder.persona().withProof(),
        DataRequestBuilder.accounts().atLeast(1)
      );

      const gateway = GatewayApiClient.initialize(
        toolkit.gatewayApi.clientConfig
      );

      dAppToolkitInstance = toolkit;
      setDAppToolkit(toolkit);
      setGatewayApi(gateway);
    }
  }, []);

  return (
    <RadixianContext.Provider
      value={{
        dAppToolkit,
        gatewayApi,
      }}
    >
      {children}
    </RadixianContext.Provider>
  )
};

// Custom hook to use the Radixian context
export const useRadixian = () => {
  const context = useContext(RadixianContext);
  // Throw an error if the hook is used outside of a RadixianProvider
  if (!context) {
    throw new Error("Radixian must be used within a RadixianProvider");
  }
  return context;
};

export default RadixianProvider