/**
 * Currency formatting utilities for African markets
 */

const CURRENCIES = {
  NGN: {
    symbol: "₦",
    name: "Nigerian Naira",
    decimals: 2,
    smallestUnit: "kobo", // 100 kobo = 1 naira
  },
  GHS: {
    symbol: "GH₵",
    name: "Ghanaian Cedi",
    decimals: 2,
    smallestUnit: "pesewa", // 100 pesewa = 1 cedi
  },
  USD: {
    symbol: "$",
    name: "US Dollar",
    decimals: 2,
    smallestUnit: "cent",
  },
  KES: {
    symbol: "KSh",
    name: "Kenyan Shilling",
    decimals: 2,
    smallestUnit: "cent",
  },
  ZAR: {
    symbol: "R",
    name: "South African Rand",
    decimals: 2,
    smallestUnit: "cent",
  },
  EGP: {
    symbol: "E£",
    name: "Egyptian Pound",
    decimals: 2,
    smallestUnit: "piastre",
  },
};

/**
 * Format amount to display with currency symbol
 * @param {number} amount - Amount in smallest unit (kobo, pesewa, cents)
 * @param {string} currency - Currency code (NGN, GHS, USD, etc.)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = "NGN") => {
  const currencyInfo = CURRENCIES[currency] || CURRENCIES.NGN;
  const mainAmount = amount / Math.pow(10, currencyInfo.decimals);

  return `${currencyInfo.symbol}${mainAmount.toLocaleString("en-US", {
    minimumFractionDigits: currencyInfo.decimals,
    maximumFractionDigits: currencyInfo.decimals,
  })}`;
};

/**
 * Convert main unit to smallest unit (e.g., naira to kobo)
 * @param {number} amount - Amount in main unit
 * @param {string} currency - Currency code
 * @returns {number} Amount in smallest unit
 */
export const toSmallestUnit = (amount, currency = "NGN") => {
  const currencyInfo = CURRENCIES[currency] || CURRENCIES.NGN;
  return Math.round(amount * Math.pow(10, currencyInfo.decimals));
};

/**
 * Convert smallest unit to main unit (e.g., kobo to naira)
 * @param {number} amount - Amount in smallest unit
 * @param {string} currency - Currency code
 * @returns {number} Amount in main unit
 */
export const toMainUnit = (amount, currency = "NGN") => {
  const currencyInfo = CURRENCIES[currency] || CURRENCIES.NGN;
  return amount / Math.pow(10, currencyInfo.decimals);
};

/**
 * Get currency symbol
 * @param {string} currency - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currency = "NGN") => {
  return CURRENCIES[currency]?.symbol || "₦";
};

/**
 * Get currency info
 * @param {string} currency - Currency code
 * @returns {object} Currency information
 */
export const getCurrencyInfo = (currency = "NGN") => {
  return CURRENCIES[currency] || CURRENCIES.NGN;
};

/**
 * Validate currency amount
 * @param {number} amount - Amount to validate
 * @param {string} currency - Currency code
 * @returns {boolean} Valid or not
 */
export const isValidAmount = (amount, currency = "NGN") => {
  if (typeof amount !== "number" || amount < 0) return false;
  return true;
};

export default {
  CURRENCIES,
  formatCurrency,
  toSmallestUnit,
  toMainUnit,
  getCurrencySymbol,
  getCurrencyInfo,
  isValidAmount,
};
