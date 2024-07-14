import https from 'https';
import fs from 'fs';
import { CONSTANTS } from './constants.js';
import {mapContent} from './mapper.js';
import { httpsX } from './helper.js';

function readFile(contentId) {
    // Assuming contentId is the filename or part of the file path
    const filePath = `${CONSTANTS.BASE_PATH}/${contentId}.json`;

    return fs.readFileSync(filePath, { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        try {
            return JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
        }
    });
}

async function putToDotCMS(contentlet) {
    const data = {}
    data.contentlet = contentlet;

    const body = JSON.stringify(data);

    const res = await httpsX({
        method: 'PUT',
        hostname: `${CONSTANTS.OUTGOING_SERVER}`,
        path: `/api/content/publish/1`,
        headers: {
            Authorization: `Bearer ${CONSTANTS.OUTGOING_KEY}`,
            "Content-Type": "application/json",
        },
        body: body,
    }).then((res) => {
        console.log(`Imported contentlet: ${contentlet.title}`);
    });
}


function recursiveImport(contentletId) {
    let contentlet = readFile(contentletId);
    

    putToDotCMS(mapContent(contentlet));
    return;
    if (contentlet.dotcmsdocumentationchildren && contentlet.dotcmsdocumentationchildren.length > 0) {
        for (let child of contentlet.dotcmsdocumentationchildren) {
            recursiveImport(child);
        }
    }
}

function startImport() {
    recursiveImport(CONSTANTS.TABLE_OF_CONTENTS);

}


startImport();