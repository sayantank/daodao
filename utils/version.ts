import {
  BN_ZERO,
  GovernanceAccountParser,
  PROGRAM_VERSION,
  PROGRAM_VERSION_V1,
  ProgramAccount,
  ProgramMetadata,
  getProgramDataAccount,
  getProgramMetadataAddress,
  parseVersion,
  withUpdateProgramMetadata,
} from "@solana/spl-governance";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import BN from "bn.js";

// Workaround for issue regarding simulateTransaction of spl-governance
export async function getGovernanceProgramVersion(
  connection: Connection,
  programId: PublicKey,
  env?: string
) {
  // Try get program metadata
  const programMetadataPk = await getProgramMetadataAddress(programId);
  try {
    const programMetadataInfo = await connection.getAccountInfo(
      programMetadataPk
    );

    // If ProgramMetadata exists then use it to get latest updated version
    if (programMetadataInfo) {
      const programMetadata = GovernanceAccountParser(ProgramMetadata)(
        programMetadataPk,
        programMetadataInfo
      ) as ProgramAccount<ProgramMetadata>;

      let deploySlot = BN_ZERO;

      try {
        const programData = await getProgramDataAccount(
          connection,
          new PublicKey(programId)
        );
        deploySlot = new BN(programData.slot);
      } catch {
        // If the program is not upgradable for example on localnet then there is no ProgramData account
        // and Metadata must be more recent
      }

      // Check if ProgramMetadata is not stale
      if (programMetadata.account.updatedAt.gte(deploySlot)) {
        const version = parseVersion(programMetadata.account.version);
        console.log("Program version (metadata)", version);
        return version.major;
      }
    }
  } catch {
    console.error(`Failed to get programMetadata`);
    // nop, let's try simulation
  }

  try {
    // If we don't have the programMetadata info then simulate UpdateProgramMetadata
    const instructions: TransactionInstruction[] = [];
    // The wallet can be any existing account for the simulation
    // Note: when running a local validator ensure the account is copied from devnet: --clone ENmcpFCpxN1CqyUjuog9yyUVfdXBKF3LVCwLr7grJZpk -ud
    const walletPk = new PublicKey(
      "ENmcpFCpxN1CqyUjuog9yyUVfdXBKF3LVCwLr7grJZpk"
    );

    await withUpdateProgramMetadata(instructions, programId, 3, walletPk);

    const transaction = new Transaction({ feePayer: walletPk });
    transaction.add(...instructions);

    // TODO: Once return values are supported change the simulation call to the actual one
    const getVersion = await connection.simulateTransaction(transaction);

    if (getVersion.value.logs) {
      const prefix = 'PROGRAM-VERSION:"';

      const simVersion = getVersion.value.logs
        .filter((l) => l.includes(prefix))
        .map((l) => {
          const versionStart = l.indexOf(prefix);

          return parseVersion(
            l.substring(versionStart + prefix.length, l.length - 1)
          );
        })[0];

      if (simVersion) {
        console.log("Program version (simulation)", simVersion);
        return simVersion.major;
      }
    }
  } catch (ex) {
    console.error("Can't determine program version\n", ex);
  }

  // If we can't determine the version using the program instance and running localnet then use the latest version
  if (env === "localnet") {
    return PROGRAM_VERSION;
  }

  // Default to V1 which doesn't support ProgramMetadata
  console.log("Program version (default)", PROGRAM_VERSION_V1);
  return PROGRAM_VERSION_V1;
}
