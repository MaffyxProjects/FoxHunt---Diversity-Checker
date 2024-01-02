//Runs a script that will scroll the results page of a set of LinkedIn recruiter search results. It will try to determine whether or not the person might originate from the United States, or could potentially be a female candidate. 
//It will run their names through two separate API's from Nationalize.io or Genderize.io, and give a probability result in which we can either save or ignore the profile. If the result is positive, it will save the results to the current project for later review.
//It will run through all the search results and will stop. 
//Results will be saved to the project and can be manually reviewed for accuracy. 


//run the checkbox scripts
function runCheckScript() {
  sleep(1000)
  async function getTab() {
    let queryOptions = {
      active: true,
      currentWindow: true
    };
    let tabs = await chrome.tabs.query(queryOptions);

    let tabId = tabs[0].id

    chrome.scripting.executeScript({
      target: {
        tabId: tabId
      },
      files: ['pageChecker.js']
    });
  }
  getTab()
}
//run the checkbox scripts
function runCheckBoxScript() {
  async function getTab() {
    let queryOptions = {
      active: true,
      currentWindow: true
    };
    let tabs = await chrome.tabs.query(queryOptions);

    let tabId = tabs[0].id

    chrome.scripting.executeScript({
      target: {
        tabId: tabId
      },
      files: ['pageMover.js']
    });
  }
  getTab()
}


var checkType


var profilesArray=[]
function diversityCheck() {
  chrome.storage.local.get({
  profilesArray : []
  }, function(profilesArray) {
    profilesArray = profilesArray.profilesArray;
    if (profilesArray != undefined) {
      genderAPICheck(profilesArray)
    }
  });

}function nationalityCheck() {
  chrome.storage.local.get({
  profilesArray : []
  }, function(profilesArray) {
    profilesArray = profilesArray.profilesArray;
    if (profilesArray != undefined) {
      nationalityAPICheck(profilesArray)
    }
  });

}

function genderAPICheck(incomingArray){
  var incomingArray
  var resultArray=[]
for(let i=0;i<incomingArray.length;i++){
  var apiKey = 'Insert Genderize.io API key here'
  fetch('https://api.genderize.io?name='+incomingArray[i][2]+'&'+apiKey).then(response =>
      response.json().then(data => ({
          data: data,
          status: response.status
      })
  ).then(res => {
      var builder = [i, incomingArray[i][2], res.data.gender]
      if(resultArray.indexOf(builder)==-1){
        resultArray.push(builder)
      }
      if(resultArray.length>=incomingArray.length){
          chrome.storage.local.set({
            resultArray
          });
          callCheckBoxes()

      }

  }));
}
}

function nationalityAPICheck(incomingArray){
  var resultArray=[]
  var arrayCount=incomingArray.length

  async function getResults() {
    var results = [];
    for (var i = 0; i <= arrayCount - 1; i++) {
      if(incomingArray[i][1]!='LinkedIn Member'){
        var apiKey = 'Insert Nationalize.io API key here'
        var url = 'https://api.nationalize.io?name='+incomingArray[i][2]+'&'+apiKey

        var data = await fetch(url, {
          method: 'GET'
        }).then(function (res) {
          return res.json();
        });
        results.push(data)
      }
    }
    return results;
  } 



  async function test() {
    var nationalityResults = await getResults();
    parseData(nationalityResults)
    function parseData(data){
      console.log('Finished with nationality API, parsing results')
      var incLength = data.length
    
      for(h=0;h<incLength;h++){
       
        var countryLength = (data[h].country).length
        for(p=0;p<countryLength;p++){
          var country = data[h].country[p]
          var countryId=country.country_id
          var probability = country.probability
         
          if(countryId.indexOf('US')!=-1){
       
            if(probability>=.2){
              var builder = [h, data[h].name, 'US']
              if(resultArray.indexOf(builder)==-1){
                resultArray.push(builder)
              }
            }
         
          } 
       
      }
      if((h+1)==incLength){
          chrome.storage.local.set({
            resultArray
          });

      }
      }
  }
  }

  test();
}

function callCheckBoxes(){
  runCheckBoxScript()
}


function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.directive) {

      case "runDiversityChecker":

        runCheckScript()
        sendResponse({}); // sending back empty response to sender
        break;

      case "diversityCheck":
        diversityCheck()
        
        sendResponse({}); // sending back empty response to sender
        break;
      case "stopDiversityCheck":
        var buttonStatus= 'Start';
        chrome.storage.local.set({
          buttonStatus
        }, function() {});
        sendResponse({}); // sending back empty response to sender
        break; 
        
        case "runNationalityChecker":

        runCheckScript()
        sendResponse({}); // sending back empty response to sender
        break;

        case "nationalityCheck":
        nationalityCheck()
        sendResponse({}); // sending back empty response to sender
        break;
      case "stopNationalityCheck":
        var buttonStatus2= 'Start';
        chrome.storage.local.set({
          buttonStatus2
        }, function() {});
        sendResponse({}); // sending back empty response to sender
        break;

      default:
        //console.log("Unmatched request of '" + request + "' from script to background.js from " + sender);
    }
  }
);
