
function stopAutoSourcer(){
  var buttonStatus= 'Start';
  var buttonStatus2= 'Start';
  checkStatus='false'
  chrome.storage.local.set({
    buttonStatus,
    buttonStatus2
  }, function() {});
  chrome.runtime.sendMessage({
    directive: "stopDiversityChecker"
  }, function(response) {}); 
  chrome.runtime.sendMessage({
    directive: "stopNationalityChecker"
  }, function(response) {});

}



function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

 async function collectProfiles() {
  // Wait for 2 seconds before collecting profiles
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Get the list of profiles
  const resultsList = document.getElementsByClassName('ember-view profile-list');
  // Get the rows of profiles
  const rows = resultsList[0].getElementsByClassName('row');
  // Get the number of rows
   var rowCount = rows.length;
   const pageContainer = document.getElementsByClassName('pagination__quick-link-wrapper')[1];
  // Check if there are fewer than 25 rows
  if (rowCount < 25) {
    // Get the page container element
    

    // Check if the page container element exists
    if (pageContainer !== undefined) {
      // Get the "next" button element
      const nextBtn = pageContainer.getElementsByClassName('pagination__quick-link pagination__quick-link--next')[0];

      // Check if the "next" button element exists
      if (nextBtn === undefined) {
        console.log("We're done with checking our results!");
        stopAutoSourcer()
      } else {
        console.log("Looks like we didn't load all the profiles, rescrolling");
        scollCounter = 0;
        await new Promise(resolve => setTimeout(resolve, 1000));

        chrome.storage.local.get({
          buttonStatus: [],
          buttonStatus2: []
        }, function(data) {
          const buttonStatus = data.buttonStatus;
          const buttonStatus2 = data.buttonStatus2;
          if(buttonStatus==='Stop'){
            sleep(1000)
              scrollThePage();
          }else{
            console.log('Diversity checker has been stopped!')
          } 
          if(buttonStatus2==='Stop'){
            sleep(1000)
              scrollThePage();
          }else{
            console.log('Nationality checker has been stopped!')
          }
        });
      }
    }
  }else{
    //we have all the rows
    //check to see if we're on the last page?
    const nextBtn = pageContainer.getElementsByClassName('pagination__quick-link pagination__quick-link--next')[0];
    if (nextBtn === undefined) {
      console.log("We're done with checking our results!");
      stopAutoSourcer()
    }else{
      //save results

        // Initialize variables to store data
  let name;
  let firstName;
  const profilesArray = [];
  let profileBuilder;

  // Iterate through each row
  for (let i = 0; i < rowCount; i++) {
    // Get the top card element for the current row
    const rowTopCard = rows[i].getElementsByClassName('row__top-card')[0];
    // Get the name of the profile
    name = rowTopCard.getElementsByClassName('artdeco-entity-lockup__title ember-view')[0].innerText;

    // Split the name to get the first name
    if (name.indexOf(' ') !== -1) {
      const splitName = name.split(' ');
      firstName = splitName[0];
      profileBuilder = [i, name, firstName];
      // Add the profile data to the array if it doesn't already exist
      if (profilesArray.indexOf(profileBuilder) === -1) {
        profilesArray.push(profileBuilder);
      }
    } else {
      const splitName = name.split('(');
      firstName = splitName[0];
      profileBuilder = [i, name, firstName];
      // Add the profile data to the array if it doesn't already exist
      if (profilesArray.indexOf(profileBuilder) === -1) {
        profilesArray.push(profileBuilder);
      }
    }
  }

  // Save the array of profile data to local storage
  chrome.storage.local.set({
    profilesArray
  });

  // Send a message to the background script to perform a diversity check
  sleep(1000)
  chrome.storage.local.get({
    checkType: []
  }, function(data) {
    const checkType = data.checkType;
    // console.log(buttonStatus)
    if(checkType==='Diversity'){
      chrome.runtime.sendMessage({
        directive: "diversityCheck"
      }, function(response) {});
    } 
    if(checkType==='Nationality'){  
    chrome.runtime.sendMessage({
     directive: "nationalityCheck"
    }, function(response) {});
    }
  });
    } 
  }
 }

//original
var scollCounter
var currentURL

function scrollThePage(){
 
  scrollCounter=0
  const onScrollStop = callback => {
  let isScrolling;
  window.addEventListener(
    'scroll',
    e => {
      clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        callback();
      }, 250);
    },
    false
  );
};
  sleep(2500)
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  function scrollTop(){

    if(scrollCounter==1){
      sleep(1000)
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    if(scrollCounter==2){
        sleep(2500)
      window.scrollTo({top:document.body.scrollHeight/1.5, behavior: 'smooth'});
    }
    if(scrollCounter==3){
        sleep(2500)
      window.scrollTo({top:document.body.scrollHeight/2, behavior: 'smooth'});
    }
    if(scrollCounter==4){
        sleep(2500)
      window.scrollTo({top:document.body.scrollHeight/3, behavior: 'smooth'});
    }
    if(scrollCounter==5){
        sleep(1500)
      window.scrollTo({top:document.body.scrollHeight/4, behavior: 'smooth'});
    }
    if(scrollCounter==6){
        sleep(1500)
      window.scrollTo({top:document.body.scrollHeight/5, behavior: 'smooth'});
    }
    if(scrollCounter==7){
        sleep(1500)
      window.scrollTo({top:document.body.scrollHeight/6, behavior: 'smooth'});
    }

    if(scrollCounter==8){
      sleep(1500)
      window.scrollTo({ top: 0, behavior: 'smooth'  });
    }
    if(scrollCounter==9){
      const resultsList = document.getElementsByClassName('ember-view profile-list');
      // Get the rows of profiles
      const rows = resultsList[0].getElementsByClassName('row');
      var rowCount=rows.length
      console.log('We finished scrolling')
      //if row count = 24+1 then check the profiles
      //else check if it's last page then check profiles
      setTimeout(collectProfiles, 3000)
    }
  }

  onScrollStop(() => {
    scrollCounter=scrollCounter+1
    scrollTop()
  });
}

if (document.readyState === 'complete' && window.location.href.indexOf("https://www.linkedin.com/talent") !== -1) {

getStartStopStatus()
  function getStartStopStatus() {
    chrome.storage.local.get({
      buttonStatus: [],
      buttonStatus2: []
    }, function(data) {
      const buttonStatus = data.buttonStatus;
      const buttonStatus2 = data.buttonStatus2;
      if(buttonStatus==='Stop'){
          scrollThePage();
      }else{
        console.log('Diversity checker has been stopped!')
      }
      if(buttonStatus2==='Stop'){
          scrollThePage();
      }else{
        console.log('Nationality checker has been stopped!')
      }
    });
  }
}
