

var resultArray=[]
function loadResultsArray(){
  resultArray=[]
  chrome.storage.local.get({
      resultArray: []
    }, function(data) {
      resultArray = data.resultArray
        checkBoxes(resultArray)
    });
}

//Finds out what should be running.
function getStartStopStatus() {
  chrome.storage.local.get({
    buttonStatus: [],
    buttonStatus2: []
  }, function(data) {
    const buttonStatus = data.buttonStatus;
    const buttonStatus2 = data.buttonStatus2;
    if(buttonStatus==='Stop'){
        loadResultsArray()
    }else{
      console.log('Diversity checker has been stopped!')
    } 
    if(buttonStatus2==='Stop'){
        loadResultsArray()
    }else{
      console.log('Nationality checker has been stopped!')
    }
  });
}
getStartStopStatus()

function checkBoxes(incomingArray) {
  var incomingArray
  // Get the "search-result" elements and the save button
  const resultBlocks = document.getElementsByClassName("ember-view profile-list__border-bottom");

  // Check if there are any search results
  if (incomingArray.length > 0) {
    // Loop through the search results
    for (let i = 0; i < incomingArray.length; i++) {
      // Check if the current search result is defined
      if (incomingArray[i] !== undefined) {        
        // Get the "related-info-row" elements and the name
        const viewRows = resultBlocks[i].getElementsByClassName('lockup__content-title')[0];
        if(resultBlocks[i].getElementsByClassName('artdeco-entity-lockup__title ember-view')[0]!=undefined){
          const name = resultBlocks[i].getElementsByClassName('artdeco-entity-lockup__title ember-view')[0].innerText;
          // Check if there are any "related-info-row" elements
          if (resultBlocks.length > 0) {
            // Get the "related-info" elements
            // Check if the "related-info" elements are empty
              // Check if the name is not "LinkedIn Member"
              
              if (name !== 'LinkedIn Member') {
                // Click the select-member checkbox
                if(incomingArray[i][2]=='female'){
                  if( resultBlocks[incomingArray[i][0]].getElementsByClassName("small-input")[0]!=undefined){
                    if(resultBlocks[incomingArray[i][0]].getElementsByClassName("small-input")[0].checked==false){
                        resultBlocks[incomingArray[i][0]].getElementsByClassName("small-input")[0].click();
                    }
                  }
                } 
                if(incomingArray[i][2]=='US'){
                  if( resultBlocks[incomingArray[i][0]].getElementsByClassName("small-input")[0]!=undefined){
                    if(resultBlocks[incomingArray[i][0]].getElementsByClassName("small-input")[0].checked==false){
                        resultBlocks[incomingArray[i][0]].getElementsByClassName("small-input")[0].click();
                    }
                  }
                }
              }
            // }
          }
        }
      }

      // Check if this is the last search result
      if ((i+1) === incomingArray.length ) {
        sleep(2000)
        console.log('Done with results, saving and moving to next page!')
        setTimeout(() => clickSaveBtn(), 2000);
      }
    }

    function clickSaveBtn(){
      sleep(1500)

      switch (document.readyState) {
        case "loading":
          break;
        case "interactive": {

          break;
        }
        case "complete":
          const toolbarClass=document.getElementsByClassName('collapsible-toolbar profile-list-bulk-actions__collapsible-toolbar')
          if(toolbarClass[0]!=undefined){
            var saveBtn=toolbarClass[0].getElementsByTagName('span')[0].getElementsByClassName('artdeco-hoverable-trigger artdeco-hoverable-trigger--content-placed-top artdeco-hoverable-trigger--is-hoverable ember-view')[0].getElementsByTagName('button')
            if(saveBtn!=undefined){
                setTimeout(() => saveBtn[0].click(), 1000);
                setTimeout(() => scrollPage(), 3000);
            }
          }else{
              setTimeout(() => scrollPage(), 2000);
          }
          break;
      }
    }
  }else{
    //array was empty
    scrollPage()
  }
}


function scrollPage(){
  chrome.storage.local.get({
    buttonStatus: [],
    buttonStatus2: []
  }, function(data) {
    const buttonStatus = data.buttonStatus;
    const buttonStatus2 = data.buttonStatus2;
    if(buttonStatus==='Stop'){
      sleep(2500)
      var pageContainer = document.getElementsByClassName('pagination__quick-link-wrapper')[1];
      if(pageContainer !== undefined){
        var nextBtn = pageContainer.getElementsByClassName('pagination__quick-link pagination__quick-link--next')[0];
        if(nextBtn !== undefined){
          nextBtn.click();
          sleep(2000)
          chrome.runtime.sendMessage({
            directive: "runDiversityChecker"
          }, function(response) {});
        }else{
          console.log('We\'re done with checking our results!');
          stopAutoSourcer()
        }
      }
    }else{
      console.log('Diversity checker has been stopped!')
    }    
    if(buttonStatus2==='Stop'){
      sleep(2500)
      console.log('Clicking next page!')
      var pageContainer = document.getElementsByClassName('pagination__quick-link-wrapper')[1];
      if(pageContainer !== undefined){
        var nextBtn = pageContainer.getElementsByClassName('pagination__quick-link pagination__quick-link--next')[0];
        if(nextBtn !== undefined){
          nextBtn.click();
          sleep(2000)
          chrome.runtime.sendMessage({
            directive: "runNationalityChecker"
          }, function(response) {});
        }else{
          console.log('We\'re done with checking our results!');
          stopAutoSourcer()
        }
      }
    }else{
      console.log('Nationality checker has been stopped!')
    }
  });


}

function checkArchiveBoxes() {
  const profileContainer = document.querySelector('.table-container-project');
  const rowHolder = profileContainer.querySelectorAll('.row');

  if (rowHolder.length > 0) {
    for (let row of rowHolder) {
      const viewRow = row.querySelector('.team-activity-col');
      const viewIcon = viewRow.querySelector('.views');
      const name = row.querySelector('.name').title;

      if (viewIcon.innerText.indexOf('view') !== -1 && name !== 'LinkedIn Member') {
        row.querySelector('.prospect-checkbox').click();
      }
    }

    const btnBlock = document.querySelector('.two-line-heading');
    const subBtns = btnBlock.querySelector('ul');
    const archiveBtnIndex = subBtns.querySelectorAll('li')[12];
    const archiveBtn = archiveBtnIndex.children[0];

    setTimeout(() => {
      archiveBtn.click();
      scrollArchivePage();
    }, 500);
  }
}

function scrollArchivePage() {
  // Get the pagination container
  var pageContainer = document.getElementsByClassName('pagination')[0];
  // Check if the container exists
  if (pageContainer) {
    // Get the next button
    var nextBtn = pageContainer.getElementsByClassName('next')[0];
    // Check if the next button exists
    if (nextBtn) {
      // Click the next button
      nextBtn.click();
    } else {
      // If the next button doesn't exist, we're done with checking our results
      console.log("We're done with checking our results!");
      location.reload();
    }
  }
}

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
    directive: "stopNationalityCheck"
  }, function(response) {});
}