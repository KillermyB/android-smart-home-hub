(function(root){
  'use strict';
  function committed(dx,dy,width){return dx<=-Math.min(90,Math.max(64,width*.25))&&Math.abs(dx)>Math.abs(dy)*1.5;}
  function bind(node,remove){var drag=null;
    function reset(){if(!drag)return;drag.row.style.transform='';drag.row.classList.remove('is-dragging');if(drag.row.parentNode)drag.row.parentNode.classList.remove('is-swiping');drag=null;}
    node.addEventListener('pointerdown',function(e){if(e.isPrimary===false||e.button!==0||e.target.closest('button'))return;var row=e.target.closest('[data-swipe-timer]');if(!row||row.getAttribute('aria-busy')==='true')return;drag={row:row,id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,dy:0,horizontal:false,timer:row.dataset.swipeTimer,instance:row.dataset.timerInstance,width:row.getBoundingClientRect().width};});
    node.addEventListener('pointermove',function(e){if(!drag||drag.id!==e.pointerId)return;drag.dx=e.clientX-drag.x;drag.dy=e.clientY-drag.y;if(!drag.horizontal&&Math.abs(drag.dy)>12&&Math.abs(drag.dy)>Math.abs(drag.dx)){reset();return;}if(!drag.horizontal&&drag.dx<-12&&Math.abs(drag.dx)>Math.abs(drag.dy)*1.5){drag.horizontal=true;drag.row.classList.add('is-dragging');if(drag.row.parentNode)drag.row.parentNode.classList.add('is-swiping');drag.row.setPointerCapture(e.pointerId);}if(drag.horizontal){e.preventDefault();drag.row.style.transform='translateX('+Math.max(-120,Math.min(0,drag.dx))+'px)';}});
    node.addEventListener('pointerup',function(e){if(!drag||drag.id!==e.pointerId)return;var current=drag,done=current.horizontal&&committed(current.dx,current.dy,current.width);reset();if(done)remove(current.timer,current.instance);});
    node.addEventListener('pointercancel',reset);node.addEventListener('lostpointercapture',function(e){if(drag&&e.target===drag.row&&e.pointerId===drag.id)reset();});
  }
  root.HubRemoteGestures={committed:committed,bind:bind};
})(typeof window!=='undefined'?window:globalThis);
