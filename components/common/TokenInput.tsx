import { MintMeta } from "@lib";
import { BN_ZERO } from "@solana/spl-governance";
import { tokenAtomicsToDecimal, tokenDecimalsToAtomics } from "@utils/token";
import BN from "bn.js";
import { useEffect, useState } from "react";

type TokenInputProps = {
  value: BN;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (...event: any[]) => void;
  balance?: BN;
  onMax: () => void;
  mint: MintMeta;
  label?: string;
};
export default function TokenInput({
  value,
  onChange,
  balance,
  onMax,
  mint,
  label = "Amount",
}: TokenInputProps) {
  const [decimalValue, setDecimalValue] = useState(
    tokenAtomicsToDecimal(value, mint.decimals).toString()
  );

  useEffect(() => {
    setDecimalValue(tokenAtomicsToDecimal(value, mint.decimals).toString());
  }, [value, mint]);

  if (!balance) return null;

  return (
    <div className="rounded-md overflow-hidden">
      <div className="flex w-full items-center justify-between text-slate-400 mb-0.5">
        <p className="block text-sm font-medium text-slate-400">{label}</p>
        <p className="text-xs">
          Balance:{" "}
          <span className="text-slate-300">
            {tokenAtomicsToDecimal(balance, mint.decimals)}
          </span>
        </p>
      </div>
      <div className="relative px-3 py-2 w-full border border-slate-600 bg-slate-700  text-slate-300 rounded-md flex space-x-2 items-center">
        <input
          type="text"
          value={decimalValue}
          onChange={(e) => {
            const targetValue = parseInt(e.target.value);

            if (isNaN(targetValue) || targetValue < 0) {
              onChange(BN_ZERO);
              setDecimalValue("0");
            } else {
              const amountBN = mint
                ? tokenDecimalsToAtomics(targetValue, mint?.decimals)
                : BN_ZERO;

              onChange(amountBN);
              setDecimalValue(targetValue.toString());
            }
          }}
          className="block w-full flex-1 bg-transparent  placeholder-gray-500 focus:ring-0 text-lg focus:outline-none focus:ring-none  sm:text-sm"
        />
        <button
          disabled={!balance}
          onClick={onMax}
          className="px-2 py-0.5 text-sm  bg-slate-500 rounded-lg hover:bg-slate-600 hover:text-slate-400 transition-colors"
        >
          MAX
        </button>
      </div>
    </div>
  );
}
