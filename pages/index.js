import Head from 'next/head'
import {useEffect, useState} from "react";
import extract from "extract-json-from-string";
import XrSet from "./XrSet";
import * as THREE from "three";

export const fontB = "https://rawcdn.githack.com/google/fonts/3b179b729ac3306ab2a249d848d94ff08b90a0af/apache/opensanshebrew/OpenSansHebrew-ExtraBold.ttf";
export const font = "https://rawcdn.githack.com/google/fonts/3b179b729ac3306ab2a249d848d94ff08b90a0af/apache/opensanshebrew/OpenSansHebrew-Regular.ttf";

export default function Home() {

    const [medias] = useState(
        [ "Movies", "Tv Shows", "Video Games", "Books", "Anime"]
    );
    const [mediaSelected, setMediaSelected] = useState();
    const [charactersLoaded, setCharactersLoaded] = useState(false);


    const [products, setProducts] = useState([]);
    const [xtendeds, setXtendeds] = useState([]);
    const [characterSelected, setCharacterSelected] = useState();
    const [written, setWritten] = useState("");
    const [xtoryLoaded, setXtoryLoaded] = useState(false);
    const lengths = {products: 6, shows: 4, characters: 4, xtendeds: 4};
    const [characters, setCharacters] = useState([
       // {"n":"Harry Potter","dsc":"A middle-aged wizard with messy black hair and glasses, scar on his forehead", "e": "⚡"},{"n":"Ginny Weasley","dsc":"A beautiful and kind-hearted witch with long red hair and freckles", "e": "🔥"},{"n":"James Sirius Potter","dsc":"Harry and Ginny's eldest son, with messy black hair and glasses, just like his father", "e": "⚡"},{"n":"Albus Severus Potter","dsc":"Harry and Ginny's middle child, with messy black hair and glasses, just like his father, but with a kind and sensitive personality", "e": "💙"}
        //{"n":"Harry Potter","dsc":"A middle-aged wizard with messy black hair and glasses, scar on his forehead", "e": ""}
        {"n":"","dsc":"", "e": ""}
        ]
    );

    const [scenes, setScenes] = useState(
        []
     //[{"isDark":0,"back":"The Potter family's cozy living room, with a roaring fire and pictures of loved ones on the walls.","floor":"Hardwood","actions":[{"s":"Harry Potter","txt":"Kids, come downstairs please! We need to talk.","e":"🗣️"},{"s":"James Sirius Potter","txt":"What's up, Dad? Did something happen?","e":"👦"},{"s":"Albus Severus Potter","txt":"Is everything okay?","e":"🧒"},{"s":"Lily Luna Potter","txt":"Did we do something wrong?","e":"👧"},{"s":"Ginny Weasley","txt":"No, no, nothing like that. We just need to talk about something important.","e":"🗣️"},{"s":"Harry Potter","txt":"Your mother and I have been talking, and we've decided that it's time for us to take a more active role in your lives.","e":"🗣️"},{"s":"James Sirius Potter","txt":"What do you mean, Dad?","e":"👦"},{"s":"Harry Potter","txt":"We mean that we want to be more involved in your education and your daily lives. We want to make sure that you're safe and happy.","e":"🗣️"},{"s":"Albus Severus Potter","txt":"But we're already safe and happy, Dad.","e":"🧒"},{"s":"Ginny Weasley","txt":"We know, sweetheart. But we just want to make sure that nothing bad ever happens to you.","e":"🗣️"},{"s":"Lily Luna Potter","txt":"We understand, Mum. But what does this mean for us?","e":"👧"},{"s":"Harry Potter","txt":"It means that we're going to be more involved in your schoolwork, and we're going to be stricter about your curfew and your activities.","e":"🗣️"},{"s":"James Sirius Potter","txt":"But Dad, we're not little kids anymore. We can take care of ourselves.","e":"👦"},{"s":"Harry Potter","txt":"I know you can, son. But we just want to make sure that you're always safe.","e":"🗣️"}]},{"isDark":0,"back":"The Hogwarts Express, on the way to Hogwarts School of Witchcraft and Wizardry.","floor":"Wooden","actions":[{"s":"Albus Severus Potter","txt":"I can't believe we're going back to Hogwarts already.","e":"🧒"},{"s":"James Sirius Potter","txt":"I know, right? Summer went by so fast.","e":"👦"},{"s":"Lily Luna Potter","txt":"I'm so excited to see all my friends again!","e":"👧"},{"s":"Albus Severus Potter","txt":"I'm a little nervous, to be honest. What if I don't do well in my classes?","e":"🧒"},{"s":"Harry Potter","txt":"Don't worry, Al. You'll do great. And if you ever need any help, your mother and I are always here for you.","e":"🗣️"},{"s":"Ginny Weasley","txt":"That's right. We're always here to support you, no matter what.","e":"🗣️"},{"s":"James Sirius Potter","txt":"Thanks, Mum and Dad. You're the best.","e":"👦"},{"s":"Lily Luna Potter","txt":"Yeah, thanks! We love you!","e":"👧"}]},{"isDark":1,"back":"The Forbidden Forest, on a dark and stormy night.","floor":"Muddy","newChars":[{"n":"Delilah","dsc":"A young witch who is lost in the forest. She has curly brown hair and is wearing a tattered cloak.","e":"🧙‍♀️"}],"actions":[{"s":"Delilah","txt":"Hello? Is anyone there?","e":"👀"},{"s":"Harry Potter","txt":"Who's there?","e":"🗣️"},{"s":"Delilah","txt":"Oh, thank goodness. I'm lost and I don't know how to get back to Hogwarts.","e":"😥"},{"s":"Ginny Weasley","txt":"Don't worry, we'll help you. What's your name?","e":"🗣️"},{"s":"Delilah","txt":"My name is Delilah. I'm a first year at Hogwarts.","e":"🧙‍♀️"},{"s":"Harry Potter","txt":"Well, Delilah, you're in luck. We happen to know these woods like the back of our hands.","e":"🗣️"},{"s":"Ginny Weasley","txt":"We'll take you back to Hogwarts and make sure you get safely to your dormitory.","e":"🗣️"},{"s":"Delilah","txt":"Thank you so much. I don't know what I would have done without you.","e":"😭"}]},{"isDark":0,"back":"The Great Hall at Hogwarts, decorated for the annual Christmas feast.","floor":"Stone","actions":[{"s":"James Sirius Potter","txt":"This feast looks amazing!","e":"👦"},{"s":"Albus Severus Potter","txt":"I can't wait to eat all this food!","e":"🧒"},{"s":"Lily Luna Potter","txt":"Look, there's Father Christmas!","e":"👧"},{"s":"Harry Potter","txt":"This is always my favorite part of the year at Hogwarts.","e":"🗣️"},{"s":"Ginny Weasley","txt":"Mine too. It's so nice to be here with all our friends and family.","e":"🗣️"},{"s":"Albus Severus Potter","txt":"Speaking of family, can we open our presents now?","e":"🧒"},{"s":"James Sirius Potter","txt":"Yeah, I want to see what I got!","e":"👦"},{"s":"Lily Luna Potter","txt":"Me too! Please, Mum and Dad?","e":"👧"},{"s":"Harry Potter","txt":"Okay, okay. Let's open presents.","e":"🗣️"}]},{"isDark":0,"back":"The Potter family's backyard, where they are playing a game of Quidditch.","floor":"Grass","actions":[{"s":"Harry Potter","txt":"Okay, kids, let's see what you've got!","e":"🗣️"},{"s":"James Sirius Potter","txt":"I've got the Quaffle! Coming in for a goal!","e":"👦"},{"s":"Albus Severus Potter","txt":"Not if I can help it! Wingardium Leviosa!","e":"🧒"},{"s":"Lily Luna Potter","txt":"Hey, you two, pass it over here! I'm open!","e":"👧"},{"s":"Ginny Weasley","txt":"Be careful, Lily! Don't fly too close to the ground!","e":"🗣️"},{"s":"Harry Potter","txt":"Great job, everyone! You're all getting so good at Quidditch.","e":"🗣️"},{"s":"James Sirius Potter","txt":"Thanks, Dad. We couldn't have done it without you and Mum.","e":"👦"},{"s":"Albus Severus Potter","txt":"Yeah, you guys are the best parents ever.","e":"🧒"},{"s":"Lily Luna Potter","txt":"We love you!","e":"👧"},{"s":"Ginny Weasley","txt":"We love you too, kids. Always.","e":"🗣️"}]},{"isDark":0,"back":"The Potter family's living room, where they are all gathered together.","floor":"Hardwood","actions":[{"s":"Harry Potter","txt":"You know, kids, your mother and I were thinking the other day about how lucky we are to have you all.","e":"🗣️"},{"s":"Ginny Weasley","txt":"That's right. You three are the best things that ever happened to us.","e":"🗣️"},{"s":"James Sirius Potter","txt":"Aw, Mum, Dad, you're making us blush.","e":"👦"},{"s":"Albus Severus Potter","txt":"But seriously, we love you guys too.","e":"🧒"},{"s":"Lily Luna Potter","txt":"Yeah, you're the best parents ever.","e":"👧"},{"s":"Harry Potter","txt":"And you're the best kids ever. We're so proud of you.","e":"🗣️"},{"s":"Ginny Weasley","txt":"And we always will be. No matter what.","e":"🗣️"},{"s":"James Sirius Potter","txt":"Thanks, Mum and Dad. We love you.","e":"👦"},{"s":"Albus Severus Potter","txt":"Yeah, we love you!","e":"🧒"},{"s":"Lily Luna Potter","txt":"We love you too!","e":"👧"}]},{"isDark":0,"back":"The Potter family's backyard, where they are having a barbecue with friends and family.","floor":"Grass","actions":[{"s":"Harry Potter","txt":"I can't believe how fast you kids are growing up.","e":"🗣️"},{"s":"Ginny Weasley","txt":"I know. It seems like just yesterday we were changing diapers and singing lullabies.","e":"🗣️"},{"s":"James Sirius Potter","txt":"And now we're playing Quidditch and casting spells!","e":"👦"},{"s":"Albus Severus Potter","txt":"And going on adventures at Hogwarts!","e":"🧒"},{"s":"Lily Luna Potter","txt":"And having fun with our friends!","e":"👧"},{"s":"Harry Potter","txt":"It's been an amazing journey, watching you grow up and become the wonderful people you are today.","e":"🗣️"},{"s":"Ginny Weasley","txt":"We couldn't be prouder of you.","e":"🗣️"},{"s":"James Sirius Potter","txt":"Thanks, Mum and Dad. We love you.","e":"👦"},{"s":"Albus Severus Potter","txt":"Yeah, we love you!","e":"🧒"},{"s":"Lily Luna Potter","txt":"We love you too!","e":"👧"}]}]
    );


    const data = `[[{"n":"Harry Potter","dsc":"A tall and lean man with jet-black hair and glasses","e":"🧙‍♂️"},{"n":"Ginny Weasley","dsc":"A fiery red-haired woman with a kind heart","e":"🧑‍🦰"},{"n":"James Potter","dsc":"Harry and Ginny's eldest son with messy black hair and green eyes","e":"👦"},{"n":"Albus Potter","dsc":"Harry and Ginny's middle child with messy black hair and green eyes","e":"👦"},{"n":"Lily Potter","dsc":"Harry and Ginny's youngest child with fiery red hair and bright green eyes","e":"👧"}],[{"isDark":0,"back":"The Potter family's cozy living room","floor":"Wooden floorboards","actions":[{"s":"James Potter","txt":"Dad, can we go to the Quidditch game today?","e":"🏟️"},{"s":"Harry Potter","txt":"I'm sorry, son. I have to work today.","e":"💼"},{"s":"Albus Potter","txt":"But Dad, you promised we could go!","e":"😢"},{"s":"Ginny Weasley","txt":"It's okay, boys. Why don't we have a family game of Quidditch in the backyard?","e":"🏡"},{"s":"Lily Potter","txt":"Yay! I want to be the Seeker!","e":"🎉"}]},{"isDark":0,"back":"The Hogwarts Express train platform","floor":"Cobbled stones","actions":[{"s":"James Potter","txt":"I can't wait to go back to Hogwarts!","e":"📚"},{"s":"Albus Potter","txt":"I hope I get sorted into Gryffindor like you, James.","e":"🦁"},{"s":"Lily Potter","txt":"I'm nervous about going to Hogwarts for the first time.","e":"😬"},{"s":"Harry Potter","txt":"Don't worry, Lily. You'll love it. And remember, the Sorting Hat takes your choice into account.","e":"🧙‍♂️"},{"s":"Ginny Weasley","txt":"We're so proud of all of you.","e":"🥰"}]},{"isDark":1,"back":"The Forbidden Forest","floor":"Dirt and leaves","actions":[{"s":"Albus Potter","txt":"Dad, we're lost!","e":"😱"},{"s":"Harry Potter","txt":"Don't worry, Albus. We'll find our way out.","e":"🧭"},{"s":"James Potter","txt":"I think we should have gone left at that last tree.","e":"🌳"},{"s":"Lily Potter","txt":"I'm scared.","e":"😢"},{"s":"Ginny Weasley","txt":"Hold my hand, Lily. We'll get through this together.","e":"🤝"}]},{"isDark":0,"back":"The Great Hall at Hogwarts","floor":"Stone tiles","actions":[{"s":"Albus Potter","txt":"I can't believe I'm going to be in Gryffindor!","e":"🦁"},{"s":"James Potter","txt":"I knew you would be!","e":"👍"},{"s":"Lily Potter","txt":"I'm so happy for you, Albus!","e":"😊"},{"s":"Harry Potter","txt":"I'm proud of all of you, no matter which house you're in.","e":"🥰"},{"s":"Ginny Weasley","txt":"Let's celebrate with some pumpkin juice!","e":"🍹"}]},{"isDark":0,"back":"The Potter family's backyard","floor":"Grass","actions":[{"s":"James Potter","txt":"Dad, can we have a family game of Quidditch again?","e":"🏟️"},{"s":"Harry Potter","txt":"Of course, son. But this time, let's make it a little more interesting.","e":"😏"},{"s":"Albus Potter","txt":"What do you mean?","e":"🤔"},{"s":"Harry Potter","txt":"Let's play a game of Capture the Snitch. The first team to catch the Snitch wins!","e":"⚡"},{"s":"Lily Potter","txt":"I want to be on Dad's team!","e":"🎉"}]},{"isDark":0,"back":"The Potter family's living room","floor":"Wooden floorboards","actions":[{"s":"Ginny Weasley","txt":"I can't believe how fast you kids are growing up.","e":"😢"},{"s":"Harry Potter","txt":"I know. It seems like just yesterday we were fighting Voldemort together.","e":"🗡️"},{"s":"James Potter","txt":"I want to be an Auror like you, Dad.","e":"👮‍♂️"},{"s":"Albus Potter","txt":"I want to be a healer like Mum.","e":"👩‍⚕️"},{"s":"Lily Potter","txt":"And I want to be a Quidditch player like all of you!","e":"🏆"}]}]]`



  const getProducts = async (tvNetwork, prevProducts = []) => {

      if(prevProducts?.length <= 0){
          setProducts([])
      }
      setCharacterSelected(null);

    setMediaSelected(tvNetwork);



      console.log(`Dynamic Prompt to text-davinci-002: 
        
with no human conversation or extra explanations, list me in valid json format 4 ${tvNetwork}  and 4 characters each, format like this example:
[{"name": "${tvNetwork} 1", "characters": ["character 1", "character 2", "character 3", "character 4"]}, {"name": "${tvNetwork} 2", "characters": ["char 1", "char 2", "char 3", "char 4"]}]

        `)
      let newTry = "";
      let prevProductsList ="";
      prevProducts.forEach(prod => prevProductsList += prod.name + ", ");
      console.log(prevProductsList);
      const response = await fetch(`/api/getCharacters?network=${tvNetwork}&exclude=${prevProductsList}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          const error = new Error(response.statusText);

          error.code = "THIS_IS_A_CUSTOM_ERROR_CODE";
          return error;
      }

      const data = response.body;
      if (!data) {
          return;
      }
      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);
          newTry += chunkValue;
          let productsLenght = 0;
          try{

              let newTryNoArray = newTry;
              if( newTry.split("")[0] === "["){
                  newTryNoArray = newTryNoArray.substring(1);
              }
              const extracted = extract(newTryNoArray);
              if( extracted?.length > productsLenght){
                  productsLenght++;
                  setProducts([...prevProducts, ...extracted]);
                  //setProducts(extracted);
              }

          } catch (e){
              console.log(e, newTry);
          }
      }
      if(newTry.split("")[0] !== "["){
          newTry = "[" + newTry;
      }
      console.log('zzzzz', JSON.parse(newTry))
      setProducts([...prevProducts, ...JSON.parse(newTry)])
  };

  const getXtendeds = async (character, product) => {
      setXtendeds([]);
      setCharacterSelected({character, product});
      let newTry = "";
      const characterAndProduct = `${character} from ${product}`;
      const response = await fetch(`/api/getXtendeds?characterAndProduct=${characterAndProduct}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },

      });

      if (!response.ok) {
          const error = new Error(response.statusText);

          error.code = "THIS_IS_A_CUSTOM_ERROR_CODE";
          return error;
      }

      const data = response.body;
      if (!data) {
          return;
      }
      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);
          newTry += chunkValue;
          let productsLenght = 0;
          try{

              let newTryNoArray = newTry;
              if( newTry.split("")[0] === "["){
                  newTryNoArray = newTryNoArray.substring(1);
              }
              setWritten(newTry);
              const extracted = extract(newTryNoArray);
              if( extracted?.length > productsLenght){
                  productsLenght++;
                  setXtendeds(extracted);
                  //setProducts(extracted);
              }

          } catch (e){
              console.log(e, newTry);
          }
      }
      if(newTry.split("")[0] !== "["){
          newTry = "[" + newTry;
      }
      console.log('zzzzz', JSON.parse(newTry))
      setXtendeds(JSON.parse(newTry))
      setWritten("");
  };


  const [xtorySelected, setXtorySelected] = useState();
  const [xtoryTitle, setXtoryTitle] = useState("");

    const getXtory = async (character, product, xtended) => {

        setCharacters([]);
        setCharacterTextures([]);
        setScenes([]);
        setXtorySelected(xtended || {title: "Original", dsc: ""});
        setXtoryLoaded(false);

        let newTry = "";
        const charProdAndPlot = xtended && `${character} from ${product}, with the story being titled "${xtended.title}" and the plot about "${xtended.desc}"`;
        const response = await fetch(`/api/getXtory${xtended ? `?charProdAndPlot=${charProdAndPlot}` : ""}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },

        });

        if (!response.ok) {
            const error = new Error(response.statusText);

            error.code = "THIS_IS_A_CUSTOM_ERROR_CODE";
            return error;
        }

        const data = response.body;
        if (!data) {
            return;
        }
        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            newTry += chunkValue;
            let productsLenght = 0;
            try{

                setWritten(newTry);

                if(newTry.includes("\"scenes\": [")){

                    const scenesArr1 = newTry.split("\"scenes\": [");
                    const scenesArr2 = newTry.split("\"scenes\":[");
                    if(scenesArr1?.length > 1 || scenesArr2.length > 1){
                        const scenesArr = scenesArr1?.length > scenesArr2.length ? scenesArr1 : scenesArr2;

                        if(!charactersLoaded){
                            setCharactersLoaded(true);
                        }
                        //setCountScenesLoaded((scenesArr[1].match(/isDark/g) || []).length);
                        try{
                             setScenes(extract(scenesArr[1]));
                        } catch (e) {
                            //console.log('aaaaaaaa', e)
                        }
                    }

                } else {
                    const chars = newTry.split("\"characters\": [");
                    const chars2 = newTry.split("\"characters\":[");
                    if(chars?.length > 1 || chars2?.length > 1){
                        const charsFound = chars?.length > chars2?.length ? chars : chars2;
                        setXtoryTitle(charsFound[0].replace("{\"title\":\"","").replace("\",",""));

                        try{
                            const extracted = extract(charsFound[1]);
                            setCharacters(extracted);
                        } catch (e) {
                            console.log('aaaaaaaa', e)
                        }
                    }
                }
                //setWritten(newTry);
                const extracted = extract(newTry);
                if( extracted?.length > productsLenght){
                    productsLenght++;
                    //setXtendeds(extracted);
                    //setProducts(extracted);
                }

            } catch (e){
                console.log(e, newTry);
            }
        }

        if(newTry.split("")[0] !== "{"){
            newTry = "{" + newTry;
        }

        setXtoryLoaded(true);
        const newData =  JSON.parse(newTry);
        console.log('zzzzz',newData)

        setCharacters(newData.characters);
        setScenes(newData.scenes);
        setWritten("");
        //setXtendeds(JSON.parse(newTry))
        setWritten("");
    };


    const productsLoaded = products?.length >= lengths.shows;
  const xtendedsLoaded = xtendeds?.length >= lengths.xtendeds;



    const getTexture = (data) => {
       return new THREE.TextureLoader().load(data)
    };
    const getImageAI = async (name, imageDescription) => {

        let newTry = "";

        const description = `${imageDescription} ${
            (mediaSelected && characterSelected) ? ` from the ${mediaSelected} ${characterSelected.product}` : ""} 
            `;


            const response = await fetch(`/api/getImageAI`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({description: description})

            })

            if (!response.ok) {
                const error = new Error(response.statusText);

                error.code = "THIS_IS_A_CUSTOM_ERROR_CODE";
                return error;
            }

            const data = response.body;
            if (!data) {
                return;
            }
            const reader = data.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                newTry += chunkValue;
            }


            setCharacterTextures(prev => {


                prev[name] = getTexture(`data:image/png;base64,${newTry.replace("\"","").replace("\"","")}`);
                return prev;
            })

        return null;


    };

    const [characterTextures, setCharacterTextures] = useState({});
    const [characterTexturesFlags, setCharacterTexturesFlags] = useState({});
    const [prevChars, setPrevChars] = useState([]);

    const checkCharTexturesFlags = (char) => {
        if(char?.n && characterTexturesFlags[char.n] === undefined){
            if(isImagesOn && typeof window !== 'undefined'){
                getImageAI(char.n, `${char.n} ${char.dsc}`);
            }
        }
    }

  useEffect(()=> {
      if(characters?.length !== prevChars?.length && characters[0]?.n){


          characters.forEach((char) => {
              checkCharTexturesFlags(char);
              setCharacterTexturesFlags(prev => ({...prev, ...{[char.n]: true}}))

              /*
              setCharacterTextures(prev => {
                  if(prev[i] === undefined){
                      //getImageAI(char, i);

                      setCharacterTextures(prev => {

                          console.log('aaaaaaaaw')
                          prev[i] = getTexture(`data:image/png;base64,${newTry.replace("\"","").replace("\"","")}`);
                          return prev;
                      })
                  }
                 return prev;
              });


              if(characterTextures[i] === undefined){
                  //getImageAI(char, i);

                  //const charWithSrc = {...char, texture: getImageAI(char)};
                  //const charExcludeCurrent = characters.filter(charac => charac.n !== char.n);
                  //setCharacters([...charExcludeCurrent, charWithSrc])
              }
               */
          });
      }
      setPrevChars(characters);


  }, [characters]);



    const [isImagesOn, setIsImagesOn] = useState(true);

  return (

    <>
      <Head>
        <title>Xtended XtoRies - AI Generated</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>

          <div className="images-checkbox">
              <label>
                  <input type="checkbox" name="myCheckbox" checked={isImagesOn} onChange={(e) => setIsImagesOn(e.target.checked)}/>
                  <small><small>Generate AI Images for characters?</small></small>
              </label>
              <p><small><small>{`Please refrain from generating images if you're only testing text generation.`}
              <br />
              <small><small>
                  {`Otherwise the token quota might collapse this trial page.`}
              </small></small>
              </small></small></p>
          </div>
          <div className="container">
              <div className="content">
                  <div className="dev-backlog">
                      <div>
                          <big>Dev backlog:</big>
                      </div>
                      <div>
                          ● The story hider countdown is working incorrectly after multiple trivias. This is a React, not an AI error. For now refreshing the page is recommended for each trivia.
                      </div>
                      <div>
                          ● Loading speeds might be slow dependant on OpenAi servers.
                      </div>
                  </div>
                  <h1>Xtended XtoRies - AI Generated</h1>
                  <small><small>
{`All the content is being generated by OpenAI models, either ChatGPT, text-davinci-002 or Dall-e.`}
                      <br/>
{`As a BETA, there's still lots of work to do to parse correctly the responses received. Please refresh if you find an error.`}
                      <br/>
{`You can rotate the 3D scene on the right by dragging with your mouse`}
<br/>
{`or actually step inside by navigating the same url in the browser of a VR headset clicking the Enter VR button.`}
                  </small></small>

                  <div className="group">
                      <h3>Create an original Xtory:</h3>
                      <button
                          onClick={()=> getXtory()}>
                          Original Xtory
                      </button>
                      <h3>Or get Xtories of characters from:</h3>
                      {  medias.map(media => <button
                          onClick={()=> getProducts(media)}
                          key={media}>
                          {media}
                      </button>)}
                  </div>

                  {
                      mediaSelected && <>
                          <div className={productsLoaded ? '' : 'blink'}>
                              <h3>Choose a Character to Xtend their XtoRy between these <big>{mediaSelected}</big>: </h3>

                              <ul>
                                  {products.map(show => <li key={show.name}>
                                      {show.name}
                                      <div>
                                          {show.characters.map(character => <button
                                              onClick={() => getXtendeds(character, show.name)}
                                              key={character}>
                                              {character}
                                          </button>)}
                                      </div>
                                  </li>)}
                              </ul>
                              {productsLoaded &&
                                  <button className="action-button" onClick={() => getProducts(mediaSelected, products)}>
                                      Show more {mediaSelected}
                                  </button>
                              }

                          </div>
                          {characterSelected && <div className={xtendedsLoaded ? '' : 'blink'}>
                              <h3>Choose 1 XtoRy to Xtend about <big>{characterSelected.character}</big> from <big>{characterSelected.product}</big>: </h3>

                              <ul>
                                  {xtendeds?.map(xtended => <li key={xtended.title}>
                                      <button  onClick={() => getXtory(
                                          characterSelected.character,
                                          characterSelected.product,
                                              { title:  xtended.title, desc: xtended.desc}
                                          )}
                                      >{xtended.title}</button>
                                      <p><small>{xtended.desc}</small></p>
                                  </li>)}
                              </ul>
                              {!xtorySelected &&
                              <code>
                                  {written}
                              </code>}
                          </div>}

                      </>
                  }

                  {xtorySelected &&

                  <>

                      <h1>Xtory: {xtorySelected.desc ? xtorySelected.title : xtoryTitle}</h1>
                      <h3>Characters:</h3>
                      <br />
                      <ul>
                          {charactersLoaded ?
                              characters.map(char => <li key={char.n}>
                                  <b>{char.n}</b>:
                                  <br/>
                                  {char.dsc}
                              </li>)
                              :
                              <li>
                                  <code>{JSON.stringify(characters)}</code>
                              </li>
                          }
                      </ul>

                      <h3>Scenes:</h3>


                      <ol>
                          {scenes.map(scene => <li key={scene.back}>
                              <b>Background: </b>{scene.back}
                              <br/>
                              <b>Floor texture: </b>{scene.floor}
                              <br/>
                              <b>isDark: </b>{scene.isDark}
                              <br/>
                              {scene.newChars &&
                                  <>

                                      <b>New Chars: </b>
                                      <br />
                                      <ul>
                                          {scene.newChars.map(newChar => <li key={newChar.n}>
                                              <b>{newChar.n}: </b>{newChar.dsc}
                                          </li>)}
                                      </ul>
                                  </>
                              }
                              <b>Actions: </b>
                              <br />
                              <ul>
                                  {scene.actions.map(action => <li key={action.txt}>
                                      <b>{action.s}</b>: {action.txt} {action.e}
                                  </li>)}
                              </ul>
                          </li>)}
                      </ol>

                      <code style={{opacity:0.3}}><small><small>{written}</small></small></code>

                  </>
                  }


              </div>

              <div className="canvas-container">


                  <XrSet data={
                      {mediaSelected, characterSelected}
                  }
                         xtoryTitle={xtoryTitle}
                         setNewCharacter={(newChar)=>setCharacters(prev => {
                             return [...prev, newChar]
                         })}
                         scenes={scenes}
                         charactersLoaded={charactersLoaded}
                         characters={characters}
                         xtoryLoaded={xtoryLoaded}
                         xtorySelected={xtorySelected}
                         characterTextures={characterTextures}
                  />

              </div>


          </div>



      </main>
    </>
  )
}
