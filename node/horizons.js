const fs = require('fs');
const path = require('path');
const request = require('request');
const moment = require('moment-timezone');

// Get the current date
const today = moment().tz('America/Toronto');

// Format the date as YYYY-MM-DD
const dt1 = today.format('Y-M-D');

// Add one day to get tomorrow's date
const tomorrow = today.add(1, 'day');

// Format the date as YYYY-MM-DD
const dt2 = tomorrow.format('Y-M-D');

// Create an array of filenames
const files = [
    'mercury.txt',
    'venus.txt',
    'earth.txt',
    'mars.txt',
    'jupiter.txt',
    'saturn.txt',
    'uranus.txt',
    'neptune.txt',
];

const dataPath = path.join(__dirname, '..', 'data');

files.forEach(file => {
    // Loop through the files
    // Read the file into an array of lines
    const filePath = path.join(dataPath, file);
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');

    // Rewrite the lines with the new dates
    lines[6] = `START_TIME='${dt1}'`;
    lines[7] = `STOP_TIME='${dt2}'`;

    // Write the lines back to the file
    fs.writeFileSync(filePath, lines.join('\n'));
});


const dirPath = dataPath;
const a = {};

// Define a function that returns a promise for the request
function makeRequest(url, form) {
    return new Promise((resolve, reject) => {
        request.post(url, { form }, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

// Use an async function to loop through the files and await the promises
async function processFiles() {
    try {
        // Get the file names that match the criteria
        const fileNames = fs
            .readdirSync(dirPath, { withFileTypes: true })
            .filter(
                (dirent) => dirent.isFile() && path.extname(dirent.name) === '.txt'
            )
            .map((dirent) => dirent.name);

        // Loop through the file names
        for (let fileName of fileNames) {
            // Read the file contents
            const filePath = path.join(dirPath, fileName);
            const contents = fs.readFileSync(filePath, 'utf8');

            // Make the request and await the response
            const body = await makeRequest(
                'https://ssd.jpl.nasa.gov/api/horizons_file.api',
                {
                    format: 'text',
                    input: contents,
                }
            );

            // Find the information we want for json file
            const name = path.basename(fileName, '.txt');
            const parsed = get_string_between(body, '$$SOE', '$$EOE');
            const myArray = parsed.split(',');

            // Create array for json file
            a[name] = {};
            a[name] = {
                JD: myArray[0],
                e: myArray[2],
                QR: myArray[3],
                IN: myArray[4],
                OM: myArray[5],
                W: myArray[6],
                Tp: myArray[7],
                N: myArray[8],
                MA: myArray[9],
                TA: myArray[10],
                A: myArray[11],
                AD: myArray[12],
                PR: myArray[13],
            };
        }

        // Write to json file
        fs.writeFile('./data/horizons.json', JSON.stringify(a, null, 2), (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Horizons data extracted and saved to horizons.json');
            }
        });
    } catch (error) {
        // Handle any errors
        console.error(error);
    }
}

// Call the async function
processFiles();

function get_string_between(string, start, end) {
    const ini = string.indexOf(start);
    if (ini === -1) return '';
    const len = string.indexOf(end, ini + start.length) - ini - start.length;
    return string.substr(ini + start.length, len);
}