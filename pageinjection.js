/*global chrome*/
/*global $store*/

let kentikReadyEventHandlersInstalled = false;
if (!kentikReadyEventHandlersInstalled) {
    if (document.addEventListener) {
        document.addEventListener("load", kentikStartupScripts, false);
        window.addEventListener("load", kentikStartupScripts, false);
    } else {
        document.attachEvent("onreadystatechange", kentikReadyStateChange);
        window.attachEvent("onload", kentikStartupScripts);
    }
    kentikReadyEventHandlersInstalled = true;
}

function kentikReadyStateChange() {
    if ( document.readyState === "complete" ) {
        kentikStartupScripts();
    }
}

function kentikStartupScripts () {
    kentikHideSudoIconHide();
}

let kentikSudoIconX = 1
function kentikHideSudoIconHide () {
    let sudoIconNode = document.querySelector('[title="sudo"]');
    let debugIconNode = document.querySelector('[title="debug"]');
    if (!sudoIconNode && !debugIconNode) {
      console.log("Waitting for Elements to load");
      kentikSudoIconX++;
      if (kentikSudoIconX < 1000){
          setTimeout(kentikHideSudoIconHide, 50);
      }
      return;
    }
    console.log("Hiding Sudo Icons");
    sudoIconNode.style.display = "none";
    debugIconNode.style.display = "none";
}
