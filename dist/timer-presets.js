(function(root){
  'use strict';
  var presets=[
    {id:'tea',label:'Thé',minutes:3,tag:'Cuisine'},
    {id:'eggs',label:'Œufs',minutes:7,tag:'Cuisine'},
    {id:'pasta',label:'Pâtes',minutes:10,tag:'Cuisine'},
    {id:'oven',label:'Four',minutes:20,tag:'Cuisine'},
    {id:'laundry',label:'Lessive',minutes:60,tag:'Lavage'},
    {id:'break',label:'Pause',minutes:5,tag:'Pause'}
  ];
  root.HubTimerPresets={
    items:presets,
    minutes:[1,3,5,10,15,25,30,45,60],
    duration:function(minutes){return minutes===60?'1 h':minutes+' min';},
    find:function(id){return presets.find(function(p){return p.id===id;});}
  };
})(typeof window!=='undefined'?window:globalThis);
