// This module handles the configuration related to Google Sheets API.

// Importing the 'google' module from the 'googleapis' package.
import { google } from 'googleapis';

// The ID of the target Google Sheets document.
const spreadsheetId = "15Y_fvNQo8cBjvlRablHkW8boldKX5MbkOqRBd4ldC2k";

/**
 * Gets the Google Sheets API client.
 * @returns {Promise} A promise that resolves to the Google Sheets API client.
 */
export async function getGoogleClient() {
    // Configuring Google Auth using credentials from 'config/credentials.json'.
    const auth = new google.auth.GoogleAuth({
        keyFile: "config/credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    // Returning the Google Sheets API client.
    return await auth.getClient();
}

/**
 * Gets the Google Sheets client using the provided authentication.
 * @param {Object} auth - The authentication object.
 * @returns {Object} The Google Sheets client.
 */
export function getGoogleSheetsClient(auth) {
    // Creating and returning the Google Sheets client with the specified version and authentication.
    return google.sheets({ version: "v4", auth });
}

/**
 * Gets the ID of the target spreadsheet.
 * @returns {string} The spreadsheet ID.
 */
export function getSpreadsheetId() {
    // Returning the predefined spreadsheet ID.
    return spreadsheetId;
}