const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const loremPicsum = require("lorem-picsum");
const database = require("./database/postgres_connection");
const { tablesNames, tablesSchemas } = require('./initialLoad');
// const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

(async () => {
    const connection = await database();
    await connection.connect();
    let data = [];
    for (let i = 0; i < 25000; i++) {
        const name = lorem.generateWords(getRandomInt(1, 3));
        const description = lorem.generateParagraphs(getRandomInt(1, 2));
        const image = loremPicsum({
            width: 200,
            height: 200,
            random: true
        });
        data.push({ name, description, image, visable: new Boolean(getRandomInt(1, 10) % 2) })
    }
    await connection.actions.insertInTable(tablesNames.products, tablesSchemas.products, data)
    // const database_connection = await database();
    // await database_connection.connect();
    await connection.end();
    console.log(lorem.generateWords(3));
    // console.log(lorem.generateSentences(5));
    // console.log(lorem.generateParagraphs(7));

})();