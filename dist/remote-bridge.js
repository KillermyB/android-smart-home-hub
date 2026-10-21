(function(root){
  'use strict';
  function eligible(){return location.protocol==='http:'&&location.hostname==='127.0.0.1'&&location.port==='4173';}
  function start(options){
    var timer,busy=false,stopped=false,key='',pair=null,lastSnapshot='',lastPublished=0;
    async function local(op,id,payload){return HubRemote.request(fetch,key,op,id,payload);}
    async function tick(){
      clearTimeout(timer);if(stopped||busy||document.hidden)return;
      busy=true;var delay=2500;
      try{
        if(!key){var screen=await fetch('/cgi-bin/screen.cgi',{cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(8000)});key=(await screen.json()).key;}
        // Publish first, so a just-opened page is available without a phone write.
        var snapshot=HubRemote.encode(HubRemote.snapshot(options.snapshot()));
        if(snapshot!==lastSnapshot||Date.now()-lastPublished>5000){await local('publish','-',snapshot);lastSnapshot=snapshot;lastPublished=Date.now();}
        var response=await fetch('/cgi-bin/remote.cgi',{cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(8000)});
        if(!response.ok)throw Error('Télécommande indisponible.');
        var data=await response.json();pair={url:data.url,key:data.key};
        for(var entry of data.commands||[]){
          var result;
          try{var command=HubRemote.validate(HubRemote.decode(entry.payload),Date.now());if(command.id!==entry.id)throw Error('Demande invalide.');if(document.hidden)throw Error('Hub est passé en arrière-plan.');result=await options.execute(command);}
          catch(e){result={ok:false,message:e.message||'Action non confirmée.'};}
          await local('ack',entry.id,HubRemote.encode(result));
        }
        if((data.commands||[]).length){await local('publish','-',HubRemote.encode(HubRemote.snapshot(options.snapshot())));lastPublished=Date.now();}
      }catch(_){pair=null;delay=15000;}
      finally{busy=false;if(!stopped&&!document.hidden)timer=setTimeout(tick,delay);}
    }
    function visibility(){clearTimeout(timer);if(!document.hidden)tick();}
    document.addEventListener('visibilitychange',visibility);
    tick();
    return {pair:function(){return pair;},refresh:tick,revoke:async function(){if(!key)throw Error('Cadre indisponible.');await local('revoke');pair=null;await tick();},stop:function(){stopped=true;clearTimeout(timer);document.removeEventListener('visibilitychange',visibility);}};
  }
  root.HubRemoteBridge={eligible:eligible,start:start};
})(typeof window!=='undefined'?window:globalThis);
