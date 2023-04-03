const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
    apiKey: process.env.API_KEY_OPENAI,
});
const openai = new OpenAIApi(configuration);

const format = "b64_json";

async function doStuff(description) {

    return await openai.createImage({
        prompt: `a chibi cartoon vector watercolor drawing of ${description}, facing to the front, dont draw the mouth or nose, just the eyes on their face, with a completely white background around with no objects on it. The object should fit in the image completely so it should not look cropped in the borders.`,
        //prompt: 'a cartoon vector watercolor drawing with small details of A clearing in the forest, surrounded by tall trees with green leaves to be used as background',
        //prompt: 'a topview of a cartoon vector watercolor drawing with small details of Soft grass and colorful flowers to be used as infinite floor tiles',
        n: 1,
        size: "256x256",
        response_format: format
    })
}


const handler = (req, res) => {
    const description = req.body.description;

    if (description) {

        //res.send(baseHarry)

       // console.log(description)
        //setTimeout(() => res.send(baseHarry), 1000);



        doStuff(description)
            .then((r) => {
              if (r) {
                    const newd = JSON.stringify(r?.data?.data?.[0]?.[format]);
                    res.send(newd)
                 }
            })
            .catch((e) => {
                //res.send(baseHarry)
                console.log('erred', e)
                //console.log(description)
            });


    }
};

export default handler;