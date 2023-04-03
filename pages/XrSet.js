import {Controllers, Hands, VRButton, XR} from "@react-three/xr";
import {Canvas} from "@react-three/fiber";
import {Box, Circle, Float, Html, OrbitControls, Plane, RoundedBox, Sky, Text} from "@react-three/drei";

import CustomPlane from "./components/CustomPlane";
import {Suspense, useEffect, useState} from "react";
import {font, fontB} from "./index";


function Button ({onClick, text, position = [0,0,0]}) {
    const [pointerOver, setPointerOver] = useState(false);

    return  <><mesh position={position}
                    onPointerOver={() => {
                        setPointerOver(true);
                        if(typeof window !== 'undefined'){
                            document.body.style.cursor = "pointer";
                        }
                    }}
                    onPointerOut={() => {
                        setPointerOver(false);
                        if(typeof window !== 'undefined') {
                            document.body.style.cursor = "auto";
                        }
                    }}
                    onClick={() => {
                        onClick();
                        setPointerOver(false);
                    }}
    >
        <RoundedBox args={[1.7, 0.3, 0.1]}>
            <Text position={[0,0,0.1]} fontSize={0.22} font={fontB}>
                {text}
            </Text>
            <meshBasicMaterial color={pointerOver ?
                "#5ab5c5"
                :
                "#2868b2"
            } />
        </RoundedBox>
    </mesh>
    </>
}

