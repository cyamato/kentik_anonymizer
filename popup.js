/*global chrome*/
console.log("Kentik Sudo Tools Popup.js Loading...");
document.getElementById('kentikSudoHideHeader').textContent = chrome.i18n.getMessage("kentikSudoHideHeader");
document.getElementById('kentikHideSudoIconsSliderLabel').textContent = chrome.i18n.getMessage("kentikHideSudoIconsSliderLabel");
document.getElementById('kentikHideSudoIconsUnhideOnce').textContent = chrome.i18n.getMessage("kentikHideSudoIconsUnhideOnce");
document.getElementById('kentikAnonymizationHeader').textContent = chrome.i18n.getMessage("kentikAnonymizationHeader");
document.getElementById('kentikBitShiftAnonymizeLabel').textContent = chrome.i18n.getMessage("kentikBitShiftAnonymizeLabel");
document.getElementById('kentikAnonymizationClientNameLabel').textContent = chrome.i18n.getMessage("kentikAnonymizationClientNameLabel");
document.getElementById('kentikAnonymizationTargetASNLabel').textContent = chrome.i18n.getMessage("kentikAnonymizationTargetASNLabel");
document.getElementById('kentikAnonymizationInsertASNLabel').textContent = chrome.i18n.getMessage("kentikAnonymizationInsertASNLabel");
document.getElementById('kentikAnonymizationTargetIPLabel').textContent = chrome.i18n.getMessage("kentikAnonymizationTargetIPLabel");
document.getElementById('kentikAnonymizerInsertIPLabel').textContent = chrome.i18n.getMessage("kentikAnonymizerInsertIPLabel");
document.getElementById('kentikAnonymizerAnonymizeButton').textContent = chrome.i18n.getMessage("kentikAnonymizerAnonymizeButton");
document.getElementById('kentikAnonymizerClearButton').textContent = chrome.i18n.getMessage("kentikAnonymizerClearButton");

document.getElementById('kentikBitShiftAnonymizeTrigger').checked = false;
document.getElementById('kentikHideSudoIconStateTrigger').checked = false;

document.getElementById('kentikHideSudoIconStateTrigger').onclick = hideSudoIconStateChange;
document.getElementById('kentikHideSudoIconsUnhideOnce').onclick = hideSudoIconShowOnce;
document.getElementById('kentikBitShiftAnonymizeTrigger').onclick = kentikAnonymizationBitShift;
document.getElementById('kentikAnonymizerClearButton').onclick = kentikClearAnonymization;
document.getElementById('kentikAnonymizerAnonymizeButton').onclick = kentikSetAnonymization;

chrome.storage.local.get("kentikHideSudoIconStateTrigger", function (result) {
    let kentikHideSudoIconStateTrigger = result.kentikHideSudoIconStateTrigger
    if (kentikHideSudoIconStateTrigger === null) {
      console.log("There was no data in kentikHideSudoIconStateTrigger from sessionStorage");
      return;
    } else {
      console.log("startup state: [{kentikHideSudoIconStateTrigger: " + kentikHideSudoIconStateTrigger +"}]");
      if (kentikHideSudoIconStateTrigger === 'checked') {
          document.getElementById('kentikHideSudoIconStateTrigger').checked = true;
      }
    }
});

