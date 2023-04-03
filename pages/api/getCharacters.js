import { OpenAIStream } from "./OpenAIStream";



export const config = {
    runtime: "edge",
};

const handler = async (req, res) => {
    const { searchParams } = new URL(req.url)
    const network = searchParams.get('network');
    const exclude = searchParams.get('exclude');


    const payload = {
        model: "text-davinci-002",
        prompt: `with no human conversation or extra explanations, list me in valid json format 4 (four) of the most popular ${network} 
         ${exclude && exclude.length > 1 ? `(exclude ${exclude} from the list) ` : ' '}
         and for each list 4 (four) characters, their name and an emoji, format like this example:
[{"name": "${network} 1", "characters": ["character 1", "character 2", "character 3", "character 4"]}, {"name": "${network} 2", "characters": ["char 1", "char 2", "char 3", "char 4"]}, {}, ñ{]`,
        temperature: 0.9,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 200,
        n: 1,
        stream: true,
    };

    const stream = await OpenAIStream(payload);
    return new Response(stream);
};

export default handler;