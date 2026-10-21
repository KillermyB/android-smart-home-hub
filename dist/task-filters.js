(function(root){
  'use strict';
  function project(t){return String(t.project_id||t.project||'');}
  function projects(items,known){var ids=new Set(items.map(project).filter(Boolean));return Array.from(ids).map(function(id){var meta=(known||[]).find(function(p){return p.id===id;}),item=items.find(function(t){return project(t)===id;});return {id:id,name:String(meta&&meta.name||item&&item.projectName||'Sans projet')};}).sort(function(a,b){return a.name.localeCompare(b.name,'fr');});}
  function filter(items,options){options=options||{};var query=String(options.query||'').toLocaleLowerCase('fr');return items.filter(function(t){return (!options.project||project(t)===options.project)&&(!Number(options.priority)||Number(t.priority||1)===Number(options.priority))&&(!query||String(t.content||'').toLocaleLowerCase('fr').includes(query));});}
  root.HubTaskFilters={projects:projects,filter:filter,priorities:[{value:0,label:'Toutes les priorités'},{value:4,label:'Urgente · P1'},{value:3,label:'Élevée · P2'},{value:2,label:'Moyenne · P3'},{value:1,label:'Normale · P4'}]};
})(typeof window!=='undefined'?window:globalThis);
