// Import dependencies
import { writeFileSync } from 'fs';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

// Specify date range for calculations
const today = moment().tz('America/Toronto');
const dt1 = today.format('Y-M-D');
const dt2 = today.add(1, 'day').format('Y-M-D');

// Define data storage object
const planetsData = {};

// Loop through planets and calculate their positions
const planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
const planetInput = new Map([
    ['mercury', {
        dataString: `!$$SOF
      MAKE_EPHEM=YES
      COMMAND=199
      EPHEM_TYPE=ELEMENTS
      CENTER='500@10'
      START_TIME='2023-9-17'
      STOP_TIME='2023-9-18'
      REF_SYSTEM='ICRF'
      REF_PLANE='ECLIPTIC'
      CAL_TYPE='M'
      OUT_UNITS='AU-D'
      ELM_LABELS='NO'
      TP_TYPE='ABSOLUTE'
      CSV_FORMAT='YES'
      OBJ_DATA='NO'`,
    }],
    ['venus', {
        dataString: `!$$SOF
      MAKE_EPHEM=YES
      COMMAND=299
      EPHEM_TYPE=ELEMENTS
      CENTER='500@10'
      START_TIME='2023-9-17'
      STOP_TIME='2023-9-18'
      REF_SYSTEM='ICRF'
      REF_PLANE='ECLIPTIC'
      CAL_TYPE='M'
      OUT_UNITS='AU-D'
      ELM_LABELS='NO'
      TP_TYPE='ABSOLUTE'
      CSV_FORMAT='YES'
      OBJ_DATA='NO'`,
    }],
    ['earth', {
        dataString: `!$$SOF
    MAKE_EPHEM=YES
    COMMAND=399
    EPHEM_TYPE=ELEMENTS
    CENTER='500@10'
    START_TIME='2023-9-17'
    STOP_TIME='2023-9-18'
    REF_SYSTEM='ICRF'
    REF_PLANE='ECLIPTIC'
    CAL_TYPE='M'
    OUT_UNITS='AU-D'
    ELM_LABELS='NO'
    TP_TYPE='ABSOLUTE'
    CSV_FORMAT='YES'
    OBJ_DATA='NO'`}],
    ['mars', {
        dataString: `!$$SOF
    MAKE_EPHEM=YES
    COMMAND=499
    EPHEM_TYPE=ELEMENTS
    CENTER='500@10'
    START_TIME='2023-9-17'
    STOP_TIME='2023-9-18'
    REF_SYSTEM='ICRF'
    REF_PLANE='ECLIPTIC'
    CAL_TYPE='M'
    OUT_UNITS='AU-D'
    ELM_LABELS='NO'
    TP_TYPE='ABSOLUTE'
    CSV_FORMAT='YES'
    OBJ_DATA='NO'`
    }],
    ['jupiter', {
        dataString: `!$$SOF
    MAKE_EPHEM=YES
    COMMAND=599
    EPHEM_TYPE=ELEMENTS
    CENTER='500@10'
    START_TIME='2023-9-17'
    STOP_TIME='2023-9-18'
    REF_SYSTEM='ICRF'
    REF_PLANE='ECLIPTIC'
    CAL_TYPE='M'
    OUT_UNITS='AU-D'
    ELM_LABELS='NO'
    TP_TYPE='ABSOLUTE'
    CSV_FORMAT='YES'
    OBJ_DATA='NO'`}],
    ['saturn', {
        dataString: `!$$SOF
    MAKE_EPHEM=YES
    COMMAND=699
    EPHEM_TYPE=ELEMENTS
    CENTER='500@10'
    START_TIME='2023-9-17'
    STOP_TIME='2023-9-18'
    REF_SYSTEM='ICRF'
    REF_PLANE='ECLIPTIC'
    CAL_TYPE='M'
    OUT_UNITS='AU-D'
    ELM_LABELS='NO'
    TP_TYPE='ABSOLUTE'
    CSV_FORMAT='YES'
    OBJ_DATA='NO'`}],
    ['uranus', {
        dataString: `!$$SOF
    MAKE_EPHEM=YES
    COMMAND=799
    EPHEM_TYPE=ELEMENTS
    CENTER='500@10'
    START_TIME='2023-9-17'
    STOP_TIME='2023-9-18'
    REF_SYSTEM='ICRF'
    REF_PLANE='ECLIPTIC'
    CAL_TYPE='M'
    OUT_UNITS='AU-D'
    ELM_LABELS='NO'
    TP_TYPE='ABSOLUTE'
    CSV_FORMAT='YES'
    OBJ_DATA='NO'`}],
    ['neptune', {
        dataString: `!$$SOF
    MAKE_EPHEM=YES
    COMMAND=899
    EPHEM_TYPE=ELEMENTS
    CENTER='500@10'
    START_TIME='2023-9-17'
    STOP_TIME='2023-9-18'
    REF_SYSTEM='ICRF'
    REF_PLANE='ECLIPTIC'
    CAL_TYPE='M'
    OUT_UNITS='AU-D'
    ELM_LABELS='NO'
    TP_TYPE='ABSOLUTE'
    CSV_FORMAT='YES'
    OBJ_DATA='NO'`}]
]);

