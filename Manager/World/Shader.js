export default {
  vertexShader: `
  #include <common>
  #include <shadowmap_pars_vertex>
  // TODO: figure out how to read vertex color
  // #ifdef USE_COLOR
  //   varying vec3 vColor;
  // #endif

  varying vec2 vUv; 

  void main() {
      vUv = uv; 
      // vec3 objectNormal = vec3( normal );
      // vec3 transformedNormal = normalMatrix * objectNormal;
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

      // #include <begin_vertex>
      // #include <project_vertex>
      // #include <worldpos_vertex>
      // #include <shadowmap_vertex>
    }
  `,

  fragmentShader: `
    // #include <common>
    // #include <packing>
    // #include <bsdfs>
    // #include <lights_pars_begin>
    // #include <shadowmap_pars_fragment>
    // #include <shadowmask_pars_fragment>
    precision highp float;

    varying vec2 vUv;
    uniform sampler2D u_texture;
    uniform sampler2D u_letters_texture;
    uniform float u_time;
    uniform float lettersV;

    uniform float progress;

    float circle(in vec2 _st, in float _radius){
      vec2 dist = _st-vec2(0.5);
      return 1.-smoothstep(_radius-(_radius*0.005),
                           _radius+(_radius*0.005),
                           dot(dist,dist)*4.0);
    }

    void main() {
      vec2 uv = vUv;
      vec4 color = texture2D(u_texture, uv);

      vec4 colorLetters = texture2D(u_letters_texture, uv);
      vec3 lettersColor = vec3(0.85, 0.85, 0.85);
      // vec3 lettersColor = vec3(1., 0, 0);
      
      vec3 circleMask = vec3(circle(uv,1.0));

      uv.x += (cos(uv.y*5.+progress*4.+u_time*0.4)/20.0);


      vec3 alphaMask = circleMask * smoothstep(progress,progress+0.1,uv.x);

      gl_FragColor = vec4( mix(color.rgb, lettersColor, colorLetters.rgb * lettersV), alphaMask);

    }
  `,
};
