import {useEffect, useMemo, useState} from "react";
import * as THREE from "three";

function CustomPlane({texture, position, scale, src, rotation, showWhitePixels = false, isShadow = false, hasBorderRadius = false}) {

    const NewShader = ({ theTexture}) => (
        <shaderMaterial
            transparent
            side={THREE.DoubleSide}
            attach="material"
            uniforms={{
                u_texture: { value: theTexture },
                u_threshold: { value: 0.97 },
                radius: { value: hasBorderRadius ? 0.57 : 1 },
                u_displacementMap: { value: isShadow ? null : theTexture },
                u_displacementScale: { value: 0.02 },
            }}
            vertexShader={`
                          varying vec2 v_uv;
uniform sampler2D u_displacementMap;
uniform float u_displacementScale;
                        
                          void main() {
                            v_uv = uv;
                            
                            // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                            
  vec4 displacement = texture2D(u_displacementMap, v_uv);
  vec3 displacedPosition = position + normal * u_displacementScale * (displacement.r * 2.0 - 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
                          }
                    `}
            fragmentShader={`
                      uniform sampler2D u_texture;
                      varying vec2 v_uv;
                            uniform float radius;
                        uniform float u_threshold;
                    

                      void main() {
                      
                   
                            vec4 color = texture2D(u_texture, v_uv);
                            if (${!showWhitePixels} && 
                            color.r > u_threshold && 
                            color.g > u_threshold && 
                            color.b > u_threshold) {
                              discard;
                            }
                            
                            vec3 filterColor = vec3(1.0); // Initialize filter color to white
                            float luminance = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722)); // Calculate the luminance of the color
                            if (luminance < 0.5) { // Dark colors
                                filterColor = vec3(1.0, 0.9, 1.0); // Map dark colors to purpleish tone
                            } else { // Light colors
                                filterColor = vec3(1.0, 0.9, 0.85); // Map light colors to orangeish tone
                            }
                            color.rgb *= filterColor; // Apply the color filter
                         
                         if(${isShadow}){
                            color.rgb = vec3(0.0);
                            color.a = 0.4;
                        }
                        
                       float alpha = smoothstep(radius, ${hasBorderRadius ? "0.4" : "0.7"}, length(v_uv - vec2(0.5))); gl_FragColor = vec4(color.rgb, color.a * alpha);
                        
                        
                        // gl_FragColor = color;
                      }
                    `}
        />
    )

    const originalTexture = useMemo(() => {
        if(typeof window !== 'undefined'){

            return new THREE.TextureLoader().load(`/imgs/${src}.png`)
        } else {
            return null;
        }
    }, [texture]);


    try{
        return (<>
                <mesh position={position} rotation={rotation} scale={scale} >
                    <planeGeometry args={[1, 1, 10, 10]}/>
                    {texture ?
                        <NewShader theTexture={texture} />
                        :
                        <NewShader theTexture={originalTexture} />
                    }


                </mesh>
            </>

        );
    } catch (e){
        console.log(e)
    }

}

export default CustomPlane;