async function writeData() {
    // Use for...of loop instead of forEach loop
    for (const planet of planets) {
        // Access the data string from the map
        const dataString = planetInput.get(planet).dataString;

        // Update start and stop times within the data string
        dataString.replace(/START_TIME='.*'/, `START_TIME='${dt1}'`);
        dataString.replace(/STOP_TIME='.*'/, `STOP_TIME='${dt2}'`);

        // Call JPL Horizons API for planet data
        // Use await keyword before the function call
        const data = await getPlanetData(dataString, dt1);

        // Extract relevant information and calculate positions
        planetsData[planet] = {
            A: data.A,
            ec: data.ec,
            coordinates: calculateCoord(data),
            color: getPlanetColor(planet),
            scale: getPlanetScale(planet),
            W: data.W
        };
    };

    writeFileSync('docs/data/planetPositions.json', JSON.stringify(planetsData, null, 2));
    console.log('Planet data pre-calculated and saved to planetPositions.json');
}

const getPlanetData = async (planetDataString, date) => {
    // Make the POST call to the JPL Horizons API
    const response = await makeRequest(
        'https://ssd.jpl.nasa.gov/api/horizons_file.api',
        {
            format: 'text',
            input: planetDataString,
            // epoch: date,
        }
    );
    // Parse the API response to extract relevant data
    // Find the information we want for json file
    const parsed = get_string_between(response, '$$SOE', '$$EOE');
    const values = parsed.split(',');

    // Extract relevant values for calculations
    const ec = parseFloat(values[2]);
    const IN = parseFloat(values[4]) * Math.PI / 180;
    const OM = parseFloat(values[5]) * Math.PI / 180;
    const W = parseFloat(values[6]) * Math.PI / 180;
    const MA = parseFloat(values[9]) * Math.PI / 180;
    const A = parseFloat(values[11]);

    // Return the data object
    return { ec, IN, OM, W, MA, A };
};

function calculateCoord(data) {
    const { ec, IN, OM, W, MA, A } = data;

    // Implement Keplerian orbital mechanics calculations
    // Calculate orbital elements
    var M = MA;
    var E0 = M + ec * Math.sin(M) * (1 + ec * Math.cos(M));
    var E = M;

    // Iterate to find E
    while (Math.abs(E - E0) > 0.0005) {
        E = E0 - (E0 - ec * Math.sin(E0) - M) / (1 - ec * Math.cos(E0))
        E0 = E;
    }

    // Calculate true anomaly and distance
    var v = 2 * Math.atan2(Math.sqrt(1 + ec) * Math.sin(E / 2), Math.sqrt(1 - ec) * Math.cos(E / 2));
    var r = A * (1 - ec * Math.cos(E));

    // Convert to Cartesian coordinates
    var x = r * (Math.cos(v + W) * Math.cos(OM) - Math.sin(v + W) * Math.cos(IN) * Math.sin(OM));
    var y = r * (Math.cos(v + W) * Math.sin(OM) + Math.sin(v + W) * Math.cos(IN) * Math.cos(OM));

    return [x, y];
}

function getPlanetScale(planet) {
    switch (planet) {
        case 'mercury':
            return 0.33;
        case 'venus':
            return 0.95;
        case 'earth':
            return 1;
        case 'mars':
            return 0.5;
        case 'jupiter':
            return 11;
        case 'saturn':
            return 9;
        case 'uranus':
            return 4;
        case 'neptune':
            return 3.7;
        default:
            return 1;
    }
}

function getPlanetColor(planet) {
    switch (planet) {
        case 'mercury':
            return 'red';
        case 'venus':
            return '#FDBF01';
        case 'earth':
            return '#417B38';
        case 'mars':
            return '#F97A05';
        case 'jupiter':
            return '#C1844D';
        case 'saturn':
            return '#7B7869';
        case 'uranus':
            return '#D3F9FA';
        case 'neptune':
            return '#537CFE';
    }
}

// Define a function that returns a promise for the request
// function makeRequest(url, form) {
//     return new Promise((resolve, reject) => {
//         request.post(url, { form }, (error, response, body) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(body);
//             }
//         });
//     });
// }
// Define a function that returns a promise for the request
function makeRequest(url, form) {
    return new Promise((resolve, reject) => {
        // Use node-fetch to make a POST request with form data
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(form)
        })
        .then(response => {
            // Check if the response is ok
            if (response.ok) {
                // Return the response body as text
                return response.text();
            } else {
                // Reject the promise with the status text
                reject(response.statusText);
            }
        })
        .then(body => {
            // Resolve the promise with the body
            resolve(body);
        })
        .catch(error => {
            // Reject the promise with the error
            reject(error);
        });
    });
}


// Define a function that returns a string between two strings
function get_string_between(string, start, end) {
    const ini = string.indexOf(start);
    if (ini === -1) return '';
    const len = string.indexOf(end, ini + start.length) - ini - start.length;
    return string.substr(ini + start.length, len);
}

writeData();