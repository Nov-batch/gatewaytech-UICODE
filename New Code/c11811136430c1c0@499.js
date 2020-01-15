// https://observablehq.com/d/c11811136430c1c0@499
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Scratchy Eyes

A rough take of a colorful take on Processing’s [Arctangent example](https://processing.org/examples/arctangent.html).`
)});
  main.variable(observer()).define(["width","height","DOM","rough","mouse","circles","d3"], function*(width,height,DOM,rough,mouse,circles,d3)
{
  let canvas, context;
  
  if (this) {
    canvas = this, context = this.getContext("2d");
    context.clearRect(0, 0, width, height);
  } else {
    context = DOM.context2d(width, height), canvas = context.canvas;
    context.fillRule = "evenodd";
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.rc = rough.canvas(canvas);
  }

  yield canvas;
  let {left: cx, top: cy} = canvas.getBoundingClientRect();
  let {x: mx, y: my} = mouse;
  mx -= cx;
  my -= cy;
  
  for (let i = 0, n = circles.length; i < n; ++i) {
    const {x, y, r} = circles[i];
    context.save();
    context.translate(x, y);
    context.beginPath();
    context.arc(0, 0, r, 0, 2 * Math.PI);
    canvas.rc.circle(x, y, r * 2);
    context.fillStyle = d3.schemePastel2[i % 8];
    context.fill();
    const dx = mx - x, dy = my - y, l = Math.sqrt(dx ** 2 + dy ** 2);
    if (l < r * 2 / 3) {
      canvas.rc.circle(x + dx, y + dy, r / 3 * 2, {fill: "#000", roughness: 3, hachureGap: 1});
    } else {
      canvas.rc.circle(x + dx / l * r * 2 / 3, y + dy / l * r * 2 / 3, r / 3 * 2, {fill: "#333", hachureGap: 2});
    }
    context.restore();
  }
}
);
  main.variable(observer("mouse")).define("mouse", ["Generators"], function(Generators){return(
Generators.observe(notify => {
  const moved = event => notify({x: event.clientX, y: event.clientY});
  window.addEventListener("mousemove", moved);
  notify({x: window.innerWidth / 2, y: window.innerHeight / 2});
  return () => window.removeEventListener("mousemove", moved);
})
)});
  main.variable(observer("height")).define("height", function(){return(
600
)});
  main.variable(observer("padRadius")).define("padRadius", function(){return(
3
)});
  main.variable(observer("random")).define("random", ["d3","padRadius"], function(d3,padRadius){return(
d3.randomUniform(padRadius + 5, padRadius + 100)
)});
  main.variable(observer("circles")).define("circles", ["d3","random","width","height","padRadius"], function(d3,random,width,height,padRadius)
{
  const radii = d3.range(100).map(random);
  const circles = d3.packSiblings(radii.map(r => ({r})));
  for (const circle of circles) {
    circle.x += width / 2;
    circle.y += height / 2;
    circle.r -= padRadius;
  }
  return circles;
}
);
  main.variable(observer("rough")).define("rough", ["require"], function(require){return(
require("roughjs@2.0.0/dist/rough.min.js").catch(() => window.rough)
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("https://d3js.org/d3.v5.min.js")
)});
  return main;
}
