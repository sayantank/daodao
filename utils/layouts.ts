import { PublicKey } from "@solana/web3.js";
import { Blob, Layout, struct } from "@solana/buffer-layout";
import BN from "bn.js";

class WrappedLayout<T, U> extends Layout<U> {
  layout: Layout<T>;
  decoder: (data: T) => U;
  encoder: (src: U) => T;

  constructor(
    layout: Layout<T>,
    decoder: (data: T) => U,
    encoder: (src: U) => T,
    property?: string
  ) {
    super(layout.span, property);
    this.layout = layout;
    this.decoder = decoder;
    this.encoder = encoder;
  }

  decode(b: Buffer, offset?: number): U {
    return this.decoder(this.layout.decode(b, offset));
  }

  encode(src: U, b: Buffer, offset?: number): number {
    return this.layout.encode(this.encoder(src), b, offset);
  }

  getSpan(b: Buffer, offset?: number): number {
    return this.layout.getSpan(b, offset);
  }
}

export function blob(length: number, property?: string): Layout<Buffer> {
  return new WrappedLayout(
    new Blob(length),
    (a: Uint8Array) => Buffer.from(a),
    (b: Buffer) => Uint8Array.from(b),
    property
  );
}

export function uint64(property?: string): Layout<u64 | null> {
  return new WrappedLayout(
    blob(8),
    (b: Buffer) => u64.fromBuffer(b),
    (n: u64) => n.toBuffer(),
    property
  );
}

export function publicKey(property?: string): Layout<PublicKey> {
  return new WrappedLayout(
    blob(32),
    (b: Buffer) => new PublicKey(b),
    (key: PublicKey) => key.toBuffer(),
    property
  );
}

export class u64 extends BN {
  /**
   * Convert to Buffer representation
   */
  toBuffer(): Buffer {
    const a = super.toArray().reverse();
    const b = Buffer.from(a);
    if (b.length === 8) {
      return b;
    }
    if (b.length >= 8) {
      throw new Error("u64 too large");
    }

    const zeroPad = Buffer.alloc(8);
    b.copy(zeroPad);
    return zeroPad;
  }

  /**
   * Construct a u64 from Buffer representation
   */
  static fromBuffer(buffer: Buffer): u64 {
    if (buffer.length !== 8) {
      throw new Error(`Invalid buffer length: ${buffer.length}`);
    }
    return new u64(
      [...buffer]
        .reverse()
        .map((i) => `00${i.toString(16)}`.slice(-2))
        .join(""),
      16
    );
  }
}

type TokenLayout = {
  mint: PublicKey;
  authority: PublicKey;
  amount: u64 | null;
  padding: Buffer;
};
export const TOKEN_ACCOUNT_LAYOUT = struct<TokenLayout>([
  publicKey("mint"),
  publicKey("authority"),
  uint64("amount"),
  blob(93, "padding"),
]);
