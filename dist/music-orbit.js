(function(root){
  'use strict';
  // Physical SVG coordinates avoid percentage geometry / pathLength rounding on old GPUs.
  function geometry(width,height,radius){
    var inset=3,w=Math.max(1,width-2*inset),h=Math.max(1,height-2*inset),r=Math.max(0,Math.min(radius-inset,w/2,h/2)),x=inset,y=inset,right=x+w,bottom=y+h;
    return {length:2*(w+h-4*r)+2*Math.PI*r,path:'M '+(x+r)+' '+y+' H '+(right-r)+' A '+r+' '+r+' 0 0 1 '+right+' '+(y+r)+' V '+(bottom-r)+' A '+r+' '+r+' 0 0 1 '+(right-r)+' '+bottom+' H '+(x+r)+' A '+r+' '+r+' 0 0 1 '+x+' '+(bottom-r)+' V '+(y+r)+' A '+r+' '+r+' 0 0 1 '+(x+r)+' '+y+' Z'};
  }
  var observer,node;
  function paint(svg){
    var box=svg.getBoundingClientRect();if(!box.width||!box.height)return;
    var g=geometry(box.width,box.height,parseFloat(getComputedStyle(svg.parentNode).borderTopLeftRadius)||25),p=Math.max(0,Math.min(100,Number(svg.getAttribute('aria-valuenow'))||0));
    svg.setAttribute('viewBox','0 0 '+box.width+' '+box.height);
    svg.querySelectorAll('path').forEach(function(path){path.setAttribute('d',g.path);});
    var line=svg.querySelector('[data-tile-progress]');line.setAttribute('stroke-dasharray',p>=100?'none':(g.length*p/100)+' '+(g.length+1));line.style.strokeOpacity=p>0?'1':'0';
  }
  function mount(svg){if(observer)observer.disconnect();node=svg;if(!svg)return;paint(svg);if(typeof ResizeObserver!=='undefined'){observer=new ResizeObserver(function(){if(node===svg)paint(svg);});observer.observe(svg);}}
  root.HubMusicOrbit={geometry:geometry,mount:mount,paint:paint};
})(typeof window!=='undefined'?window:globalThis);
