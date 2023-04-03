import { createParser } from "eventsource-parser";

export async function OpenAIStream(payload, isGPT3 = false) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let counter = 0;

    const res = await fetch(`https://api.openai.com/v1/${isGPT3 ? "chat/" : ""}completions`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.API_KEY_OPENAI}`,
        },
        method: "POST",
        body: JSON.stringify(payload),
    });


    console.log(isGPT3)

    const stream = new ReadableStream({
        async start(controller) {
            function onParse(event) {
                if (event.type === "event") {
                    const data = event.data;
                    if (data === "[DONE]") {
                        controller.close();
                        return;
                    }
                    try {
                        const json = JSON.parse(data);
                        const text = isGPT3 ? json.choices[0].delta.content : json.choices[0].text;
                        if (text && counter < 2 && (text.match(/\n/) || [])?.length) {
                            return;
                        }
                        const queue = encoder.encode(text);
                        controller.enqueue(queue);
                        counter++;
                    } catch (e) {
                        controller.error(e);
                    }
                }
            }

            const parser = createParser(onParse);
            for await (const chunk of res.body) {
                parser.feed(decoder.decode(chunk));
            }
        },
    });

    return stream;
}