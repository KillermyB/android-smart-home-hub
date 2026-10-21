(function(root){
  'use strict';
  function eligible(location){return location.protocol==='http:'&&location.hostname==='127.0.0.1'&&location.port==='4173';}
  function client(request,location){
    var key='';
    async function send(percent){
      if(!eligible(location))throw Error('Ce réglage est disponible directement sur le cadre.');
      var options={cache:'no-store',credentials:'omit',referrerPolicy:'same-origin',signal:AbortSignal.timeout(20000)};
      if(percent!==undefined){
        if(!Number.isInteger(percent)||percent<10||percent>100||!key)throw Error('Choisis une luminosité entre 10 et 100 %.');
        options.method='POST';options.headers={'Content-Type':'application/json'};options.body=JSON.stringify({percent:percent,key:key});
      }
      var response;try{response=await request('/cgi-bin/screen.cgi',options);}catch(_){throw Error('Le cadre met du temps à répondre. Réessaie dans un instant.');}
      if(!response.ok)throw Error('Le réglage natif de l’écran est indisponible.');
      var data=await response.json();
      if(data.native!==true||!Number.isInteger(data.percent)||data.percent<0||data.percent>100||typeof data.fixed!=='boolean'||!(/^[a-f0-9]{64}$/).test(data.key))throw Error('Le cadre n’a pas confirmé sa luminosité.');
      if(percent!==undefined&&(!data.fixed||Math.abs(data.percent-percent)>1))throw Error('La luminosité n’a pas été confirmée.');
      key=data.key;return {percent:data.percent,fixed:data.fixed};
    }
    async function activity(seconds){
      if(!eligible(location)||!Number.isInteger(seconds)||seconds<0||seconds>86400)throw Error('Activité invalide.');
      if(!key)await send();
      var response=await request('/cgi-bin/activity.cgi',{method:'POST',cache:'no-store',credentials:'omit',referrerPolicy:'same-origin',signal:AbortSignal.timeout(5000),headers:{'Content-Type':'application/json'},body:JSON.stringify({seconds:seconds,key:key})});
      if(!response.ok)throw Error('Activité non enregistrée.');var value=await response.json();if(value.native!==true||value.saved!==true)throw Error('Activité non confirmée.');return true;
    }
    return {read:function(){return send();},set:send,activity:activity};
  }
  root.HubScreen={eligible:eligible,client:client};
})(typeof window!=='undefined'?window:globalThis);
