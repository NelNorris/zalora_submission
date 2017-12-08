







	








var gwStat = {
	meta:{
	"fetch":{
		"userId": {"type":"javascript", "get":function(){ 
			var subsc = mailrecipe.meta.custom.subscribedAt();
			if(subsc)
			{
				if(new Date().getTime()-subsc > 12*60*60*1000)
					return gwDataLayer("Zuid");
				else
					return null;
			}
			else
				return gwDataLayer("Zuid");
		}},
		"email": {"type":"javascript", "get":function(){ 
			var subsc = mailrecipe.meta.custom.subscribedAt();
			if(subsc)
			{
				if(new Date().getTime()-subsc > 12*60*60*1000)
					return gwDataLayer("customerIdentifier");
				else
					return null;
			}
			else
				return gwDataLayer("customerIdentifier");
		}},
		"firstName": {"type":"javascript", "get":function(){ return Zalora&&Zalora.jsStore?Zalora.jsStore.customer_name:null; }},
		"url": {"type":"javascript", "get":function(){
			var pgtype = gwDataLayer("Page_Type");
			if(pgtype == "404error")
			{
				var orgurl = location.href.split("?")[0];
				if(gwStat.domain=="zalora.co.th" || gwStat.domain=="zalora.vn" ||  gwStat.domain=="zalora.com.tw")
					orgurl = decodeURIComponent(orgurl);
				if(orgurl.match(".html$")==".html")
					return orgurl;
			}
			else if(pgtype == "product")
				return jQuery("[property='og:url']").attr("content");
		}},
		"availability": {"type":"javascript", "get":function(){
			var pgtype = gwDataLayer("Page_Type");
			if(pgtype == "404error")
				return "-1";
			else if(pgtype == "product")
				return "1";
			else
				return null;
		}},
		"title": {"type":"javascript", "get":function(){ return gwDataLayer("Product_Name"); }},
		"brand": {"type":"javascript", "get":function(){ return gwDataLayer("Brand"); }},
		"price": {"type":"javascript", "get":function(){ return gwDataLayer("Product_Price"); }},
		"listPrice": {"type":"javascript", "get":function(){ return jQuery("#selectedPrice").val(); }},
		"image": {"type":"javascript", "get":function(){ 
				var img = jQuery("[property='og:image']").attr("content");
				return img;
			}
		},
		"category": {"type":"javascript", "get":function(){
			return jQuery.map(
				jQuery(".b-breadcrumbs li span"),
				function(elm){ return jQuery(elm).text(); }
			).join(">");
		}},
		"subscribedAt": {"type":"javascript", "get":function(){
			return mailrecipe.meta.custom.subscribedAt();
		}}
	},
	"cart":{"type":"javascript", "register":function(){
			jQuery("#AddToCart").click(function(){
				var sz = jQuery("select.prdSizeOption__sizeDetail").val();
				if(sz == "size")
					console.dir("Size not selected.");
				else
					gwCart(); 
			});
		}
	},
	"checkout":{
		"url":{"type":"urimatch", "success":"/checkout/success"}
	},
	"callback":{"type":"javascript", "get":function(rsp){
			if(rsp && rsp.session && (rsp.session.userId=="10114406332917969" || rsp.session.userId=="10114402358604118"))
			{
				jQuery.getScript("https://mailrecipe-live.appspot.com/bookmark/mobile.js", function(data, textStatus, jqxhr){
					gwBookmark.theme = {
						"font-family":"Apercu,Gill Sans MT,Gill Sans,Arial,sans-serif", "color":"white", "background-color":"#000",
						"include":{
							"link":[
								{rel:"stylesheet", type:"text/css", href:"https://static-my.zacdn.com/css/release/alice-myfas-core-v5a704a8d8a84.css", media:"all"},
								{rel:"stylesheet", type:"text/css", href:"https://static-my.zacdn.com/css/release/alice-myfas-home-vcc7e3d837e35.css", media:"all"}
							]
						}
					};
					console.dir(rsp);
					gwBookmark.load(rsp);
				});
			}
		}
	},
	"custom":{
		"subscribedAt":function(){
			var dtstr = gwDataLayer("timestampOfSubscription");
			if(dtstr)
			{
				var dtspt = dtstr.split(" ");
				if(dtspt.length == 2)
				{
					var dts = dtspt[0].split("-");
					var tms = dtspt[1].split(":");
					if(dts.length==3 && tms.length==3)
					{
						var subdt = new Date(parseInt(dts[2]), parseInt(dts[1])-1, parseInt(dts[0]), 
								parseInt(tms[0]), parseInt(tms[1]), parseInt(tms[2]));
						return subdt.getTime();
					}
				}
			}
		}
	}
},
	pixelId:"dfedfbb6-d110-45e0-a5f1-94e0bf2303d2",
	sessionId:"ffbb1e4e-c243-4b6d-91d0-53395f4ddc2b",
	data:null,
	domain:"zalora.sg",
	base:"https://mailrecipe-live.appspot.com",
	update:function(dt){},
	send:function(){},
	getSessionId:function()
	{
		var sessId = gwReadCookie("gwMailrecipeId");
		sessId = sessId&&sessId.trim()==""?null:sessId;
		if(sessId)
			return sessId;
		else
		{
			gwCreateCookie("gwMailrecipeId",  mailrecipe.sessionId, 1/24);
			return mailrecipe.sessionId;
		}
	},
	fill:function()
	{
		var prms = {};
		var fth = this.meta.fetch;
		for(var mkey in fth)
		{
			try {
				var mval = fth[mkey];
				var vl = mval["get"]();
				prms[mkey] = vl;
			}
			catch (e) {
				console.error("Invalid value for "+mkey+". Reason: "+e);
			}
		}
		prms.sessionId = mailrecipe.getSessionId();
		if(window.sessionStorage)
		{
			var prevpxl = sessionStorage.getItem('gwPrevPixelId');
			if(prevpxl)
				prms.prevPixelId = prevpxl;
			sessionStorage.setItem('gwPrevPixelId', gwStat.pixelId);
		}
		this.data = prms;
	}
};
var mailrecipe = gwStat;

function gwCreateCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function gwReadCookie(k){return(document.cookie.match('(^|; )'+k+'=([^;]*)')||0)[2]}

function gwPost(prms) {
	var postdata = "callback=gwCallback";
	if(prms)
		prms.pixelId = gwStat.pixelId;
	for(var nm in prms)
		if(prms[nm])
			postdata += "&"+nm+"="+encodeURIComponent(prms[nm]);
	postdata += "&nocache="+new Date().getTime();
	var scriptEl = document.createElement('script');
	var endurl = gwStat.base+"/send/"+gwStat.domain+"?"+postdata;
	scriptEl.setAttribute("src", endurl);
	document.body.appendChild(scriptEl);
}

function gwCallback(rslt) {
	if(gwStat.meta.callback && gwStat.meta.callback.get){
		try{
			gwStat.meta.callback.get(rslt);
		}
		catch(err) {
		}
	}
}

function gwDataLayer(nm, obj) {
	var ctx = obj?obj:dataLayer;
	if(ctx && ctx.constructor == Array)
	{
		for(var i = 0; i < ctx.length; i++)
		{
			var dtlyr = ctx[i];
			if(dtlyr[nm])
				return dtlyr[nm];
			else if(dtlyr && (dtlyr.constructor == Array || dtlyr.constructor == Object))
			{
				var val = gwDataLayer(nm, dtlyr);
				if(val) return val;
			}
		}
	}
	else if(ctx && ctx.constructor == Object)
	{
		if(ctx[nm])
			return ctx[nm];
		for(var ctxnm in ctx)
		{
			var ctxval = ctx[ctxnm];
			if(ctxval && (ctxval.constructor == Array || ctxval.constructor == Object))
			{
				var val = gwDataLayer(nm, ctxval);
				if(val) return val;
			}
		}
	}
	return null;
}

function gwVisit() {
	gwStat.fill();
	if(typeof gwStat.data.url=='undefined' || gwStat.data.url==null)
	{
		gwStat.data.url = window.location.href;
		gwStat.data.type = gwHasBought(gwStat.data.url)?'checkout':'ovisit';
	}
	else if(gwStat.data.title && gwStat.data.image && gwStat.data.category && gwStat.data.price)
		gwStat.data.type = 'visit';
	else
		gwStat.data.type = gwHasBought(gwStat.data.url)?'checkout':'ovisit';
	gwPost(gwStat.data);
	return true;
}

function gwCart(dynurl) {
	var url = dynurl?dynurl:gwStat.meta.fetch.url.get();
	if(url)
	{
		var prms = {"url":url, "type":"cart", "sessionId":mailrecipe.getSessionId()};
		gwPost(prms);
	}
}

function gwHasBought(url) {
	return url&&gwStat.meta.checkout&&gwStat.meta.checkout.url&&gwStat.meta.checkout.url.success&&url.indexOf(gwStat.meta.checkout.url.success)>=0?true:false;
}

function gwBought() {
	var prms = {"url":window.location.href, "type":"checkout", "sessionId":mailrecipe.getSessionId()};
	gwPost(prms);
}

function gwEncode(str) {
	var encarr = [];
	for(var i = 0; i < str.length; i++)
		encarr.push(str.charCodeAt(i));
	return encarr.join(",");
}

function gwDecode(str) {
	var deccarr = [];
	var arr = eval("(["+str+"])");
	for(var i = 0; i < arr.length; i++)
		deccarr.push(String.fromCharCode(arr[i]));
	return deccarr.join("");
}

function gwHashCode(str) {
  var hash = 0, i, chr, len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

if(!console) console = {log:function(){}, dir:function(){}, error:function(){}};


(function() {
	var trg = gwStat.meta.trigger?gwStat.meta.trigger:{"delay":100};
	var dly = trg.delay;
	var attempts = 0;
	var trgfn = function()
	{
		try{
			var rs = gwVisit();
			attempts = attempts + 1;
			if(rs==false && attempts<3)
				setTimeout(trgfn, dly);
		}
		catch(err) {
		}
	};
	setTimeout(trgfn, dly);
	setTimeout(function(){
		if(gwStat.meta.cart && gwStat.meta.cart.register){
			try{
				gwStat.meta.cart.register();
			}
			catch(err) {
			}
		}
	}, dly);
})();



