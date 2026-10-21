(function(root){
  'use strict';
  var stroke=4,bleed=1,cache=new WeakMap(),observer,node;
  // Bleed under the card clip: a single antialiased edge prevents a dark halo.
  // One pixel is clipped outside; the visible border remains three pixels wide.
  function geometry(width,height,radius){
    var inset=stroke/2-bleed,w=Math.max(1,width-2*inset),h=Math.max(1,height-2*inset),r=Math.max(0,Math.min(radius-inset,w/2,h/2)),x=inset,y=inset,right=x+w,bottom=y+h;
    return {length:2*(w+h-4*r)+2*Math.PI*r,path:'M '+(x+r)+' '+y+' H '+(right-r)+' A '+r+' '+r+' 0 0 1 '+right+' '+(y+r)+' V '+(bottom-r)+' A '+r+' '+r+' 0 0 1 '+(right-r)+' '+bottom+' H '+(x+r)+' A '+r+' '+r+' 0 0 1 '+x+' '+(bottom-r)+' V '+(y+r)+' A '+r+' '+r+' 0 0 1 '+(x+r)+' '+y+' Z'};
  }
  function resize(svg,width,height){
    var previous=cache.get(svg);if(width<=0||height<=0||previous&&previous.width===width&&previous.height===height)return previous;
    var g=geometry(width,height,parseFloat(getComputedStyle(svg.parentNode).borderTopLeftRadius)||25);
    var entry={width:width,height:height,length:g.length,line:svg.querySelector('[data-tile-progress]'),progress:null};
    svg.setAttribute('viewBox','0 0 '+width+' '+height);svg.querySelectorAll('path').forEach(function(path){path.setAttribute('d',g.path);});cache.set(svg,entry);return entry;
  }
  function paint(svg){
    var entry=cache.get(svg);if(!entry){var box=svg.getBoundingClientRect();entry=resize(svg,box.width,box.height);}if(!entry)return;
    var p=Math.max(0,Math.min(100,Number(svg.getAttribute('aria-valuenow'))||0));if(entry.progress===p)return;
    entry.line.setAttribute('stroke-dasharray',p>=100?'none':(entry.length*p/100)+' '+(entry.length+1));entry.line.style.strokeOpacity=p>0?'1':'0';entry.progress=p;
  }
  function mount(svg){
    if(node===svg){if(svg)paint(svg);return;}if(observer)observer.disconnect();observer=null;node=svg;if(!svg)return;
    paint(svg);if(typeof ResizeObserver!=='undefined'){observer=new ResizeObserver(function(entries){if(node!==svg)return;var rect=entries[0]&&entries[0].contentRect;if(rect){resize(svg,rect.width,rect.height);paint(svg);}});observer.observe(svg);}
  }
  root.HubMusicOrbit={geometry:geometry,mount:mount,paint:paint};
})(typeof window!=='undefined'?window:globalThis);
