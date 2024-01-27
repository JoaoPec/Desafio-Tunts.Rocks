import express from 'express';
import { google } from 'googleapis';
import { getGoogleClient, getGoogleSheetsClient, getSpreadsheetId } from './config/googleConfig.js';

const app = express();

const sheet = "engenharia_de_software";

// Declarando variáveis fora das funções
const googleClient = await getGoogleClient();
const googleSheets = await getGoogleSheetsClient(googleClient);
const spreadsheetId = await getSpreadsheetId();

app.get("/", async (req, res) => {
    try {
        const rows = await getRows("engenharia_de_software");

        let alunos = [];
        let situationPosition = 4;
        let finalGradePosition = 4;

        for (let i = 0; i < rows.length; i++) {
            const matricula = rows[i][0];
            const aluno = rows[i][1];
            const faltas = parseInt(rows[i][2], 10);
            const p1 = parseInt(rows[i][3], 10);
            const p2 = parseInt(rows[i][4], 10);
            const p3 = parseInt(rows[i][5], 10);

            let situation = "";
            let finalGrade = 0;
            let naf;

            const media = (p1 + p2 + p3) / 3;

            if (faltas > 15) {
                situation = "Reprovado por Falta";
            } else if (media >= 7) {
                situation = "Aprovado";
                naf = 0;
            } else if (5 <= media && media < 7) {
                situation = "Exame Final";
                naf = Math.ceil(2 * (5 - media));
            } else {
                situation = "Reprovado por Nota";
                naf = 0;
            }

            // Atualiza a situação na planilha
            await updateSituation(situation, situationPosition);

            // Calcula a nota final e atualiza na planilha
            finalGrade = calculateFinalGrade(media, naf);
            await updateFinalGrade(finalGrade, finalGradePosition);

            // Incrementa as posições
            situationPosition++;
            finalGradePosition++;

            alunos.push({
                matricula,
                aluno,
                faltas,
                p1,
                p2,
                p3,
                situation,
                finalGrade,
            });
        }


    } catch (err) {
        console.log(err);
        res.json([]);
    }


        res.json(alunos);
});

async function getRows() {
    try{

    const metaData = await googleSheets.spreadsheets.values.get({
        auth: googleClient,
        spreadsheetId,
        range: `${sheet}!A4:H27`
    });

    return metaData.data.values;

    }catch(err){
        console.log(err);
        return [];
    }
}

async function updateSituation(value, row) {
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

    console.log(updateSituation.data);

}catch(err){
    console.log(err);
}

}

async function updateFinalGrade(value,row){
    try {
        const updateFinalGrade = await googleSheets.spreadsheets.values.update({
            auth: googleClient,
            spreadsheetId,
            range: `${sheet}H!${row}`,
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[value]]
            }
        });

        console.log(updateFinalGrade.data);

    }catch(err){
        console.log(err);
    }
}

function calculateFinalGrade(media, naf) {
    return Math.ceil((media + naf) / 2);
}


app.listen("3000", () => {
    console.log("Server started on port 3000");
});
