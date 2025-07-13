vec2 uv = gl_FragCoord.xy / resolution.xy;
float noise = randCustom(uv * uTime * 10.0);

// Sample noise as grayscale
vec3 noiseColor = vec3(noise);

// Vignette effect
float vignette = smoothstep(0.8, 0.2, distance(uv, vec2(0.5)));
noiseColor *= 1.0 + (1.0 - vignette) * 0.6;

// Edge shadow
float edgeShadow = smoothstep(0.5, 0.8, distance(uv, vec2(0.5)));
noiseColor *= 1.0 - edgeShadow * 0.4;

// Blend original and noise
gl_FragColor.rgb = mix(gl_FragColor.rgb, noiseColor, 0.5);
gl_FragColor.a = 1.0;
