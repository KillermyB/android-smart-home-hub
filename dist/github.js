(function(root){
  'use strict';
  function summarize(data,user,start,end){
    var seen=new Set(),items=(data.items||[]).filter(function(x){var key=x.repository.full_name+':'+x.sha;if(seen.has(key))return false;seen.add(key);return true;});
    var days={};items.forEach(function(x){var day=new Date(x.commit.author.date).toISOString().slice(0,10);days[day]=(days[day]||0)+1;});
    return {user:user,updated:Date.now(),start:start,end:end,total:data.total_count,partial:!!data.incomplete_results||data.total_count>items.length,days:days,items:items.slice(0,5).map(function(x){return {title:x.commit.message.split('\n')[0].slice(0,180),repo:x.repository.full_name,sha:x.sha,date:x.commit.author.date};})};
  }
  async function load(user,fetcher){
    if(!/^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i.test(user))throw new Error('Nom GitHub invalide.');
    var end=new Date(),start=new Date();start.setUTCDate(end.getUTCDate()-27);var first=start.toISOString().slice(0,10),last=end.toISOString().slice(0,10),items=[],total=0,incomplete=false;
    for(var page=1;page<=3;page++){
      var q='author:'+user+' author-date:'+first+'..'+last+' is:public';
      var controller=new AbortController(),timeout=setTimeout(function(){controller.abort();},12000),res;
      try{res=await fetcher('https://api.github.com/search/commits?q='+encodeURIComponent(q)+'&sort=author-date&order=desc&per_page=100&page='+page,{headers:{Accept:'application/vnd.github+json'},signal:controller.signal});}finally{clearTimeout(timeout);}
      if(!res.ok)throw new Error(res.status===403||res.status===429?'Limite GitHub atteinte. Réessaie plus tard.':res.status===422?'Compte GitHub introuvable ou recherche indisponible.':'GitHub est indisponible pour le moment.');
      var data=await res.json();total=data.total_count;incomplete=incomplete||data.incomplete_results;items=items.concat(data.items||[]);if(items.length>=total||!(data.items||[]).length)break;
    }
    return summarize({items:items,total_count:total,incomplete_results:incomplete},user,first,last);
  }
  var api={load:load,summarize:summarize};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HubGithub=api;
})(typeof window!=='undefined'?window:globalThis);
