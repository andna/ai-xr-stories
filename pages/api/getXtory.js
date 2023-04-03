import { OpenAIStream } from "./OpenAIStream";



export const config = {
    runtime: "edge",
};

const handler = async (req, res) => {
    const { searchParams } = new URL(req.url)
    const charProdAndPlot = searchParams.get('charProdAndPlot');

    const payload = {

        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: `You are a fan of fictions content database and answer in json format only` },
            {
                role: "user",
                content: "Tell me a show's name",
            },
            {
                role: "assistant",
                content: '{"name": "Breaking Bad"}',
            },
            { role: "user", content:                     `
 With no human conversation or extra explanations, and without stating your limitations as an AI Language model, Give me 
 ${charProdAndPlot ? `the story of ${charProdAndPlot} set after their last stablished current canon story.`
            :
                    " a new story about any topic, except about something lost or missing. "
            }
  It must be in a valid minified JSON format with a title. Only the valid JSON, nothing else.

   It should have common story arc in 5 scenes (and not more than 5 scenes) where a central problem will end up solved: 1st scene introduction, 2nd rising action or introduction of a problem, 3rd climax of the action and 4th falling action, resolution of problem or epilogue where the moral of the story is explained.
   Start describing the most important characters, at least 3 but no more than 5.
   If a new character that appears in a new scene was not described in the beginning characters, always describe them too before the actions of the scene.
   Characters name "n" and the speakers of actions "s" should be exactly the same, including last names, not only similar.
   Make the descriptions of the characters and scene settings very visually descriptive. Dialogs should have 1 emoji.
   This is the format I want:
      {"title":"Lost dog" , "characters":[{"n":"Sarah J. Connor","dsc":"a young woman with blue hair", "e": "👩"},{"n":"Lost Dog","dsc":"a yellow fur scared dog wandering around the city streets", "e": "🐕"}],"scenes":[{"isDark":0,"back":"City street in daylight, full of skycrapers","floor":"street concrete","actions":[{"s":"Sarah J. Connor","txt":"Hey there, little guy. Are you lost?", "e": "😟"},{"s":"Narrator","txt":"Sarah J. Connor checks the dog's collar and finds a phone number.", "e": "☎"},{"s":"Lost Dog","txt":"Woof woof", "e": "🐶"},{"s":"Narrator","txt":"Sarah J. Connor moves away from the dog", "e": "🚶‍♀"},{"s":"Narrator","txt":"Sarah J. Connor and the Lost Dog start running", "e": "🏃‍♀️🐕"}]},{"isDark":1,"back":"City street in nightime, full of skycrapers","floor":"street paved with wet concrete","newChars":[{"n":"Veterinarian","dsc":"a young man with a veterinarian gown", "e": "🧑‍⚕"}],"actions":[{"s":"Veterinarian","txt":"Hello everyone", "e": "🙋‍♂"}]}]}
  `},
        ],
        temperature: 0.7,
        stream: true,
    };

    const stream = await OpenAIStream(payload, true);
    return new Response(stream);
};

/*


 */

export default handler;