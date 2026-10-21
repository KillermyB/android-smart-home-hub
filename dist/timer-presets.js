(function(root){
  'use strict';
  var presets=[
    {id:'tea',label:'Thé',minutes:3,tag:'Cuisine'},
    {id:'eggs',label:'Œufs',minutes:7,tag:'Cuisine'},
    {id:'pasta',label:'Pâtes',minutes:10,tag:'Cuisine'},
    {id:'oven',label:'Four',minutes:20,tag:'Cuisine'},
    {id:'laundry',label:'Lessive',minutes:65,tag:'Lavage'},
    {id:'dryer',label:'Sèche-linge',minutes:115,tag:'Lavage'},
    {id:'break',label:'Pause',minutes:5,tag:'Pause'}
  ];
  root.HubTimerPresets={
    items:presets,
    minutes:[1,3,5,10,15,25,30,45,60],
    duration:function(minutes){return minutes>=60?Math.floor(minutes/60)+' h'+(minutes%60?' '+String(minutes%60).padStart(2,'0'):''):minutes+' min';},
    clock:function(seconds){var n=Math.max(0,Math.ceil(seconds)||0);return (n>=3600?Math.floor(n/3600)+':':'')+String(Math.floor(n/60)%60).padStart(2,'0')+':'+String(n%60).padStart(2,'0');},
    find:function(id){return presets.find(function(p){return p.id===id;});}
  };
})(typeof window!=='undefined'?window:globalThis);
