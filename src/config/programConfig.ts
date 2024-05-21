import { Connection, clusterApiUrl } from "@solana/web3.js";


export const AdminAuthor = "Cy66eHC9PcTb9wqwU77vyVievDyzYSwdbFkysDKkBYii";
export const SplToken = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
/**
 * for @sfc token
 * 1 @sfc = 10.000 VND
 */
export const MintAddress = "4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ";
export const SFCprice = 10000;
/**
 * for @devnet
 */
export const ProgramId = "F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX";
export const connection = new Connection(clusterApiUrl('devnet'), "finalized");

/**
 * for @localnet
 */
// export const ProgramId = "DKPreu6SebHaxEWXDEvoX5vXc1wkWEjorvRba1HMrGXc";
// export const connection = new Connection("http://127.0.0.1:8899", "finalized");