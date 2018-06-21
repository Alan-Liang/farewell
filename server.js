//@author Alan-Liang

var http=require("http");
var fs=require("fs");
var log=require("./log")("server");
var mime=require("mime");
var url=require("url");
var vurl=require("./vurl");
var db=require("./db");

var col;
db.connect(function(err,res){
	if(err)
		console.error(err);
	console.log("Database connection");
	col=db.getCollection("messages");
});

var port=8080;

var listeningFunc=function(req,resp){
  // Parse the request containing file name
  var pathname = url.parse(req.url).pathname.substr(1);
  if(vurl.query(pathname)){
    try{
      (vurl.query(pathname))(req,resp,pathname);
      return;
    }catch(e){
      log.error("Error executing "+pathname+" : "+e.stack);
      resp.writeHead(501, {'Content-Type':'text/plain'});
      resp.write("HTTP 501");
      resp.end();
      return;
    }
  }else if(cache[pathname]){
    var type=mime.lookup(pathname.substr(1));
    if(type=="text/html")
    	type="text/html;charset=utf-8";
    resp.writeHead(200, {'Content-Type':type});
    resp.write(cache[pathname]);
    resp.end();
    return;
  }else{
    resp.writeHead(404,{'Content-Type':'text/plain'});
    resp.write("HTTP 404");
    resp.end();
    return;
  }
};

var cache={};
var server;

startsvc=function(port,ipaddress){
  if(!server){
    try{
      server=http.createServer(listeningFunc);
      ipaddress?server.listen(port,ipaddress):server.listen(port);
    }catch(e){
      log.error(timeH(),"Error listening on "+ipaddress+":"+port+": "+e.stack);
      server=undefined;
      return;
    }
    log.info("Server started, listening on "+ipaddress+":"+port+".");
  }
};

var loadpages=["index.html","mdc.css","mdc.js","init.js","signpad.js","utils.js","na.png"];
for(var i=0;i<loadpages.length;i++){
  try{
    var page=fs.readFileSync(loadpages[i]);
    cache[loadpages[i]]=page;
  }catch(e){
    log.error(timeH(),"Error reading file "+loadpages[i]+" : "+e.stack);
  }
}

vurl.add({'path':'','func':function(req,resp){
  resp.writeHead(302,{Location:"/index.html"});
  resp.end();
}});

vurl.add({path:"upload",func:function(req,resp){
	var postData="";
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postData += postDataChunk;
	});
	req.addListener("end", function() {
		db.insertOne(col,{values:postData},function(err,res){
			if(err){
				log.error(err.stack);
				resp.writeHead(501);
				resp.end("Error");
				return;
			}
			var id=res.ops[0]._id.toString();
			resp.writeHead(200);
			resp.end(id);
		});
	});
}});

vurl.add({path:"view",func:function(req,resp){
	var params=url.parse(req.url,true).query;
	if(params.pwd=="a1b2c3"){
		resp.write();
		db.find(col,function(err,res){
			if(err){
				log.error(err.stack);
				resp.writeHead(200,{"Content-Type":"text/plain;charset=utf-8"});
				resp.write(err.stack);
				resp.end();
				return;
			}
			resp.writeHead(200,{"Content-Type":"application/octet-stream"});
			resp.end(JSON.stringify(res));
		});
	}else{
		resp.writeHead(200,{"Content-Type":"text/html"});
		resp.end("<form action=\"\" method=GET><input name=pwd><input type=submit></form>");
	}
}});

vurl.add({regexp:/^background/,func:function(req,resp,path){
	fs.readFile("./"+path,function(err,res){
		if(err){
			resp.writeHead(404);
			resp.end();
			return;
		}
		resp.writeHead(200,{"Content-Type":mime.lookup(path)});
		resp.end(res);
	})
}});

startsvc(port);