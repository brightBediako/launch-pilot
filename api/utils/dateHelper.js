import { formatInTimeZone, toZonedTime, fromZonedTime } from "date-fns-tz";
import { format, addDays, subDays, startOfDay, endOfDay } from "date-fns";

// Default African timezones
export const TIMEZONES = {
  LAGOS: "Africa/Lagos", // GMT+1 (Nigeria)
  ACCRA: "Africa/Accra", // GMT+0 (Ghana)
  NAIROBI: "Africa/Nairobi", // GMT+3 (Kenya)
  UTC: "UTC",
};

/**
 * Convert date to user's timezone
 * @param {Date|string} date - Date to convert
 * @param {string} timezone - Target timezone (default: Africa/Lagos)
 * @returns {Date} Converted date
 */
export const toUserTimezone = (date, timezone = TIMEZONES.LAGOS) => {
  return toZonedTime(date, timezone);
};

/**
 * Convert date from user's timezone to UTC
 * @param {Date|string} date - Date in user's timezone
 * @param {string} timezone - Source timezone
 * @returns {Date} UTC date
 */
export const toUTC = (date, timezone = TIMEZONES.LAGOS) => {
  return fromZonedTime(date, timezone);
};

/**
 * Format date in user's timezone
 * @param {Date|string} date - Date to format
 * @param {string} formatStr - Format string (date-fns format)
 * @param {string} timezone - Target timezone
 * @returns {string} Formatted date string
 */
export const formatInUserTimezone = (
  date,
  formatStr = "PPpp",
  timezone = TIMEZONES.LAGOS
) => {
  return formatInTimeZone(date, timezone, formatStr);
};

/**
 * Get start of day in user's timezone
 * @param {Date|string} date - Date
 * @param {string} timezone - Timezone
 * @returns {Date} Start of day in UTC
 */
export const getStartOfDay = (date, timezone = TIMEZONES.LAGOS) => {
  const zonedDate = toUserTimezone(date, timezone);
  const startDate = startOfDay(zonedDate);
  return toUTC(startDate, timezone);
};

/**
 * Get end of day in user's timezone
 * @param {Date|string} date - Date
 * @param {string} timezone - Timezone
 * @returns {Date} End of day in UTC
 */
export const getEndOfDay = (date, timezone = TIMEZONES.LAGOS) => {
  const zonedDate = toUserTimezone(date, timezone);
  const endDate = endOfDay(zonedDate);
  return toUTC(endDate, timezone);
};

/**
 * Add days to date in user's timezone
 * @param {Date|string} date - Starting date
 * @param {number} days - Number of days to add
 * @param {string} timezone - Timezone
 * @returns {Date} New date in UTC
 */
export const addDaysInTimezone = (date, days, timezone = TIMEZONES.LAGOS) => {
  const zonedDate = toUserTimezone(date, timezone);
  const newDate = addDays(zonedDate, days);
  return toUTC(newDate, timezone);
};

/**
 * Get current time in user's timezone
 * @param {string} timezone - Timezone
 * @returns {Date} Current time
 */
export const getCurrentTimeInTimezone = (timezone = TIMEZONES.LAGOS) => {
  return toUserTimezone(new Date(), timezone);
};

export default {
  TIMEZONES,
  toUserTimezone,
  toUTC,
  formatInUserTimezone,
  getStartOfDay,
  getEndOfDay,
  addDaysInTimezone,
  getCurrentTimeInTimezone,
};
