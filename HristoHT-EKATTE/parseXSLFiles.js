const fs = require('fs');
const xlsx = require('node-xlsx');

const parseoblastis = () => {
    const xlsxFile = xlsx.parse(`./EKATTE/Ek_obl.xlsx`);
    const data = xlsxFile[0].data
        .filter(row => row[0].length === 3)
        .map(row => {
            return {
                nameOblast: row[2],
                oblast: row[0]
            }
        });

    fs.writeFile('./EKATTE/EK_obl_parsed.txt', data.map(row => JSON.stringify(row)).join('\n'), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('File saved!');
        }
    })

    return data;
}


const parseobstini = () => {
    const xlsxFile = xlsx.parse(`./EKATTE/Ek_obst.xlsx`);
    const data = xlsxFile[0].data
        .filter(row => row[0].length === 5)
        .map(row => {
            return {
                nameObstina: row[2],
                obstina: row[0],
                oblast: row[0].slice(0, 3)
            }
        });

    fs.writeFile('./EKATTE/EK_obst_parsed.txt', data.map(row => JSON.stringify(row)).join('\n'), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('File saved!');
        }
    })

    return data;
}


const parsegradove = () => {
    const xlsxFile = xlsx.parse(`./EKATTE/Ek_atte.xlsx`);
    const data = xlsxFile[0].data
        .filter(row => row[0].length === 5 && row[0] != '00000')
        .map(row => {
            return {
                name: row[2],
                ekatte: row[0],
                // oblast: row[3],
                obstina: row[4],
            }
        });

    fs.writeFile('./EKATTE/EK_atte_parsed.txt', data.map(row => JSON.stringify(row)).join('\n'), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('File saved!');
        }
    })

    return data;
}

// (async () => {
//     try {
//         console.log(parseoblastis().length);
//         console.log(parseobstini().length);
//         console.log(parsegradove().length);

//     } catch (e) {
//         console.log(e)
//     }
// })()

module.exports = {
    parsegradove,
    parseoblastis,
    parseobstini
}