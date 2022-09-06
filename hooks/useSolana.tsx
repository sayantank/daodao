import { useContext } from "react";
import { SolanaContext } from "@contexts/SolanaContext";

export const useSolana = () => {
  const solana = useContext(SolanaContext);

  if (!solana)
    throw new Error("Make sure you wrap your component with SolanaProvider");

  return solana;
};
