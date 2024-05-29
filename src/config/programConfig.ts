import { Connection, clusterApiUrl } from "@solana/web3.js";

export const AdminAuthor = "Cy66eHC9PcTb9wqwU77vyVievDyzYSwdbFkysDKkBYii";
export const SplToken = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

/**
 * for @sfc token
 * 1 @sfc = 10.000 VND
 */
export const MintAddress = "4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ";
export const SFCprice = 10000;

// mint address of LP token 
export const MintAddressLP = "8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He";

/**
 * for @devnet
 */
const clusterDevnet = clusterApiUrl("devnet");
const endpointV1 = "https://maximum-palpable-resonance.solana-devnet.quiknode.pro/691084705823256b845996216508e2cc05a82d62/";
const endpointV2 = "https://late-powerful-wish.solana-devnet.quiknode.pro/5f5c1cb330ba871d292f49cd0d4df60b5b9d7232";
export const ProgramId = "F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX";
export const connection = new Connection(clusterDevnet, { commitment: "confirmed" });

/**
 * for @localnet
 */
// export const ProgramId = "DKPreu6SebHaxEWXDEvoX5vXc1wkWEjorvRba1HMrGXc";
// export const connection = new Connection("http://127.0.0.1:8899", "finalized");