chrome.storage.local.get("kentikSudoToolsAnonymousTarget", function (result) {
  console.log("Get Sudo Tools Anonymizer Settings");
  if (typeof(result)  === "undefined") {
    console.log("No Data Result");
  }
  else if (typeof(result.kentikSudoToolsAnonymousTarget) === "undefined") {
    console.log("No Data kentikSudoToolsAnonymousTarget");
  } else {
    let kentikSudoToolsAnonymousBitShift = result.kentikSudoToolsAnonymousTarget.kentikSudoToolsAnonymousBitShift;
    let kentikSudoToolsAnonymousTarget = result.kentikSudoToolsAnonymousTarget.kentikSudoToolsAnonymousTarget;
    console.log("kentikSudoToolsAnonymousBitShift: "+kentikSudoToolsAnonymousBitShift);
    console.log("kentikSudoToolsAnonymousTarget: "+kentikSudoToolsAnonymousTarget);
    if (!kentikSudoToolsAnonymousBitShift) {
        console.log("Kentik Anonymizer Bit Shift Not Set");
    } else {
        console.log("Kentik Anonymizer Bit Shift Set");
        document.getElementById('kentikBitShiftAnonymizeTrigger').checked = true;
    }
    if (typeof kentikSudoToolsAnonymousTarget === "undefined" || kentikSudoToolsAnonymousTarget === null) {
        console.log("Kentik Anonymize Data Not Set");
    } else {
        console.log("Kentik Anonymize Data Set");
        if ("clientName" in kentikSudoToolsAnonymousTarget) {
          document.getElementById('kentikAnonymizerClientName').value = kentikSudoToolsAnonymousTarget.clientName;
        }
        if ("i_dst_as_name" in kentikSudoToolsAnonymousTarget) {
          document.getElementById('kentikAnonymizerTargetASN').value = kentikSudoToolsAnonymousTarget.i_dst_as_name;
        }
        if ("inet_dst_addr" in kentikSudoToolsAnonymousTarget) {
          document.getElementById('kentikAnonymizerTargetIPs').value = kentikSudoToolsAnonymousTarget.inet_dst_addr;
        }
        if ("replace_i_dst_as_name" in kentikSudoToolsAnonymousTarget) {
          document.getElementById('kentikAnonymizerInsertASN').value = kentikSudoToolsAnonymousTarget.replace_i_dst_as_name;
        }
        if ("replace_inet_dst_addr" in kentikSudoToolsAnonymousTarget) {
          document.getElementById('kentikAnonymizerInsertIPs').value = kentikSudoToolsAnonymousTarget.replace_inet_dst_addr;
        }
    }
  }
});

function hideSudoIconShowOnce() {
    console.log("Show Once Button pusshed");
    kentikHideSudoIconMessager("show");
}

function hideSudoIconStateChange () {
    console.log("kentikHideSudoIconStateTrigger event has been rasied");
    if (document.getElementById('kentikHideSudoIconStateTrigger').checked) {
        console.log("kentikHideSudoIconStateTrigger checked");
        chrome.storage.local.set({
                'kentikHideSudoIconStateTrigger': 'checked'
            }, function () {
                console.log("kentikHideSudoIconStateTrigger saved as checked");
                kentikHideSudoIconMessager("hide");
            }
        );
    } else {
        console.log("kentikHideSudoIconStateTrigger unchecked");
        chrome.storage.local.set({
                'kentikHideSudoIconStateTrigger': 'unchecked'
            }, function () {
                console.log("kentikHideSudoIconStateTrigger saved as unchecked");
                kentikHideSudoIconMessager("show");
            }
        );
    }
}

function kentikHideSudoIconMessager (state) {
    kentikMessager ({
        from: 'kentikPopup',
        subject: 'kentikHideSudoIcon',
        state: state
    });
}

function kentikAnonymizationBitShift () {
  console.log("Bit Shifter Triggered");
  chrome.storage.local.get("kentikSudoToolsAnonymousTarget", function (result) {
    let kentikSudoToolsAnonymousTarget = null;
    let kentikSudoToolsAnonymousBitShift = false;
    let kentikMessage = "clearBitShiftAnonymization"
    if (typeof(result) === "undefined") {}
    else if (typeof(result.kentikSudoToolsAnonymousTarget) === "undefined") {}
    else if (typeof(result.kentikSudoToolsAnonymousTarget.kentikSudoToolsAnonymousTarget === "undefined")) {}
    else {
      kentikSudoToolsAnonymousTarget = result.kentikSudoToolsAnonymousTarget.kentikSudoToolsAnonymousTarget
    }
    if (document.getElementById('kentikBitShiftAnonymizeTrigger').checked) {
      console.log("Bit Shift Checked");
      kentikSudoToolsAnonymousBitShift = true;
      kentikMessage = "kentikAnonymizationBitShift";
    } else {
      console.log("Bit Shift Unchecked");
    }
    chrome.storage.local.remove(["kentikSudoToolsAnonymousTarget"], function () {
      chrome.storage.local.set({
        'kentikSudoToolsAnonymousTarget': {
          kentikSudoToolsAnonymousBitShift: kentikSudoToolsAnonymousBitShift,
          kentikSudoToolsAnonymousTarget: kentikSudoToolsAnonymousTarget
        }
      }, function () {
          console.log("Bit Shift Saved");
          kentikMessager({
              from: 'kentikPopup',
              subject: kentikMessage
          });
      });
    });
  });
}

