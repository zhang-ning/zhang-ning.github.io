function getInstanceOf (obj) {
    var F = function(){};
    F.prototype = obj;
    return new F;
}

var Deffer = {
  resolve : function(data){
    this.donecallback(data);
  },
  reject : function(data){
    this.failcallback(data);
  },
  done : function(callback){
    this.donecallback = callback;
  },
  fail : function(callback){
    this.failcallback = callback;
  },
  parameters:{}
};
var prefix = (function(){
  var b = window.navigator.userAgent.match(/safari|chrome|firefox|msie/i)[0];
  return /chrome|safari/i.test(b) ? '-webkit-' : /firefox/i.test(b) ? '-moz-' : '-ms-'; 
})();


function River(ref){
  if(typeof ref === 'string'){
    ref = document.querySelector(ref);
  }

  return {
    addClass: function(c){
      var h = ref.className;
      var cn = new RegExp(c);
      //to-do
      ref.className = cn.test(h) ? h : h + ' ' + c;
      return this;
    },
    removeClass: function(c){
      var h = ref.className;
      ref.className = h.split(' ').filter(function(v){
        if( c !== v)
        return v;
      }).join(' ');
      return this;
    },
    attr:function(p,v){
      ref.setAttribute(p,v)
      return this;
    },
    style:function(p,v){
      ref.style[p] = v ;
      return this;
    },
    getRef:function(){
      return ref;
    },
    on:function(eve,target,callback){
      var dom;
      ref.addEventListener(eve,function(e){
        if(!dom)dom = River(target).getRef();
        if(e.target === dom){
          callback(e);
        }
      },false);
      return this;
    },
    bind:function(eve,callback){
      ref.addEventListener(eve,callback)
      return this;
    },
    remove:function(){
      ref.parentNode.removeChild(ref);
      return null;
    },
    append:function(d){
      ref.appendChild(d.getRef());
      return this;
    },
    animate:function(p,v,t){
      var deffer = getInstanceOf(Deffer);

      var distance = parseInt(v) - parseInt(ref.style[p]);

      var s = 13;
      var frames = parseInt(t/s);
      var i = 0 ;

      var d = distance/frames ;

      var loopID = setInterval(function() {
        i++;
        ref.style[p] = d * i;
        if( i === frames ) {
          clearInterval(loopID);
          deffer.resolve();
        }
      }, s);

      return deffer;
    }
  }
}

River.compail = function(string){
  var div = document.createElement('div');
  div.innerHTML = string;
  return River(div.children[0]);
}

River.http = {
  get : function(url) {
    var request = new XMLHttpRequest();
    request.open("GET",url,true);
    request.send();
    var deffer = getInstanceOf(Deffer);
    request.onreadystatechange= function(){
      if (request.readyState==4 && request.status==200){
        deffer.resolve(request);
      }
    }
    return deffer;
  },
  post : function(url) {
    var request = new XMLHttpRequest();
    request.open("POST",url,true);
    request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    request.send();
    var deffer = getInstanceOf(Deffer);
    request.onreadystatechange= function(){
      if (request.readyState==4 && request.status==200){
        deffer.resolve();
      }
    }
    return deffer;
  }
}
