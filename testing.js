import https from 'https';
import fs from 'fs';
import { CONSTANTS } from './constants.js';
import {mapContent} from './mapper.js';
import { httpsX } from './helper.js';


async function putToDotCMS() {
    const data = {};
    let contentlet = {"stInode":"testing", "title":"Does this work?", "identifier":"1234567890"};


    const body = JSON.stringify(contentlet);

    const res = await httpsX({
        method: 'POST',
        hostname: `${CONSTANTS.OUTGOING_SERVER}`,
        //path: `/api/v1/workflow/actions/default/fire/NEW`,
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




putToDotCMS();