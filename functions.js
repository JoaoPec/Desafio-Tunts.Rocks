import { getGoogleClient, getGoogleSheetsClient, getSpreadsheetId } from './config/googleConfig.js';

const googleClient = await getGoogleClient();
const googleSheets = await getGoogleSheetsClient(googleClient);
const spreadsheetId = await getSpreadsheetId();

const sheet = "engenharia_de_software";

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

export async function updateSituation(value, row) {
    try {
        const updateSituation = await googleSheets.spreadsheets.values.update({
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

export async function updateFinalGrade(value, row) {
    try {
        const updateFinalGrade = await googleSheets.spreadsheets.values.update({
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

export function calculateFinalGrade(media, naf) {
    return (Math.ceil((media + naf) / 2)) * -1;
}

