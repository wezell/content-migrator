import fs from 'fs';
import { CONSTANTS } from './constants.js';
import { httpsPost } from './helper.js';



const processedContent = [];
const relationshipField = "dotcmsdocumentationchildren";

async function start() {
    downloadOrReadContentHierarchy(CONSTANTS.TABLE_OF_CONTENTS);
}

async function downloadOrReadContentHierarchy(contentId) {

    if(contentId === undefined || processedContent.includes(contentId)){
        return;
    }

    const contentlet = await downloadOrReadContent(contentId);
    if(contentlet?.identifier === undefined){
        return;
    }
    processedContent.push(contentId);
    console.log(`Processing: ${contentlet.title}`);

    if (
        contentlet[relationshipField] &&
        contentlet[relationshipField].length > 0
    ) {
        for (let child of contentlet[relationshipField]) {

            await downloadOrReadContentHierarchy(child);
        }
    }
}

// Function to download data from the specified URL
async function downloadOrReadContent(contentId) {
    fs.mkdirSync(`${CONSTANTS.BASE_PATH}`, { recursive: true });
    const fileName = `./data/${contentId}.json`;
    console.log(`looking for:  ${fileName}`);
    if (!fs.existsSync(fileName)) {
        return downloadContentlet(contentId);
    }
    // read the content from the file
    return JSON.parse(fs.readFileSync(fileName));
}

// Function to download data from the specified URL
async function downloadContentlet(contentId) {
    const fileName = `${CONSTANTS.BASE_PATH}/${contentId}.json`;
    const query = {
        query: `+live:true +identifier:${contentId}`,
        depth: 0,
        limit: 1,
    };

    const res = await httpsPost({
        hostname: `${CONSTANTS.INCOMING_SERVER}`,
        path: `/api/content/_search`,
        headers: {
            Authorization: `Bearer ${CONSTANTS.INCOMING_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
    });

    if (
        res?.entity?.jsonObjectView?.contentlets &&
        res.entity.jsonObjectView.contentlets.length == 0
    ) {
        console.log("No content found with the specified id");
        return;
    }
    

    const contentlet = res.entity.jsonObjectView.contentlets[0];

    fs.writeFile(fileName,  JSON.stringify(contentlet, null, 2), (err) => {
        if (err) throw err;
    });

    console.log(`downloaded : ${contentlet.title}`);
    return contentlet;
}


start();


