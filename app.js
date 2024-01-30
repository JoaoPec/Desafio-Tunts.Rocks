import express from 'express';
import { getRows, updateSituation, updateFinalGrade, calculateFinalGrade } from './functions.js';

const app = express();

// Fetch, process, and update student data in the Google Sheets document
async function updateSheet() {

    console.log("Updating sheet...");

    try {
        // Fetch rows from the Google Sheets
        const rows = await getRows();

        let students = [];
        let situationPosition = 4;
        let finalGradePosition = 4;

        // Iterate through each row
        for (let i = 0; i < rows.length; i++) {
            const enrollment = rows[i][0];
            const student = rows[i][1];
            const absences = parseInt(rows[i][2], 10);
            const exam1 = parseInt(rows[i][3], 10);
            const exam2 = parseInt(rows[i][4], 10);
            const exam3 = parseInt(rows[i][5], 10);

            let situation = "";
            let finalGrade = 0;
            let naf;

            // Calculate the average
            const average = Math.ceil((exam1 + exam2 + exam3) / 3);

            // Determine the situation and naf value
            if (absences > 15) {
                situation = "Reprovado por Falta";
                naf = 0;
            } else if (average >= 70) {
                situation = "Aprovado";
                naf = 0;
            } else if (50 <= average && average < 70) {
                situation = "Exame Final";
                naf = Math.ceil(2 * (5 - average));
            } else if (average < 50) {
                situation = "Reprovado por nota";
                naf = 0;
            }

            // Calculate the final grade
            finalGrade = calculateFinalGrade(average, naf);

            // Update the situation in the spreadsheet
            await updateSituation(situation, situationPosition);

            // Log details based on naf value
            if (naf !== 0) {
                console.log(`Aluno: ${student} - Situação: ${situation} - media: ${average} - Nota para Aprovação Final: ${finalGrade}`);
            } else {
                console.log(`Aluno: ${student} - Situação: ${situation} - media: ${average}`);
            }

            // Calculate the final grade and update in the spreadsheet
            if (naf == 0) {
                finalGrade = 0;
                await updateFinalGrade(finalGrade, finalGradePosition);
            } else {
                finalGrade = calculateFinalGrade(average, naf);
                await updateFinalGrade(finalGrade, finalGradePosition);
            }

            // Increment positions
            situationPosition++;
            finalGradePosition++;

            // Push student details to the array
            students.push({
                enrollment,
                student,
                absences,
                exam1,
                exam2,
                exam3,
                average,
                situation,
                finalGrade,
            });
        }

        return students;

    } catch (err) {
        console.log(err);
        res.json([]);
    }
}

const students = await updateSheet();

// Define routes

app.get("/", async (req, res) => {
    // Redirect to the Google Sheets document
    res.redirect("https://docs.google.com/spreadsheets/d/15Y_fvNQo8cBjvlRablHkW8boldKX5MbkOqRBd4ldC2k/edit#gid=0");
});

app.get("/json", async (req, res) => {
    // Return JSON representation of students
    res.json(students);
});

app.listen("3000", (req, res) => {
    // Log server start message
    console.log("\nIf you want to see the JSON of the students, access http://localhost:3000/json\nAnd to see the spreadsheet, access http://localhost:3000/");
});
