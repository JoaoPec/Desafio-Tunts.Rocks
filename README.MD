# Introduction:

This Express.js application is designed to manage data in a Google Sheets document pertaining to an engineering software trainee challenge. The application retrieves, processes, and updates information in the Google Sheets document based on predefined rules. Additionally, it provides endpoints for accessing information, allowing users to redirect to the Google Sheets document and obtain a JSON representation of student data.

## Code Overview:

The application is built using Express.js, serving as a web server.
Interaction with Google Sheets is facilitated through functions such as getRows, updateSituation, updateFinalGrade, and calculateFinalGrade sourced from the functions.js module.
The updateSheet function is responsible for processing data from the Google Sheet, calculating grades and situations, and updating the sheet accordingly. The function logs relevant information to the console.
Two routes are defined: / and /json.

- / redirects users to the Google Sheets document for manual inspection.
- /json returns a JSON representation of the processed student data.

# Usage:

- Run npm install
- Run the application using node app.js.
- Wait for the completion of the function.
- Access the Google Sheets document by visiting http://localhost:3000/.
- Obtain a JSON representation of student data by visiting http://localhost:3000/json.

