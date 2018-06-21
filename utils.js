//part 0:$ tool
var $=function(a){return document.getElementById(a);};


//part 1:http

function httpget(path,callback){
	var xhr=new XMLHttpRequest();
	xhr.open('get',path);
	xhr.onreadystatechange=function() {
	    if(this.readyState!=4) return;
		callback(xhr.status,xhr.response);
	}
	xhr.send();
	return;
}
function httppost(path,podata,callback){
	var xhrpost=new XMLHttpRequest();
	xhrpost.open('post',path);
	xhrpost.setRequestHeader('Content-Type','application/json');
	xhrpost.send(JSON.stringify(podata));
	xhrpost.onreadystatechange=function() {
	    if(this.readyState!=4) return;
	   	if(callback)
			callback(xhrpost,xhrpost.response);
	}
	try{xhrpost.send();}catch(e){console.log(e);}
}


//part 2:template
function template(str,obj){
	var st=/{{[a-zA-Z]*}}/gi;
	var res="";
	var comp;
	var last=0;
	var flag=false;
	while(comp=st.exec(str)){
		res+=str.substring(last,comp.index);
		flag=true;
		last=comp.index+comp[0].length;
		var pps=str.substring(comp.index+2,last-2);
		var val;
		if((val=obj[pps])!=undefined)res+=val;
		else res+=("{{"+pps+"}}");
	}
	res+=str.substring(last,str.length);
	return res;
}
this.template=template;


//part 3:animate
function animate(elem, options,name){
	//动画初始值
	var start = parseInt(elem.style[name].replace('px','')?elem.style[name].replace('px',''):0);
	//动画结束值
	var end = options[name];
	var bet=Math.abs(end-start);
	var dur=options.duration;
	var state=false;
	state=false;
	//动画id
	var timerId;
	var createTime = function(){
		return  (+new Date);
	}
	//动画开始时间
	var startTime = createTime();
	function tick(){
		//每次变化的时间
		var remaining = Math.max(0, startTime + dur - createTime())
		var temp = remaining / dur || 0;
		var percent = 1 - temp;
		var stop = function(){
			//停止动画
			clearInterval(timerId);
			timerId = null;
		}
		var setStyle = function(value){
			elem.style[name] = value + 'px';
		}
		//移动的距离
		var now = (end - start) * percent + start;
		if(percent === 1){
			setStyle(now);
			stop();
		}else{
			setStyle(now);
		}
	}

	//开始执行动画
	var timerId = setInterval(tick, 5);
}


//part 4:get parameter
function getParam(name){
	try{
		var a=(window.location.search.substr(new RegExp(name+"=").exec(window.location.search).index+name.length+1));
		var b=/&/.exec(a);
		b=b?b.index:undefined;
		a=a.substr(0,b);
		return a;
	}catch(e){}
}

//part 5: show/hide
HTMLElement.prototype.show=function(){
	this.style.display="block";
};
HTMLElement.prototype.hide=function(){
	this.style.display="none";
};

// https://stackoverflow.com/questions/934012/get-image-data-in-javascript
function getDataURL(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}