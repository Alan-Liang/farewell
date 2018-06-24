
var templRadio=$("template-radio").innerHTML;
var templTF=$("template-text-field").innerHTML;
var templSelect=$("template-select").innerHTML;
var templSelectFrame=$("template-select-frame").innerHTML;
var templCheckbox=$("template-checkbox").innerHTML;
var inits=document.querySelectorAll("[data-init]");
for(var i=0;i<inits.length;i++){
	var div=inits[i];
	var args=div.getAttribute("data-init").split(" ");
	switch(args[0]){
		case "radio":
		var html="";
		for(var j=2;j<args.length;j++){
			html+=template(templRadio,{
				id:args[j].split("/")[0],
				text:args[j].split("/")[1],
				name:args[1]
			});
		}
		div.innerHTML+=html;
		break;
		
		case "text-field":
		var html="";
		for(var j=1;j<args.length;j++){
			html+=template(templTF,{
				id:args[j].split("/")[0],
				text:args[j].split("/")[1]
			});
		}
		div.innerHTML+=html;
		break;
		
		case "checkbox":
		var html="";
		for(var j=1;j<args.length;j++){
			html+=template(templCheckbox,{
				id:args[j].split("/")[0],
				text:args[j].split("/")[1]
			});
		}
		div.innerHTML+=html;
		break;
		
		case "select":
		var html="";
		for(var j=3;j<args.length;j++){
			html+=template(templSelect,{
				value:args[j].split("/")[0],
				text:args[j].split("/")[1]
			});
		}
		div.innerHTML+=template(templSelectFrame,{id:args[1],text:args[2],options:html});
		break;
		
		
		default:
		console.log("Error parsing init command "+args.join(" "));
	}
}