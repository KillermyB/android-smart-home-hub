/* Small cover palettes, computed once per image and cached in memory. */
(function(root){
'use strict';
function palette(pixels){
 var bins=Array.from({length:12},function(){return {weight:0,hue:0};}),total=0;
 for(var i=0;i<pixels.length;i+=4){if(pixels[i+3]<128)continue;var r=pixels[i]/255,g=pixels[i+1]/255,b=pixels[i+2]/255,max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min;if(delta<.08||max<.12||min>.88)continue;var hue=max===r?((g-b)/delta)%6:max===g?(b-r)/delta+2:(r-g)/delta+4;hue=(hue*60+360)%360;var weight=delta*(.35+max),bin=bins[Math.floor(hue/30)%12];bin.weight+=weight;bin.hue+=hue*weight;total+=weight;}
 if(!total)return {a:'hsl(210, 24%, 19%)',b:'hsl(215, 22%, 10%)'};
 var ranked=bins.slice().sort(function(a,b){return b.weight-a.weight;}),first=Math.round(ranked[0].hue/ranked[0].weight),second=ranked.find(function(bin){if(!bin.weight)return false;var hue=bin.hue/bin.weight,diff=Math.abs(hue-first);return Math.min(diff,360-diff)>45;});
 return {a:'hsl('+first+', 38%, 23%)',b:'hsl('+Math.round(second?second.hue/second.weight:(first+28)%360)+', 30%, 11%)'};
}
var api={palette:palette};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HubMusicColors=api;
}(typeof window==='undefined'?this:window));
