import { ethers } from "ethers";
import { addresses, EPOCH_INTERVAL, BLOCK_RATE_SECONDS, BONDS } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as PairContract } from "../abi/PairContract.json";
import { abi as BondOhmDaiContract } from "../abi/klimadao/contracts/KlimaBondDepository_Regular.json";
import { abi as BondDaiContract } from "../abi/klimadao/contracts/KlimaBondDepository_Regular.json";
import { abi as ReserveOhmDaiContract } from "../abi/reserves/OhmDai.json";
import { abi as BondContract } from "../abi/BondContract.json";
import { abi as DaiBondContract } from "../abi/DaiBondContract.json";

export { default as Transactor } from "./Transactor";

export function isBondLP(bond) {
  return bond.indexOf("_lp") >= 0;
}

export function lpURL(bond) {
  if (bond === BONDS.ohm_dai) {
    return "https://analytics.sushi.com/pairs/0x34d7d7aaf50ad4944b70b320acb24c95fa2def7c";
  }
}

export function contractForBond({ bond, networkID, provider }) {
  if (bond === BONDS.ohm_dai) {
    return new ethers.Contract(addresses[networkID].BONDS.OHM_DAI, BondOhmDaiContract, provider);
  }
  if (bond === BONDS.dai) {
    return new ethers.Contract(addresses[networkID].BONDS.DAI, BondDaiContract, provider);
  }
  if (bond === BONDS.ohm_dai_v1) {
    return new ethers.Contract(addresses[networkID].BOND_ADDRESS, BondContract, provider);
  }
  if (bond === BONDS.dai_v1) {
    return new ethers.Contract(addresses[networkID].DAI_BOND_ADDRESS, DaiBondContract, provider);
  }
  if (bond === BONDS.bct_usdc) {
    return new ethers.Contract(addresses[networkID].BONDS.BCT_USDC, BondOhmDaiContract, provider);
  }
}

export function contractForReserve({ bond, networkID, provider }) {
  if (bond === BONDS.ohm_dai) {
    return new ethers.Contract(addresses[networkID].RESERVES.OHM_DAI, ReserveOhmDaiContract, provider);
  }
  if (bond === BONDS.dai) {
    return new ethers.Contract(addresses[networkID].RESERVES.DAI, ierc20Abi, provider);
  }
  if (bond === BONDS.bct_usdc) {
    return new ethers.Contract(addresses[networkID].RESERVES.BCT_USDC, ReserveOhmDaiContract, provider);
  }
}

export async function getMarketPrice({ provider }) {
  const pairContract = new ethers.Contract("0x9803c7ae526049210a1725f7487af26fe2c24614", PairContract, provider);
  let reserves;
  try {
    reserves = await pairContract.getReserves();
    const marketPrice = reserves[0] / reserves[1];

    // commit('set', { marketPrice: marketPrice / Math.pow(10, 9) });
    return marketPrice;
  } catch (e) {
    console.log("Error caught in getMarketPrice:", e.message);
  }
}

export function shorten(str) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function trim(number, precision) {
  if (number == undefined) {
    number = 0;
  }
  const array = number.toString().split(".");
  if (array.length === 1) return number.toString();

  array.push(array.pop().substring(0, precision));
  const trimmedNumber = array.join(".");
  return trimmedNumber;
}

/**
 * @param {string} str
 * @param {number} precision
 * @returns {string} trimmed string
 * @example trimStringDecimals("0.12345", 2); // "0.12"
 */
export const trimStringDecimals = (str, precision) => {
  if (!str || !str.includes(".")) {
    return str;
  }
  const [integer, decimals] = str.split(".");
  if (decimals.length <= precision) {
    return str;
  }
  return `${integer}.${decimals.slice(0, precision)}`;
};

/** Returns localized string */
export const trimWithPlaceholder = (number, precision) => {
  if (typeof number === "undefined" || Number.isNaN(number)) {
    return "Loading... ";
  }
  return Number(number).toLocaleString(undefined, { maximumFractionDigits: precision });
};

export function getRebaseBlock(currentBlock) {
  return currentBlock + EPOCH_INTERVAL - (currentBlock % EPOCH_INTERVAL);
}

export function secondsUntilBlock(startBlock, endBlock) {
  if (startBlock % EPOCH_INTERVAL === 0) {
    return 0;
  }

  const blocksAway = endBlock - startBlock;
  const secondsAway = blocksAway * BLOCK_RATE_SECONDS;

  return secondsAway;
}

export function prettyVestingPeriod(currentBlock, vestingBlock) {
  if (vestingBlock === 0) {
    return "";
  }

  const seconds = secondsUntilBlock(currentBlock, vestingBlock);
  if (seconds < 0) {
    return "Fully Vested";
  }
  return prettifySeconds(seconds);
}

export function prettifySeconds(seconds, resolution) {
  if (seconds !== 0 && !seconds) {
    return "";
  }

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (resolution === "day") {
    return d + (d == 1 ? " day" : " days");
  }
  const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  const hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
  const mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") : "";

  return dDisplay + hDisplay + mDisplay;
}