function kentikSetAnonymization () {
    console.log("Anonymizer Button Cliked");
    var target = {}
    if (document.getElementById('kentikAnonymizerClientName').value != "") {
        target.clientName = document.getElementById('kentikAnonymizerClientName').value;
    }
    if (document.getElementById('kentikAnonymizerTargetASN').value != "") {
        target.i_dst_as_name = document.getElementById('kentikAnonymizerTargetASN').value;
    }
    if (document.getElementById('kentikAnonymizerTargetASN').value != "") {
        target.i_src_as_name = document.getElementById('kentikAnonymizerTargetASN').value;
    }
    if (document.getElementById('kentikAnonymizerTargetIPs').value != "") {
        target.inet_dst_addr = document.getElementById('kentikAnonymizerTargetIPs').value;
    }
    if (document.getElementById('kentikAnonymizerTargetIPs').value != "") {
        target.inet_src_addr = document.getElementById('kentikAnonymizerTargetIPs').value;
    }
    if (document.getElementById('kentikAnonymizerInsertASN').value != "") {
        target.replace_i_dst_as_name = document.getElementById('kentikAnonymizerInsertASN').value;
    }
    if (document.getElementById('kentikAnonymizerInsertASN').value != "") {
        target.replace_i_src_as_name = document.getElementById('kentikAnonymizerInsertASN').value;
    }
    if (document.getElementById('kentikAnonymizerInsertIPs').value != "") {
        target.replace_inet_dst_addr = document.getElementById('kentikAnonymizerInsertIPs').value;
    }
    if (document.getElementById('kentikAnonymizerInsertIPs').value != "") {
        target.replace_inet_src_addr = document.getElementById('kentikAnonymizerInsertIPs').value;
    }
    chrome.storage.local.get("kentikSudoToolsAnonymousTarget", function (result) {
      let kentikSudoToolsAnonymousBitShift = result.kentikSudoToolsAnonymousTarget.kentikSudoToolsAnonymousBitShift;
      chrome.storage.local.set(
        {
          'kentikSudoToolsAnonymousTarget': {
            kentikSudoToolsAnonymousBitShift: result.kentikSudoToolsAnonymousTarget.kentikSudoToolsAnonymousBitShift,
            kentikSudoToolsAnonymousTarget: target
          }
        }, function () {
            console.log("Saved New Anonymizer Target");
            kentikMessager({
                from: 'kentikPopup',
                subject: 'kentikAnonymization',
                target: target
            });
        }
      );
    });
}

function kentikClearAnonymization () {
    document.getElementById('kentikAnonymizerClientName').value = "";
    document.getElementById('kentikAnonymizerTargetASN').value = "";
    document.getElementById('kentikAnonymizerInsertASN').value = "";
    document.getElementById('kentikAnonymizerTargetIPs').value = "";
    document.getElementById('kentikAnonymizerInsertIPs').value = "";
    chrome.storage.local.remove(["kentikSudoToolsAnonymousTarget"], function () {
      console.log("Memory Cleared");
      kentikMessager ({
          from: 'kentikPopup',
          subject: 'clearAnonymization'
      });
    });
}

function kentikMessager (message) {
    console.log("Sending Message to the content script from Popup: " + JSON.stringify(message));
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            message,
            function (reply) {
              if (chrome.runtime.lastError) {
                console.log("There was an error in sending the message from Popup: "+JSON.stringify(chrome.runtime.lastError));
                return;
              } else {
                console.log("Message Recvided and Replyed to Popup: " + JSON.stringify(reply));
              }
              console.log("Closing Popup")
              kenitkClosePopup();
            }
        );
        console.log("Message Sent from Popup");
    });
}

function kenitkClosePopup () {
    console.log("Closing Popup");
    window.close();
}
