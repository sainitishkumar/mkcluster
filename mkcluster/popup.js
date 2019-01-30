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

function setDOMInfo(info){
  console.log(info);
  var sentences=[];
  for(let i=0;i<info.length;i++)
  {
    
    sentences = sentences.concat(info[i].text);
  }
  topicise(sentences);
}

var main_url;
var sentences;

/********* clustering into four chunks **********/

function topicise(sentences) {
  //console.log("analysing "+sentences.length+" sentences...");
  var documents = new Array();
  var f = {};
  var vocab=new Array();
  var docCount=0;
  for(var i=0;i<sentences.length;i++) {
    if (sentences[i]=="") continue;
    var words = sentences[i].split(/[\s,\"]+/);
    if(!words) continue;
    var wordIndices = new Array();
    for(var wc=0;wc<words.length;wc++) {
      var w=words[wc].toLowerCase().replace(/[^a-z\'A-Z0-9 ]+/g, '');
      if (w=="" || w.length==1 || stopwords[w] || w.indexOf("http")==0) continue;
      if (f[w]) { 
        f[w]=f[w]+1;      
      } 
      else if(w) { 
        f[w]=1; 
        vocab.push(w); 
      };  
      wordIndices.push(vocab.indexOf(w));
    }
    if (wordIndices && wordIndices.length>0) {
      documents[docCount++] = wordIndices;
    }
  }
    
  var V = vocab.length;
  var M = documents.length;
  var K = 5;         // number of clusters in pull requests
  var alpha = 0.1;  // per-document distributions over topics
  var beta = .01;  // per-topic distributions over words
  lda.configure(documents,V,10000, 2000, 100, 10);
  lda.gibbs(K, alpha, beta);
  var theta = lda.getTheta();
  var phi = lda.getPhi();
  var text = '';
  //topics
  var topTerms=20;
  var topicText = new Array();
  for (var k = 0; k < phi.length; k++) {
    text+='<canvas id="topic'+k+'" class="topicbox color'+k+'"><ul>';
    var tuples = new Array();
    for (var w = 0; w < phi[k].length; w++) {
       tuples.push(""+phi[k][w].toPrecision(2)+"_"+vocab[w]);
    }
    tuples.sort().reverse();
    if(topTerms>vocab.length) topTerms=vocab.length;
    topicText[k]='';
    for (var t = 0; t < topTerms; t++) {
      var topicTerm=tuples[t].split("_")[1];
      var prob=parseInt(tuples[t].split("_")[0]*100);
      if (prob<0.0001) continue;
      text+=( '<li><a href="javascript:void(0);" data-weight="'+(prob)+'" title="'+prob+'%">'+topicTerm +'</a></li>' );     
      console.log("topic "+k+": "+ topicTerm+" = " + prob  + "%");
      topicText[k] += ( topicTerm +" ");
    }
    //console.log(sentences.join("\n"));
    

  }
  console.log(topicText);
  pr = document.getElementById('insert_here');
  // pr.innerText+="pr id:"+info[i].id+" pr text: "+info[i].text+"\n";


  classes = [];

  for(var i=0;i<K;i++)
  {
    class0 = document.createElement('p');
    class0.setAttribute("class","class"+i);
    class0.setAttribute("style","border-style:inset;");
    // class0.style.border-style="inset";
    classes = classes.concat(class0);
  }
  for(var i=0;i<K;i++)
  {
    classes[i].innerText+="Cluster "+i+":\n";
    classes[i].innerText+=topicText[i].split(" ").slice(0,4);
    classes[i].innerText+="\n";
  }

  for(var i=0;i<K;i++)
  {
    pr.appendChild(classes[i]);
  }

}