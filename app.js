import express from 'express';
import { google } from 'googleapis';
import { getRows, updateSituation, updateFinalGrade, calculateFinalGrade } from './functions.js';

const app = express();

async function updateSheet() {

    console.log("Updating sheet...")

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


            const media = Math.ceil((p1 + p2 + p3) / 3);


            if (faltas > 15) {
                situation = "Reprovado por Falta";
                naf = 0;
            } else if (media >= 70) {
                situation = "Aprovado";
                naf = 0;
            } else if (50 <= media && media < 70) {
                situation = "Exame Final";
                naf = Math.ceil(2 * (5 - media));

            } else if (media < 50) {
                situation = "Reprovado por Nota";
                naf = 0;
            }


            finalGrade = calculateFinalGrade(media, naf);

            // Atualiza a situação na planilha
            await updateSituation(situation, situationPosition);

            console.log(`Aluno: ${aluno} - Situação: ${situation} - media: ${media} - Nota para aprovação Final: ${finalGrade}`)


            // Calcula a nota final e atualiza na planilha
            if (naf == 0) {
                finalGrade = 0;
                await updateFinalGrade(finalGrade, finalGradePosition);
            } else {
                finalGrade = calculateFinalGrade(media, naf);
                await updateFinalGrade(finalGrade, finalGradePosition);
            }

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
                media,
                situation,
                finalGrade,
            });
        }

        return (alunos);

    } catch (err) {
        console.log(err);
        res.json([]);
    }
}

const students = await updateSheet();


app.get("/", async (req, res) => {
    res.redirect("https://docs.google.com/spreadsheets/d/15Y_fvNQo8cBjvlRablHkW8boldKX5MbkOqRBd4ldC2k/edit#gid=0")
});

app.get("/json", async (req, res) => {
    res.json(students)
})

app.listen("3000", (req, res) => {
    console.log("If you want to see the JSON of the students, access http://localhost:3000/json, and to see the spreadsheet, access http://localhost:3000/");
});

