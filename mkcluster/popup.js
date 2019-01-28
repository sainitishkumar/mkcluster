function button_click(){
  console.log("button_click!!");
}

function setDOMInfo(info){
  pr = document.getElementById('insert_here');
  for(let i=0;i<info.length;i++)
  {
    pr.innerText+="pr id:"+info[i].id+" pr text: "+info[i].text+"\n";
  }
}

var main_url;

window.addEventListener('DOMContentLoaded', function(){
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    mainurl = tabs[0].url;
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', subject: 'ele_question'},
        setDOMInfo);
  });
});