function XrSet({ characterTextures, data, xtoryTitle, characters, charactersLoaded, xtoryLoaded, scenes, setNewCharacter, xtorySelected}){

    useEffect(() => {
        if (!xtoryLoaded){
            setCurrentSceneIndex(-1);
            setCurrentActionIndex(-1);
        }
    }, [xtoryLoaded])

    const [isXR, setIsXR] = useState(false);
    const [charsInScene, setCharsInScene] = useState([]);
    const [currentSceneIndex, setCurrentSceneIndex] = useState(-1);
    const [currentActionIndex, setCurrentActionIndex] = useState(0);


    const sceneLoaded = scenes?.length > 0;
    const scenePlaying = currentSceneIndex >= 0;

    const currentScene = scenes?.[currentSceneIndex];
    const currentAction = currentScene?.actions[currentActionIndex];
    const isDarkScene = currentScene?.isDark === 1 || false;

    const charactersShown = scenePlaying ? charsInScene : characters;

    const forward = () => {
        if(scenePlaying && currentActionIndex < currentScene.actions?.length -1){
            setCurrentActionIndex(currentActionIndex + 1);
        } else {
            setCharsInScene([])
            setCurrentActionIndex(-1);
            setCurrentSceneIndex(currentSceneIndex+1);
        }

    }

    const backward = () => {
        if(scenePlaying && currentActionIndex >= 0){
            setCurrentActionIndex(currentActionIndex - 1);
        } else {
            setCharsInScene([])
            setCurrentActionIndex(-1);
            setCurrentSceneIndex(currentSceneIndex-1);
        }
    }

    const currentIsNarrator = currentAction?.s === "Narrator";
    const charXBegin = -0.5 * (charactersShown?.length - 1);
    const currentTalkingIndex = charsInScene.map(char => char.n).indexOf(currentAction?.s);
    let dialogX = currentIsNarrator ? 0 : charXBegin + currentTalkingIndex;

    useEffect(() => {
        const nextAction = currentScene?.actions[currentActionIndex + 1];
        if(nextAction){
           // load images if needed
        }
        if(currentAction){

            const foundBefore = charsInScene.find(char => char.n === currentAction.s);
            if(!foundBefore || foundBefore === undefined){
                const foundExisting = characters.find(char => char.n === currentAction.s);
                console.log('wfffff', foundExisting, characters, currentAction.s)
                if (foundExisting){
                    setCharsInScene(prev => [...prev, foundExisting])
                } else {
                    if(!currentIsNarrator){
                        let newChars = currentScene.newChars || [{n: currentAction.s, dsc: "", e: ""}];

                        newChars.forEach(nc => {
                            setNewCharacter(nc);
                            setCharsInScene(prev => [...prev, nc])
                        })
                    }

                }
            }
        }
    }, [currentActionIndex])




    return <>
        <VRButton />
        <Canvas>
            <Suspense fallback={<></>}>
                <XR referenceSpace="local"
                    onSessionStart={() => {
                        setIsXR(true)
                    }}
                    onSessionEnd={() => {
                        setIsXR(false)
                    }}>
                    <Controllers />
                    <Hands />

                    <mesh  scale={isXR ? [0.6, 0.6, 0.6] :  [1, 1, 1]}
                           position={isXR ? [0, -0.2, -1.5] :  [0, 0, 0]}>
                        <mesh   position={[0, -1.1, 0.8]} >
                            <mesh position={[0,0.4,-0.1]}>

                                <Plane scale={[3.5,0.4,2]}>
                                    <meshBasicMaterial color={"#626e83"}/>
                                </Plane>

                                <Text
                                    font={font}
                                    depthOffset={-1}
                                      fontSize={0.08}
                                      position={[0,0,0.05]}
                                      color={"#ffffff"}
                                      textAlign="center"
                                >
                                    Xtended Xtory

                                    {data && (
                                        data.mediaSelected && ` of the ${data.characterSelected
                                            ? `${data.characterSelected.product} ` : ''}${
                                            data.mediaSelected}${data.characterSelected ?
                                            `: 
        ${data.characterSelected.character}`
                                            : '...'}`
                                    )}

                                    {scenePlaying && currentScene && `${xtoryTitle} - 
    Scene ${currentSceneIndex + 1}`}
                                </Text>
                            </mesh>

                            {sceneLoaded ?
                                <>
                                    {currentSceneIndex < 0 ?
                                        <>

                                            <Text
                                                font={fontB}
                                                fontSize={0.2} position={[0,0.67,-0.8]}>
                                                Main characters </Text>
                                            <Button text={`Start Xtory`} onClick={() => forward()}/>
                                        </>
                                    :
                                        <>
                                            {(currentActionIndex >= 0 || currentSceneIndex > 0) && <mesh scale={[0.5,0.5,0.5]}>
                                                <Button position={[-2.7, 0, 0]}
                                                        text={currentActionIndex < 0 ? `Prev Scene ${currentSceneIndex}` : "Prev Action"}
                                                        onClick={() => backward()}/></mesh>}
                                            {currentActionIndex < 0 ?
                                                <>
                                                    {currentScene ?
                                                        <Button position={[1, 0, 0]}
                                                            text={`Start Scene ${currentSceneIndex + 1}`}
                                                            onClick={() => forward()}/>
                                                            :

                                                        <Float  speed={50} // Animation speed, defaults to 1
                                                                rotationIntensity={0} // XYZ rotation intensity, defaults to 1
                                                                floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                                                                floatingRange={[0.01, 0.05]} // Range of y
                                                             >
                                                        <Text
                                                            font={fontB}
                                                            position={[1,0,0.1]} fontSize={0.22} color={"#000"}>
                                                            {xtoryLoaded ? 'The end' : 'Loading scene...'}
                                                        </Text>
                                                        </Float>                                                }
                                                </>
                                                :

                                                <>

                                                    <Button text="Next" onClick={() => forward()}/>
                                                </>

                                            }
                                        </>

                                    }

                                </>

                                :
                                xtorySelected && <Float
                                speed={50} // Animation speed, defaults to 1
                                rotationIntensity={0} // XYZ rotation intensity, defaults to 1
                                floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                                floatingRange={[0.01, 0.05]} // Range of y
                            >
                                <Text
                                    font={fontB}
                                    fontSize={0.2}
                                    color={"#2e7de7"}
                                >Loading {charactersLoaded ?
                                    `scene 1...`
                                    :
                                    "characters and scenes..."}</Text>

                                {/*
                                  <mesh position={[0, -0.35, 0]}>
                                    <Plane args={[loadBarW,0.3]}>
                                        <meshBasicMaterial color={"#5d5959"}/>
                                    </Plane>
                                    <Plane args={[loadW,0.3]} position={[0,0,0.04]}>
                                        <meshBasicMaterial color={"#2e7de7"}/>
                                    </Plane>
                                </mesh>
                                 */}

                            </Float>}
                        </mesh>


                        <mesh  position={[0, 0.5, -1.3]} >

                            {sceneLoaded && scenePlaying && currentScene?.back &&
                                <Text
                                    font={font}
                                    textAlign="center" anchorY="top" position={[0,0.6,0.1]} fontSize={0.18} maxWidth={2.5}>
                                {`Setting: 
                                
    ${currentScene?.back}
                                `}

                                    <meshBasicMaterial transparent opacity={currentActionIndex === -1 ? 1 : 0.2}/>
                            </Text>}
                            <mesh scale={[3.5,2,2]} >
                                <CustomPlane position={[0,0,0]} src={`back00`} showWhitePixels hasBorderRadius />
                                {/*[
                                    [-0.25,-0.5,0.75],
                                    [0.25,-0.5,0.25],
                                    [0.25,-0.5,0.75],
                                    [-0.25,-0.5,0.25],
                                ].map((shadowPos, i) => <CustomPlane
                                    key={'shadow' + i}
                                    position={shadowPos}
                                    rotation={[-Math.PI / 2, 0, 0]}
                                    scale={[0.5,0.5,0.5]}
                                    src={`floor00`} showWhitePixels />)
                                    */}

                                <CustomPlane
                                    position={[0,-0.5,0.5]}
                                    rotation={[-Math.PI / 2, 0, 0]}
                                    src={`floor00`} showWhitePixels />

                            </mesh>








                        </mesh>


                        {scenePlaying && currentAction && <mesh position={[dialogX,1.1,0]}>

                            <mesh position={[0,0,-0.1]}>

                                <RoundedBox args={[2.4,0.5,0.02]} position={[0,0,0]}>
                                    <meshBasicMaterial color={currentIsNarrator ? "#c49d75" : "#fff"}/>
                                </RoundedBox>
                                {!currentIsNarrator &&
                                    <Circle args={[0.2, 3]} position={[0, -0.26, 0]} scale={[0.3, 1, 1]}
                                            rotation={[0, 0, -Math.PI / 2]}/>
                                }
                            </mesh>
                            <Text fontSize={currentAction.txt?.length > 85 ? 0.08 : 0.12}
                                  position={[-0.2,0,0]}
                                  maxWidth={1.7}
                                  font={font}
                                  color={currentIsNarrator ? "#725335" : "#000"}>
                                {currentAction.txt}
                            </Text>

                            <Html transform position={[0.8,0,0]}>
                                <p className="char-desc"> {currentAction.e}</p>
                            </Html>
                        </mesh>
                        }

                        <mesh position={[charXBegin,0,0]}>
                            {charactersShown?.map((char, i) =>  {
                                const charTexture = characterTextures[char.n] || null;
                                return <mesh key={'char'+i+char.n}
                                                                position={[
                                                                    i
                                                                    ,0.2,0]}>
                                <Float
                                    speed={currentTalkingIndex === i ? 80 : 5} // Animation speed, defaults to 1
                                    rotationIntensity={0.3} // XYZ rotation intensity, defaults to 1
                                    floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                                    floatingRange={[0.01, 0.05]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
                                >
                                    <CustomPlane src={"char00"} texture={charTexture} />
                                    <mesh position={[0,charTexture ? 1 : 0,0.05]}>

                                        <Text
                                            position={[0,scenePlaying ? charTexture ? -1.6 : -0.6 : 0,0]}
                                            fontSize={0.08} color={"#000"} font={fontB}>
                                            {char.n}
                                        </Text>
                                        {(!charTexture || !scenePlaying) &&
                                        <Text
                                            font={font}
                                            anchorY="top"
                                            fontSize={0.06}
                                            lineHeight={1.3}
                                            position={[0,-0.08,0]} maxWidth={0.75}>
                                            {char.dsc}
                                            <meshBasicMaterial color={"#000"} transparent opacity={scenePlaying ? 0.5 : 1} />
                                        </Text>}



                                    </mesh>


                                    {!charTexture &&
                                    <Html transform position={[-0.2,0.37,0]}>
                                        <p className="char-desc"> {char.e}</p>
                                    </Html>}
                                </Float>
                                    <CustomPlane src={"char00"}
                                                 texture={charTexture}
                                                 isShadow position={[0, -0.65, -0.5]}
                                                 rotation={[-Math.PI/2, 0,0]}/>
                            </mesh>})}
                        </mesh>


                    </mesh>


                </XR>
            </Suspense>
            <OrbitControls makeDefault
                           panSpeed={0}
                           minDistance={1}
                           maxDistance={4}
                           maxPolarAngle={Math.PI / 1.5}
                           minPolarAngle={Math.PI - (Math.PI / 1.5)}
                           maxAzimuthAngle={Math.PI / 1.8}
                           minAzimuthAngle={-Math.PI / 1.8} />
            <Sky turbidity={isDarkScene ? 0.25 : 10}
                 rayleigh={isDarkScene ?  0.001 : 0.5}
                 inclination={isDarkScene ? 1 : 0.6}
                 mieCoefficient={isDarkScene ? 0.001 : 0.005}/>
        </Canvas>
    </>
}

export default XrSet;