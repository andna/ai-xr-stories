import { OpenAIStream } from "./OpenAIStream";



export const config = {
    runtime: "edge",
};

const handler = async (req, res) => {
    const { searchParams } = new URL(req.url)
    const characterAndProduct = searchParams.get('characterAndProduct');

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
with no human conversation or extra explanations, list me 4 possible scenarios to 
extend the story after current or finished canon for ${characterAndProduct}. Take into account that if in the character canon they ended up dead, the story should be after that.
Do it in valid json format like this:
[{"title": "Rise from ashes", "desc": "Character begins to question the Government's oppressive policies and must decide whether to join the resistance or continue to serve them."},{},{},{}]
  `},
        ],
        temperature: 0.8,
        stream: true,
    };

    const stream = await OpenAIStream(payload, true);
    return new Response(stream);
};

/*
 Give me the story of Monkey D Luffy after their last stablished current canon story. It must be in a valid JSON format with a title.

   The story should have common story arc: 1st scene introduction, 2nd rising action, 3rd climax and 4th falling action & resolution or epilogue where the moral of the story is explained.
   Start describing the most important characters, at least 3 but no more than 5.
   If a new character not described in the beginning appears in a scene, always describe them too before the actions of the scene.
   Characters name "n" and the speakers "s" should be exactly the same, not only similar.
   Please make the descriptions of the characters and scene settings very visually descriptive. Dialogs should have 1 emoji.
     this is the format I want:
      {"title":"Lost dog","chars":[{"n":"Sarah","dsc":"a young woman with blue hair 👩"},{"n":"Lost Dog","dsc":"a yellow fur scared dog wandering around the city streets 🐕"}],"scenes":[{"isDark":0,"back":"City street in daylight, full of skycrapers","floor":"street concrete","actions":[{"s":"Sarah","txt":"Hey there, little guy. Are you lost? 😟"},{"s":"Narrator","txt":"Sarah checks the dog's collar and finds a phone number. ☎️"},{"s":"Lost Dog","txt":"Woof woof 🐶"},{"s":"Narrator","txt":"Sarah moves away from the dog 🚶‍♀️"},{"s":"Narrator","txt":"Sarah and the Lost Dog start running 🏃‍♀️🐕"}]},{"isDark":1,"back":"City street in nightime, full of skycrapers","floor":"street paved with wet concrete","newChars":[{"n":"Veterinarian","dsc":"a young man with a veterinarian gown 🧑‍⚕️"}],"actions":[{"s":"Veterinarian","txt":"Hello everyone 🙋‍♂️"}]}]}



 */

export default handler;