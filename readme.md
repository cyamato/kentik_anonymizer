# Kentik Sudo Tools
This Google Chrome Extension adds a button to the top navigation bar which can be used to interact with the Kentik Portal for Internal users.  Currently it provides two functions:

 1. Hide SUDO buttons in the Navigation Bar.  This includes the Debug Wrench Icon and the SUDO Key Icon.  They can be turned off persistently and exposed once.  The setting should release after Chrome is restarted.

 2. Anonymization of the data.  This is done by changing the data cache for the query results within the browser.  This will preset through page refreshes and new queries.  The extension will monitor and check for changes in the store every 50ms.  There are two options for this anonymization.
	* Bit Shift, which moves the most left bit to the far right for every number set such as IP or ASN.

	* Targeted Anonymization, allows you to change the company name, comma delimited ASNs, and IP/CIDRs.  Please note that the Target and Insert IPs should be in matched sets and use the same subnets but are not required to do so.  The Insert IP subnet mask will be used for the modification.

## Install

 Option 1 - Local Install
: Extensions can be loaded in unpacked mode by following the following steps:
Visit chrome://extensions (via omnibox or menu -> Tools -> Extensions).
Enable Developer mode by ticking the checkbox in the upper-right corner.
Click on the "Load unpacked extension..." button.
Select the directory containing your unpacked extension.

 Option 2 - Private Chrome web app
 : Publishing a private app is very similar to publishing a public app to the Chrome Web Store. The only difference is there's an additional step of restricting access to the app to your domain:
Sign in to the Chrome developer dashboard.
Accept the Terms of Service.
Add a new item and upload your app as a zip file.
Set the promotional image you want to use, and the category, and language for the app.
Select Private and Everyone at <your domain>.
If the extension is valid, it'll be loaded up and active right away! If it's invalid, an error message will be displayed at the top of the page. Correct the error, and try again.
