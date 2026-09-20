// Import dependencies
import { writeFileSync } from 'fs';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

const HORIZONS_API_URL = 'https://ssd.jpl.nasa.gov/api/horizons_file.api';
const REQUEST_TIMEOUT_MS = 20000;
const MAX_RETRIES = 2;

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
        dataString: (dt1, dt2) => `!$$SOF
      MAKE_EPHEM=YES
      COMMAND=199
      EPHEM_TYPE=ELEMENTS
      CENTER='500@10'
    START_TIME='${dt1}'
    STOP_TIME='${dt2}'
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
        dataString: (dt1, dt2) => `!$$SOF
      MAKE_EPHEM=YES
      COMMAND=299
      EPHEM_TYPE=ELEMENTS
      CENTER='500@10'
    START_TIME='${dt1}'
    STOP_TIME='${dt2}'
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
        dataString: (dt1, dt2) => `!$$SOF
    MAKE_EPHEM=YES
    COMMAND=399
    EPHEM_TYPE=ELEMENTS
    CENTER='500@10'
    START_TIME='${dt1}'
    STOP_TIME='${dt2}'
    REF_SYSTEM='ICRF'
    REF_PLANE='ECLIPTIC'
    CAL_TYPE='M'
    OUT_UNITS='AU-D'
    ELM_LABELS='NO'
    TP_TYPE='ABSOLUTE'
    CSV_FORMAT='YES'
    OBJ_DATA='NO'`}],
    ['mars', {
        dataString: (dt1, dt2) => `!$$SOF
    MAKE_EPHEM=YES
    COMMAND=499
    EPHEM_TYPE=ELEMENTS
    CENTER='500@10'
    START_TIME='${dt1}'
    STOP_TIME='${dt2}'
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
        dataString: (dt1, dt2) => `!$$SOF
    MAKE_EPHEM=YES
    COMMAND=599
    EPHEM_TYPE=ELEMENTS
    CENTER='500@10'
    START_TIME='${dt1}'
    STOP_TIME='${dt2}'
    REF_SYSTEM='ICRF'
    REF_PLANE='ECLIPTIC'
    CAL_TYPE='M'
    OUT_UNITS='AU-D'
    ELM_LABELS='NO'
    TP_TYPE='ABSOLUTE'
    CSV_FORMAT='YES'
    OBJ_DATA='NO'`}],
    ['saturn', {
        dataString: (dt1, dt2) => `!$$SOF
    MAKE_EPHEM=YES
    COMMAND=699
    EPHEM_TYPE=ELEMENTS
    CENTER='500@10'
    START_TIME='${dt1}'
    STOP_TIME='${dt2}'
    REF_SYSTEM='ICRF'
    REF_PLANE='ECLIPTIC'
    CAL_TYPE='M'
    OUT_UNITS='AU-D'
    ELM_LABELS='NO'
    TP_TYPE='ABSOLUTE'
    CSV_FORMAT='YES'
    OBJ_DATA='NO'`}],
    ['uranus', {
        dataString: (dt1, dt2) => `!$$SOF
    MAKE_EPHEM=YES
    COMMAND=799
    EPHEM_TYPE=ELEMENTS
    CENTER='500@10'
    START_TIME='${dt1}'
    STOP_TIME='${dt2}'
    REF_SYSTEM='ICRF'
    REF_PLANE='ECLIPTIC'
    CAL_TYPE='M'
    OUT_UNITS='AU-D'
    ELM_LABELS='NO'
    TP_TYPE='ABSOLUTE'
    CSV_FORMAT='YES'
    OBJ_DATA='NO'`}],
    ['neptune', {
        dataString: (dt1, dt2) => `!$$SOF
    MAKE_EPHEM=YES
    COMMAND=899
    EPHEM_TYPE=ELEMENTS
    CENTER='500@10'
    START_TIME='${dt1}'
    STOP_TIME='${dt2}'
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
    for (const planet of planets) {
        // Access the data string from the map
        const dataString = planetInput.get(planet).dataString(dt1, dt2);

        // Call JPL Horizons API for planet data in data string
        const data = await getPlanetData(dataString, planet);

        // Extract relevant information and calculate positions
        planetsData[planet] = {
            A: data.A,
            ec: data.ec,
            IN: data.IN,
            OM: data.OM,
            coordinates: calculateCoord(data),
            color: getPlanetColor(planet),
            scale: getPlanetScale(planet),
            W: data.W
        };
    };

    writeFileSync('data/planetPositions.json', JSON.stringify(planetsData, null, 2));
    console.log('Planet data pre-calculated and saved to planetPositions.json');
}

const getPlanetData = async (planetDataString, planetName) => {
    const response = await makeRequestWithRetry(HORIZONS_API_URL, {
        format: 'text',
        input: planetDataString,
    });

    // Parse the API response to extract relevant data
    // Find the information we want for json file
    const parsed = get_string_between(response, '$$SOE', '$$EOE');
    if (!parsed) {
        throw new Error(`Could not parse orbital elements for ${planetName}`);
    }

    const values = parsed.split(',');
    if (values.length < 12) {
        throw new Error(`Unexpected Horizons response format for ${planetName}`);
    }

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

    // Solve Kepler's equation with bounded Newton-Raphson iterations.
    const M = MA;
    let E = M + ec * Math.sin(M) * (1 + ec * Math.cos(M));

    for (let i = 0; i < 35; i += 1) {
        const denominator = 1 - ec * Math.cos(E);
        const delta = (E - ec * Math.sin(E) - M) / denominator;
        E -= delta;
        if (Math.abs(delta) < 1e-8) {
            break;
        }
    }

    // Calculate true anomaly and distance
    const v = 2 * Math.atan2(Math.sqrt(1 + ec) * Math.sin(E / 2), Math.sqrt(1 - ec) * Math.cos(E / 2));
    const r = A * (1 - ec * Math.cos(E));

    // Convert to Cartesian coordinates
    const x = r * (Math.cos(v + W) * Math.cos(OM) - Math.sin(v + W) * Math.cos(IN) * Math.sin(OM));
    const y = r * (Math.cos(v + W) * Math.sin(OM) + Math.sin(v + W) * Math.cos(IN) * Math.cos(OM));

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


async function makeRequestWithRetry(url, form) {
    let lastError;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
        try {
            return await makeRequest(url, form);
        } catch (error) {
            lastError = error;
            if (attempt < MAX_RETRIES) {
                const backoffMs = 700 * (attempt + 1);
                await new Promise(resolve => setTimeout(resolve, backoffMs));
            }
        }
    }

    throw lastError;
}

async function makeRequest(url, form) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(form),
            signal: controller.signal
        });

        const body = await response.text();
        if (!response.ok) {
            throw new Error(`Horizons API error ${response.status}: ${body || response.statusText}`);
        }

        return body;
    } finally {
        clearTimeout(timeoutId);
    }
}


// Define a function that returns a string between two strings
function get_string_between(string, start, end) {
    const ini = string.indexOf(start);
    if (ini === -1) return '';
    const len = string.indexOf(end, ini + start.length) - ini - start.length;
    return string.substr(ini + start.length, len);
}

writeData();
