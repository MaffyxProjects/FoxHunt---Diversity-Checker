//Runs on popup load
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('buttonDiversityCheck').addEventListener('click', clickHandler);
  document.getElementById('buttonNationalityCheck').addEventListener('click', clickHandler2);
  document.getElementById('btnClearCache').addEventListener('click', clearCache);

loadSettings()
})//End loaded listener

//Save our current forms, helps with field preservation when changing settings
var buttonStatus
var buttonStatus2

//save current running status
const saveSettings = () => {
  
   if (document.getElementById('buttonDiversityCheck').innerText == "Start")
   {
      buttonStatus='Start'
   }
   else if (document.getElementById('buttonDiversityCheck').innerText == "Stop")
   {
      buttonStatus='Stop'
   }else{
     buttonStatus='Start'
   } 
   
   if (document.getElementById('buttonNationalityCheck').innerText == "Start")
   {
      buttonStatus2='Start'
   }
   else if (document.getElementById('buttonNationalityCheck').innerText == "Stop")
   {
      buttonStatus2='Stop'
   }else{
     buttonStatus2='Start'
   }

   chrome.storage.local.set({
     buttonStatus
   }); 
   chrome.storage.local.set({
     buttonStatus2
   });
   window.close()
};

//load status on popup load
const loadSettings = () => {
  chrome.storage.local.get({
    buttonStatus: [],
    buttonStatus2: []
  }, function(data) {
    buttonStatus = data.buttonStatus;
    buttonStatus2 = data.buttonStatus2;
    if(buttonStatus=='Start'){
      document.getElementById('buttonDiversityCheck').innerText = "Start";
    }else if(buttonStatus=='Stop'){
      document.getElementById('buttonDiversityCheck').innerText = "Stop";
    }
    
    if(buttonStatus2=='Start'){
      document.getElementById('buttonNationalityCheck').innerText = "Start";
    }else if(buttonStatus2=='Stop'){
      document.getElementById('buttonNationalityCheck').innerText = "Stop";
    }
  });
};

//Called on Start/Stop button click, sends messages to background.js that we need to do something
const clickHandler = () => {
    if (document.getElementById('buttonDiversityCheck').innerText == "Start")
    {
      chrome.runtime.sendMessage({directive: "runDiversityChecker"}, function(response) {});
      checkType='Diversity'
        chrome.storage.local.set({
          checkType
        });
    }
    else if (document.getElementById('buttonDiversityCheck').innerText == "Stop")
    {
      chrome.runtime.sendMessage({directive: "stopDiversityCheck"}, function(response) {});
    }
    
    
    //Change button text
    toggleText();
};

const clickHandler2 = () => {
    if (document.getElementById('buttonNationalityCheck').innerText == "Start")
    {
      chrome.runtime.sendMessage({directive: "runNationalityChecker"}, function(response) {});
      checkType='Nationality'
      chrome.storage.local.set({
        checkType
      });
    }
    else if (document.getElementById('buttonNationalityCheck').innerText == "Stop")
    {
      chrome.runtime.sendMessage({directive: "stopNationalityCheck"}, function(response) {});
    }
    //Change button text
    toggleText2()
};


//Changes text on the button for us
const toggleText = () => {
   if (document.getElementById('buttonDiversityCheck').innerText == "Start")
   {
      document.getElementById('buttonDiversityCheck').innerText = "Stop";
   }
   else if (document.getElementById('buttonDiversityCheck').innerText == "Stop")
   {
      document.getElementById('buttonDiversityCheck').innerText = "Start";
   }
   else {
       document.getElementById('buttonDiversityCheck').innerText = "Start";
   }
  
     saveSettings();

};

const toggleText2 = () => {
   if (document.getElementById('buttonNationalityCheck').innerText == "Start")
   {
      document.getElementById('buttonNationalityCheck').innerText = "Stop";
   }
   else if (document.getElementById('buttonNationalityCheck').innerText == "Stop")
   {
      document.getElementById('buttonNationalityCheck').innerText = "Start";
   }
   else {
       document.getElementById('buttonNationalityCheck').innerText = "Start";
   }
     saveSettings();
};

//Clears our local cache for testing reasons
function clearCache(){
  chrome.storage.sync.clear(function() {
    var error = chrome.runtime.lastError;
    if (error) {
        console.error(error);
    }
  });
  chrome.storage.local.clear(function() {
    var error = chrome.runtime.lastError;
    if (error) {
        console.error(error);
    }
  });
     window.close()
}
