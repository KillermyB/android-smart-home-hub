/* A shuffled bag with short local history; no network and no repeated draw per cycle. */
(function(root){'use strict';
function create(items,options){options=options||{};var random=options.random||Math.random,bags={},history=(Array.isArray(options.history)?options.history:[]).map(function(text){return items.find(function(q){return q.text===text;});}).filter(Boolean).slice(-40),cursor=history.length-1;
 function pool(category){var list=items.filter(function(q){return !category||category==='Toutes'||q.category===category;});return list.length?list:items;}
 function next(category){var list=pool(category),key=category||'Toutes',last=history[cursor];if(cursor<history.length-1){for(var h=cursor+1;h<history.length;h++)if(list.includes(history[h])){cursor=h;return history[h];}}
  if(!bags[key]||!bags[key].length){bags[key]=list.slice();for(var n=bags[key].length-1;n>0;n--){var j=Math.floor(random()*(n+1)),tmp=bags[key][n];bags[key][n]=bags[key][j];bags[key][j]=tmp;}}
  var bag=bags[key],recent=history.slice(-Math.min(20,list.length-1)),candidates=bag.filter(function(q){return !recent.includes(q)&&(!last||q.author!==last.author);});if(!candidates.length)candidates=bag.filter(function(q){return q!==last&&(!last||q.author!==last.author);});if(!candidates.length)candidates=bag.filter(function(q){return q!==last;});if(!candidates.length)candidates=bag;
  var counts={};bag.forEach(function(q){counts[q.author]=(counts[q.author]||0)+1;});var dominant=Object.keys(counts).sort(function(a,b){return counts[b]-counts[a];})[0];if(counts[dominant]>=bag.length/2&&candidates.some(function(q){return q.author===dominant;}))candidates=candidates.filter(function(q){return q.author===dominant;});
  var q=candidates[Math.min(candidates.length-1,Math.floor(random()*candidates.length))];bag.splice(bag.indexOf(q),1);history.push(q);history=history.slice(-60);cursor=history.length-1;return q;
 }
 function previous(category){var list=pool(category);for(var i=cursor-1;i>=0;i--)if(list.includes(history[i])){cursor=i;return history[i];}return history[cursor]||next(category);}
 return {next:next,previous:previous,recent:function(){return history.slice(-40).map(function(q){return q.text;});}};
}
root.HubQuotes={create:create};
})(typeof window==='undefined'?globalThis:window);
