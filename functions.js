// This module contains functions for interacting with Google Sheets.

// Importing necessary functions from the googleConfig module.
import { getGoogleClient, getGoogleSheetsClient, getSpreadsheetId } from './config/googleConfig.js';

// Initializing Google Sheets client and spreadsheet information.
const googleClient = await getGoogleClient();
const googleSheets = await getGoogleSheetsClient(googleClient);
const spreadsheetId = await getSpreadsheetId();

// Specifying the target sheet in the spreadsheet.
const sheet = "engenharia_de_software";

/**
 * Retrieves rows from the Google Sheets document.
 * @returns {Array} An array of rows from the specified sheet.
 */
export async function getRows() {
    try {
        const metaData = await googleSheets.spreadsheets.values.get({
            auth: googleClient,
            spreadsheetId,
            range: `${sheet}!A4:H35`
        });

        return metaData.data.values;

    } catch (err) {
        console.log(err);
        return [];
    }
}

/**
 * Updates the "Situation" column in the Google Sheets document.
 * @param {string} value - The new value for the "Situation" column.
 * @param {number} row - The row number to update.
 */
export async function updateSituation(value, row) {
    try {
        await googleSheets.spreadsheets.values.update({
            auth: googleClient,
            spreadsheetId,
            range: `${sheet}!G${row}`,
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[value]]
            }
        });
    } catch (err) {
        console.log(err);
    }
}

/**
 * Updates the "Final Grade" column in the Google Sheets document.
 * @param {number} value - The new value for the "Final Grade" column.
 * @param {number} row - The row number to update.
 */
export async function updateFinalGrade(value, row) {
    try {
        await googleSheets.spreadsheets.values.update({
            auth: googleClient,
            spreadsheetId,
            range: `${sheet}!H${row}`,
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[value]]
            }
        });
    } catch (err) {
        console.log(err);
    }
}

/**
 * Calculates the final grade based on the average and the NAF (Nota de Aproveitamento Final).
 * @param {number} average - The average of the student's exam scores.
 * @param {number} naf - The NAF value.
 * @returns {number} The calculated final grade.
 */
export function calculateFinalGrade(average, naf) {
    return (Math.ceil((average + naf) / 2)) * -1;
}
