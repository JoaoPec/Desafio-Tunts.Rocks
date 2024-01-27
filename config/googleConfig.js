// config/googleConfig.js
import { google } from 'googleapis';

const spreadsheetId = "15Y_fvNQo8cBjvlRablHkW8boldKX5MbkOqRBd4ldC2k";

export async function getGoogleClient() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "config/credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    return await auth.getClient();
}

export function getGoogleSheetsClient(auth) {
    return google.sheets({ version: "v4", auth });
}

export function getSpreadsheetId() {
    return spreadsheetId;
}

