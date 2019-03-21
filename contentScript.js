/*global chrome*/
/*global $store*/
/*global location*/

let kentikComInjectionDone = false;

function kentikComInjection () {
  console.log("kentikComInjection Loading");
  if (!kentikComInjectionDone) {
    kentikComInjectionDone = true;
    var newScriptNode = document.createElement('script');
    newScriptNode.type = "text/javascript";
    newScriptNode.src = chrome.extension.getURL('kentikComInject.js');
    (document.head || document.documentElement).appendChild(newScriptNode);
    console.log("kentikComInjection Done");
  }
}

function kentikLoadSudoIconState() {
    console.log("Loading Kentik Sudo Hide...");
    chrome.storage.local.get("kentikHideSudoIconStateTrigger", function (result) {
        let kentikHideSudoIconStateTrigger = result.kentikHideSudoIconStateTrigger
        if (kentikHideSudoIconStateTrigger === null) {
            console.log("There was no data in kentikHideSudoIconStateTrigger from sessionStorage");
            console.log(kentikHideSudoIconStateTrigger);
        } else {
            console.log("Sudo startup state: [{kentikHideSudoIconStateTrigger: " + kentikHideSudoIconStateTrigger +"}]");
            if (kentikHideSudoIconStateTrigger === "checked") {
                kentikSudoInjection();
            }
        }
    });
}

function kentikWaitForData() {
    if (typeof $store === 'undefined') {
        setTimeout(kentikWaitForData, 100);
    } else if ($store.$explorer.dataview.queryBuckets.activeBuckets[0].queryResults.nonOverlayRows == null){
        setTimeout(kentikWaitForData, 100);
    } else {
        console.log("Anonymizating Data");
        kentikRoleAnonymization();
    }
}

function kentikRoleAnonymization() {
    kentikDoBitShift(kentikSudoToolsAnonymousBitShift);
}

function kentikLoadAnonymization () {
    console.log("Loading Kenitk Anonymization...");
    kentikComInjection();
    chrome.storage.local.get(["kentikSudoToolsAnonymousTarget"], function (result) {
      if (result === null) {
        console.log("No Anonymization Required");
      }
      else if (typeof(result.kentikSudoToolsAnonymousTarget) === "undefined") {}
      else if (typeof(result.kentikSudoToolsAnonymousTarget.kentikSudoToolsAnonymousBitShift) === "undefined") {}
      else if (typeof(result.kentikSudoToolsAnonymousTarget.kentikSudoToolsAnonymousTarget) === "undefined") {}
      else if (result.kentikSudoToolsAnonymousTarget.kentikSudoToolsAnonymousBitShift === false && result.kentikSudoToolsAnonymousTarget.kentikSudoToolsAnonymousTarget === null) {}
      else {
        console.log(JSON.stringify(result));
        let code = `function kentikLoadAnonymizationWhenReady () {
              if (kentikSudoToolsX === 1000) {
                  console.log("Time Out");
                  return;
              }
              if (typeof kentikWaitForData === "function") {
                console.log("Calling Function");
                setTimeout(kentikWaitForData, 200);
                return;
              } else {
                  kentikSudoToolsX++;
                  setTimeout(kentikLoadAnonymizationWhenReady, 100);
                  return;
              }
            }
            kentikSudoToolsX = 1
            kentikSudoToolsSettings = JSON.parse('` + JSON.stringify(result.kentikSudoToolsAnonymousTarget) + `')
            console.log("Calling Watch For Data watcher function to load after pageload")
            kentikLoadAnonymizationWhenReady();`;
        let script = document.createElement('script');
        script.textContent = code;
        (document.head||document.documentElement).appendChild(script);
        console.log("kentikLoadAnonymizationLocal Injected");
      }
    });
}

function kentikSudoInjection () {
    var newScriptNode = document.createElement('script');
    newScriptNode.type = "text/javascript";
    newScriptNode.src = chrome.extension.getURL('pageinjection.js');
    (document.head || document.documentElement).appendChild(newScriptNode);
}

function hideSudoIconHide () {
    console.log("Hiding Sudo Icons");
    document.querySelector('[title="sudo"]').style.display = "none";
    document.querySelector('[title="debug"]').style.display = "none";
}

function hideSudoIconShow () {
    console.log("Showing Sudo Icons");
    document.querySelector('[title="sudo"]').style.display = "initial";
    document.querySelector('[title="debug"]').style.display = "initial";
}

chrome.runtime.onMessage.addListener (function (msg, sender, response) {
    console.log("Message Recived: {msg:"+JSON.stringify(msg)+",sender:"+JSON.stringify(sender)+"}");
    if ((msg.from === 'kentikPopup') && (msg.subject === 'kentikHideSudoIcon')) {
        console.log("Kentink Hide Sudo Message Recived " + msg.state);
        if (msg.state === 'hide') {
            hideSudoIconHide();
        } else {
            hideSudoIconShow();
        }
        response(msg.state + " Message Recived");
    }
    else if ((msg.from === 'kentikPopup') && (msg.subject === 'kentikAnonymization')) {
        console.log("Kentink Anonymization Message Recived " + JSON.stringify(msg.target));
        let code = 'kentikAnonymization(' + JSON.stringify(msg.target) + ')';
        let script = document.createElement('script');
        script.textContent = code;
        (document.head||document.documentElement).appendChild(script);
        script.remove();
    }
    else if ((msg.from === 'kentikPopup') && (msg.subject === 'kentikAnonymizationBitShift')) {
        console.log("Kentink Anonymization Bit Shift Message Recived");
        let code = 'kentikDoBitShift(' + JSON.stringify(msg.target) + ')';
        let script = document.createElement('script');
        script.textContent = code;
        (document.head||document.documentElement).appendChild(script);
        script.remove();
        response("Message Recived");
    }
    else if ((msg.from === 'kentikPopup') && (msg.subject === 'clearAnonymization')) {
        console.log("Kentink Anonymization Clear Message Recived");
        let code = `kentikSudoToolsBitShiftUpdateCheck = false;
        kentikSudoToolsTargetAnonUpdateCheck = false;
        location.reload();`;
        let script = document.createElement('script');
        script.textContent = code;
        (document.head||document.documentElement).appendChild(script);
        script.remove();
        response("Message Recived");
    }
    else if ((msg.from === 'kentikPopup') && (msg.subject === 'clearBitShiftAnonymization')) {
        console.log("Kentink Bit Shift Anonymization Clear Message Recived");
        let code = `kentikSudoToolsBitShiftUpdateCheck = false;
        location.reload();`;
        let script = document.createElement('script');
        script.textContent = code;
        (document.head||document.documentElement).appendChild(script);
        script.remove();
        response("Message Recived");
    }
});

kentikComInjection();
kentikLoadSudoIconState();
kentikLoadAnonymization();
