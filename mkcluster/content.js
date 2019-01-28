console.log("hello!!!!! from content.js");

let pr=[];
let pr_text;
let pr_link;
let pr_id;

let pr_array = document.getElementsByClassName("js-navigation-container js-active-navigation-container")[0].getElementsByClassName("Box-row Box-row--focus-gray p-0");
for(var i=0;i<pr_array.length;i++)
{
	pr_id = pr_array[i].id.slice(6);
	pr_link = pr_array[i].getElementsByTagName('a')[0].href;
	let pr_text = document.getElementById('issue_'+pr_id+'_link').innerText;
	let dic = {"id":pr_id,"link":pr_link,"text":pr_text}
	pr = pr.concat(dic);
}
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  if ((msg.from === 'popup') && (msg.subject === 'ele_question')) {
    response(pr);
  }
});