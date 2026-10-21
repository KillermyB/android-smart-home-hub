(function(root){
  'use strict';
  function summarize(data,user,start,end){
    var seen=new Set(),items=(data.items||[]).filter(function(x){var key=x.repository.full_name+':'+x.sha;if(seen.has(key))return false;seen.add(key);return true;});
    var days={};items.forEach(function(x){var day=new Date(x.commit.author.date).toISOString().slice(0,10);days[day]=(days[day]||0)+1;});
    return {user:user,updated:Date.now(),start:start,end:end,total:data.total_count,partial:!!data.incomplete_results||data.total_count>items.length,days:days,items:items.slice(0,50).map(function(x){return {title:x.commit.message.split('\n')[0].slice(0,180),repo:x.repository.full_name,sha:x.sha,date:x.commit.author.date};})};
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
  function snapshot(value,user){if(!value||value.format!=='hub-github-contributions'||String(value.user).toLowerCase()!==String(user).toLowerCase()||!/^\d{4}-\d{2}-\d{2}$/.test(value.start)||!/^\d{4}-\d{2}-\d{2}$/.test(value.end)||!Number.isFinite(value.updated)||value.updated>Date.now()+60000||!value.days||typeof value.days!=='object')throw Error('Relevé GitHub invalide ou compte différent.');var first=new Date(value.start+'T00:00:00Z'),last=new Date(value.end+'T00:00:00Z');if(last-first!==27*86400000)throw Error('Le relevé doit couvrir 28 jours.');var days={},total=0;for(var i=0;i<28;i++){var day=new Date(first.getTime()+i*86400000).toISOString().slice(0,10),n=value.days[day]||0;if(!Number.isSafeInteger(n)||n<0||n>1000000)throw Error('Relevé GitHub invalide.');days[day]=n;total+=n;}return {user:user,updated:value.updated,start:value.start,end:value.end,total:total,days:days,items:[],kind:'contributions',partial:false};}
  function detail(g){var days=[],first=g&&/^\d{4}-\d{2}-\d{2}$/.test(g.start)?Date.parse(g.start+'T00:00:00Z'):NaN,active=0,best=0,streak=0,maxStreak=0,total=0;for(var i=0;Number.isFinite(first)&&i<28;i++){var date=new Date(first+i*86400000).toISOString().slice(0,10),count=Math.max(0,Number(g.days&&g.days[date])||0);days.push({date:date,count:count});total+=count;if(count){active++;streak++;maxStreak=Math.max(maxStreak,streak);}else streak=0;best=Math.max(best,count);}return {days:days,total:total,active:active,best:best,streak:maxStreak,average:days.length?total/days.length:0};}
  var api={detail:detail,load:load,summarize:summarize,snapshot:snapshot};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HubGithub=api;
})(typeof window!=='undefined'?window:globalThis);
