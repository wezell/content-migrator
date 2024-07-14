const fs = require('fs');

function csvToMaps(filePath) {
    fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        const records = parseCSV(data);
        const headers = records.shift(); // Remove the first item as headers
        const maps = records.map(record => {
            return headers.reduce((acc, header, i) => {
                acc[header] = record[i];
                return acc;
            }, {});
        });

        console.log('CSV processing completed.');
        return maps
    });
}

function parseCSV(data) {
    const records = [];
    let record = [];
    let field = '';
    let inQuotes = false;

    for (const char of data) {
        if (char === '"' && inQuotes && field[field.length - 1] === '"') {
            field = field.slice(0, -1); // Handle escaped quotes
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            record.push(field);
            field = '';
        } else if (char === '\n' && !inQuotes) {
            record.push(field);
            records.push(record);
            record = [];
            field = '';
        } else {
            field += char;
        }
    }

    // Push the last field and record (if not empty)
    if (field !== '' || record.length > 0) {
        record.push(field);
        records.push(record);
    }

    return records;
}



csvToMaps('test.csv');