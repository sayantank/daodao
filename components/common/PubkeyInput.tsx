import { PublicKey } from "@solana/web3.js";
import { ChangeEventHandler, useCallback, useState } from "react";

type PubkeyInputProps = {
  value: PublicKey | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (...event: any[]) => void;
};

export default function PubkeyInput({ onChange }: PubkeyInputProps) {
  const [pubkeyString, setPubkeyString] = useState("");

  const changeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      try {
        const pubkey = new PublicKey(e.target.value);
        onChange(pubkey);
      } catch (e) {
        onChange(null);
      }
      setPubkeyString(e.target.value);
    },
    [onChange]
  );

  // TODO: Figure out debouncing
  // const debouncedChangeHandler = useMemo(
  //   () => debounce(changeHandler, 500),
  //   [changeHandler]
  // );

  // useEffect(() => {
  //   return () => {
  //     debouncedChangeHandler.cancel();
  //   }
  // }, [debouncedChangeHandler]);

  return (
    <div className="relative px-3 py-2 w-full border border-slate-600 bg-slate-700  text-slate-300 rounded-md flex space-x-2 items-center">
      <input
        type="text"
        value={pubkeyString}
        onChange={changeHandler}
        className="block w-full flex-1 bg-transparent  placeholder-gray-500 focus:ring-0 focus:outline-none focus:ring-none sm:text-sm"
      />
    </div>
  );
}
