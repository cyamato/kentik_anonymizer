console.log("Kenitk Com Script Injected and Loading");
let kentikSudoToolsBitShiftUpdateCheck = false;
let kentikSudoToolsTargetAnonUpdateCheck = false;
let curentRowKey = "";
let kentikSudoToolsTargetAnonTarget = {};

function kentikSudoToolsDataUpdateCheck () {
    if (kentikSudoToolsBitShiftUpdateCheck || kentikSudoToolsTargetAnonUpdateCheck) {
        if (typeof $store === 'undefined') {
        } else if ($store.$explorer.dataview.queryBuckets.activeBuckets[0].queryResults.nonOverlayRows === null) {
        } else if ($store.$explorer.dataview.queryBuckets.activeBuckets[0].queryResults.nonOverlayRows.length < 1) {
        } else {
          let workingRow = $store.$explorer.dataview.queryBuckets.activeBuckets[0].queryResults.nonOverlayRows[0].get()
          if (workingRow.key != curentRowKey) {
              console.log("Data Updated");
              if (kentikSudoToolsBitShiftUpdateCheck) {
                  kentikDoBitShift();
              } else if (kentikSudoToolsTargetAnonUpdateCheck) {
                  kentikAnonymization(kentikSudoToolsTargetAnonTarget);
              }
              return;
          }
        }
        setTimeout(kentikSudoToolsDataUpdateCheck, 50);
    }
}

function kentikAnonymization (target) {
    console.log("Anonymization Called From Extention ");
    if ("clientName" in target) {
        document.querySelector('.portal-navbar small.pt-text-muted:last-child').innerHTML = target.clientName;
    }
    for (let curentObject=0; curentObject < $store.$explorer.dataview.queryBuckets.activeBucketCount; curentObject++) {
        for (let curentRow=0, rows=$store.$explorer.dataview.queryBuckets.activeBuckets[0].queryResults.nonOverlayRows.length; curentRow<rows; curentRow++) {
            let workingObjRow = {};
            let row = $store.$explorer.dataview.queryBuckets.activeBuckets[curentObject].queryResults.nonOverlayRows[curentRow].get();
            let key = row.key;
            let lookup = row.lookup;
            let modifedRow = false;
            if ("i_dst_as_name" in target && "i_dst_as_name" in row) {
                if (target.i_dst_as_name === row.i_dst_as_name) {
                    console.log("i_dst_as_name updating: Curent Row: " + curentRow + " Targeting: " + target.i_dst_as_name + " Match: " + workingObjRow.i_dst_as_name);
                    key = key ? key.replace(row.i_dst_as_name, target.replace_i_dst_as_name) : "";
                    lookup = lookup ? lookup.replace(row.i_dst_as_name, target.replace_i_dst_as_name) : "";
                    workingObjRow.i_dst_as_name = target.replace_i_dst_as_name;
                    modifedRow = true;
                    // console.log("i_dst_as_name updated: " + JSON.stringify(workingObjRow));
                }
            }
            if ("i_src_as_name" in target && "i_src_as_name" in row) {
                if (target.i_src_as_name === row.i_src_as_name) {
                    key = key ? key.key.replace(row.i_src_as_name, target.replace_i_src_as_name) : "";
                    lookup = lookup ? lookup.lookup.replace(row.i_src_as_name, target.replace_i_src_as_name) : "";
                    workingObjRow.i_src_as_name = target.replace_i_src_as_name;
                    modifedRow = true;
                    // console.log("i_src_as_name updated: " + JSON.stringify(workingObjRow));
                }
            }
            if ("inet_dst_addr" in target && "inet_dst_addr" in row) {
                if (target.inet_dst_addr === row.inet_dst_addr) {
                    key = key ? key.key.replace(row.inet_dst_addr, target.replace_inet_dst_addr) : "";
                    lookup = lookup ? lookup.lookup.replace(row.inet_dst_addr, target.replace_inet_dst_addr) : "";
                    workingObjRow.inet_dst_addr = target.replace_inet_dst_addr;
                    modifedRow = true;
                    // console.log("inet_dst_addr updated: " + JSON.stringify(workingObjRow));
                }
            }
            if ("inet_src_addr" in target && "inet_src_addr" in row) {
                if (target.inet_src_addr === row.inet_src_addr) {
                    key = key ? key.key.replace(row.inet_src_addr, target.replace_inet_src_addr) : "";
                    lookup = lookup ? lookup.lookup.replace(row.inet_src_addr, target.replace_inet_src_addr) : "";
                    workingObjRow.inet_src_addr = target.replace_inet_src_addr;
                    modifedRow = true;
                    // console.log("inet_src_addr updated: " + JSON.stringify(workingObjRow));
                }
            }
            if (!modifedRow) {
                workingObjRow.key = workingObjRow.key + " ";
                if ("lookup" in target) {
                  workingObjRow.lookup = workingObjRow.lookup + " ";
                }
            } else {
                workingObjRow.key = key + " ";
                workingObjRow.lookup = lookup+ " ";
                if ("lookup" in target) {
                  console.log(JSON.stringify(workingObjRow));
                }
                $store.$explorer.dataview.queryBuckets.activeBuckets[curentObject].queryResults.nonOverlayRows[curentRow].set(workingObjRow);
            }
        }
        $store.$explorer.dataview.queryBuckets.at(curentObject).collection.setLastUpdated();
    }
    kentikSudoToolsTargetAnonTarget = target;
    curentRow = $store.$explorer.dataview.queryBuckets.activeBuckets[0].queryResults.nonOverlayRows[0].get()
    curentRowKey = curentRow.key;
    kentikSudoToolsTargetAnonUpdateCheck = true;
    kentikSudoToolsDataUpdateCheck();
    console.log("Anonymization Completed");
}

function CharShift (oragin, shift) {
  return oragin.substr(shift - oragin.length) + oragin.substr(0,shift);
}

function ParseIP (ip) {
	let ipv4RegEx = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/\d{1,3}/gm;
  let ipv6RegEx = /((\w{1,4}:{1,2}){1,7}\w{1,4}\/\d{1,3})/gm;
  let parsedIP;
  let ipv4 = ipv4RegEx.test(ip);
  let ipv6 = ipv6RegEx.test(ip);
  if (ipv4) {
  	parsedIP = IPv4Expand(ip);
  } else if (ipv6) {
  	parsedIP = IPv6Expand(ip);
  } else {
  	parsedIP = null;
  }
  return parsedIP
}

function IPv6Expand (testIPv6) {
  const hexFiller = "0000000000000000";
  const testArray = testIPv6.match(/((\w{1,4}:{1,2}){1,7}\w{1,4}\/\d{1,3})/gm);
  const IPAddressParts = testArray[0].split("/");
  const ipAddressSegments = IPAddressParts[0].split(":");
  let expandedIPv6Address = [];
  let shortIPv6Segment = 0;
  let shortIPv6CompresedSegments = 9-ipAddressSegments.length;
  for (let ipSeg=0; ipSeg < 8; ipSeg++) {
  	if (ipAddressSegments[shortIPv6Segment] === "") {
    	for (let exp=0; exp<shortIPv6CompresedSegments; exp++, ipSeg++) {
      	expandedIPv6Address[ipSeg] = hexFiller;
      }
      shortIPv6Segment++;
    	expandedIPv6Address[ipSeg] = (hexFiller + parseInt(ipAddressSegments[shortIPv6Segment],16).toString(2)).substr(-16);
    } else {
    	expandedIPv6Address[ipSeg] = (hexFiller + parseInt(ipAddressSegments[shortIPv6Segment],16).toString(2)).substr(-16);
    }
    shortIPv6Segment++;
  }
  return {
  	address: expandedIPv6Address.join(""),
    addressSize: 128,
    addressSegs: expandedIPv6Address,
    addressString: testIPv6,
    subnetSize: parseInt(IPAddressParts[1], 10),
    subnet: (("1").repeat(IPAddressParts[1]) + "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000").substr(0,128)
  };
}

function IPv4Expand (testIPv4) {
	const ipv4Space = "00000000";
  const ipv4Parts = testIPv4.split("/");
  let ipv4Address = ipv4Parts[0].split(".");
  let ipv4AddressString = "";
  for (let ipv4seg=0; ipv4seg<4; ipv4seg++) {
  	ipv4Address[ipv4seg] = (ipv4Space + parseInt(ipv4Address[ipv4seg],10).toString(2)).substr(-8);
  }
  return {
  	address: ipv4Address.join(""),
    addressSize: 32,
    addressSegs: ipv4Address,
    addressString: testIPv4,
    subnetSize: parseInt(ipv4Parts[1],10),
    subnet: (("1").repeat(ipv4Parts[1]) + "00000000000000000000000000000000").substr(0,32)
  };
}

function AnonymizeIP (oragin, matchedLists) {
	let match = false;
  let anonymizedAddress = "";
  let matchIndex = 0;
  for (let targetItem=0, targetLen=matchedLists.targets.length; targetItem<targetLen; targetItem++) {
  	if (oragin.addressSize === matchedLists.targets[targetItem].addressSize) {
    	match = true;
      for (let checkPoint=0; checkPoint<matchedLists.targets[targetItem].subnetSize; checkPoint++) {
        if (oragin.address[checkPoint] != matchedLists.targets[targetItem].address[checkPoint]) {
          match = false;
          break;
        }
      }
    }
    if (match) {
    	matchIndex = targetItem;
    	break;
    }
  }
  if (match) {
  	let replacement = matchedLists.replacements[matchIndex];
    for (let copyPoint=0; copyPoint<replacement.addressSize; copyPoint++) {
    	if (copyPoint < replacement.subnetSize) {
    		anonymizedAddress += replacement.address[copyPoint];
      } else {
      	anonymizedAddress += oragin.address[copyPoint];
      }
    }
    let anonymizedAddressString = "";
    if (oragin.addressSize == 32) {
			anonymizedAddressString = parseInt(anonymizedAddress.substr(0,8),2).toString(10) + ".";
			anonymizedAddressString += parseInt(anonymizedAddress.substr(8,8),2).toString(10) + ".";
			anonymizedAddressString += parseInt(anonymizedAddress.substr(16,8),2).toString(10) + ".";
			anonymizedAddressString += parseInt(anonymizedAddress.substr(24,8),2).toString(10);
      anonymizedAddressString += "/" + oragin.subnetSize;
    } else {
      anonymizedAddressString = parseInt(anonymizedAddress.substr(0,16),2).toString(16) + ":";
      anonymizedAddressString += parseInt(anonymizedAddress.substr(16,16),2).toString(16) + ":";
      anonymizedAddressString += parseInt(anonymizedAddress.substr(32,16),2).toString(16) + ":";
      anonymizedAddressString += parseInt(anonymizedAddress.substr(48,16),2).toString(16) + ":";
      anonymizedAddressString += parseInt(anonymizedAddress.substr(64,16),2).toString(16) + ":";
      anonymizedAddressString += parseInt(anonymizedAddress.substr(80,16),2).toString(16) + ":";
      anonymizedAddressString += parseInt(anonymizedAddress.substr(96,16),2).toString(16) + ":";
      anonymizedAddressString += parseInt(anonymizedAddress.substr(112,16),2).toString(16);
      anonymizedAddressString += "/" + oragin.subnetSize;
    }
    return anonymizedAddressString;
  } else {
  	return oragin.addressString;
  }
}

function MakeIPLists (targetIPs, replacementIPs) {
	let list = targetIPs.split(",");
  let targets = [];
  for (let item=0, itemLen=list.length; item<itemLen; item++) {
  	targets.push(ParseIP(list[item]));
  }
  list = replacementIPs.split(",");
  let replacements = [];
  for (let item=0, itemLen=list.length; item<itemLen; item++) {
  	replacements.push(ParseIP(list[item]));
  }
  return {
  	targets: targets,
    replacements: replacements
  }
}

function BitShift (dataObj) {
	let updateObj = {
    'key': dataObj.key
  };
  let lookupFound = "lookup" in dataObj;
  if (lookupFound) {
    updateObj.lookup = dataObj.lookup;
  }
  const targetElemets = [
  	"i_dst_as_name",
    "i_src_as_name",
    "i_dst_nexthop_as_name",
    "i_src_nexthop_as_name",
    "i_dst_second_asn_name",
    "i_src_second_asn_name",
    "i_dst_third_asn_name",
    "i_src_third_asn_name",
    "dst_bgp_aspath",
    "src_bgp_aspath",
    "inet_dst_addr",
    "inet_src_addr",
    "dst_route_prefix_len",
    "src_route_prefix_len",
    "inet_dst_next_hop",
    "inet_src_next_hop"
  ];
  for (let teIndex=0, teLen=targetElemets.length; teIndex<teLen; teIndex++) {
  	targetElement = targetElemets[teIndex];
    if (targetElement in dataObj) {
      let target = "";
      let shifted = "";
      let shifted2 = "";
      if (targetElement == "i_dst_as_name" || targetElement == "i_src_as_name" || targetElement == "i_dst_nexthop_as_name" || targetElement == "i_src_nexthop_as_name" || targetElement == "i_dst_second_asn_name" || targetElement == "i_src_second_asn_name" || targetElement == "i_dst_third_asn_name" || targetElement == "i_src_third_asn_name") {
        target = dataObj[targetElement].match(/\((\d+)\)/)[1];
        shifted = "Anonymized ASN (" + parseInt(CharShift(parseInt(target,10).toString(2),1),2).toString(10) + ")";
        target = dataObj[targetElement];
        shifted2 = shifted;
        updateObj[targetElement] = dataObj[targetElement].replace(target, shifted);
      }
      else if (targetElement === "inet_dst_addr" || targetElement === "inet_src_addr" || targetElement === "dst_route_prefix_len" || targetElement === "src_route_prefix_len" || targetElement === "inet_dst_next_hop" || targetElement === "inet_src_next_hop") {
        let targetIP = ParseIP(dataObj[targetElement]);
        target = targetIP.addressString;
        for (let seg=0,segLen=targetIP.addressSegs.length; seg<segLen; seg++) {
          if (targetIP.addressSize === 32) {
            shifted += parseInt(CharShift(targetIP.addressSegs[seg],1).toString(2),2).toString(10);
            if (seg < segLen-1) {
              shifted += ".";
            }
          } else {
            shifted += parseInt(CharShift(targetIP.addressSegs[seg],1).toString(2),2).toString(16);
            if (seg < segLen-1) {
              shifted += ".";
            }
          }
        }
        shifted2 = shifted += "/" + targetIP.subnetSize;
        shifted += "/" + target.split("/")[1];
        updateObj[targetElement] = dataObj[targetElement].replace(target, shifted);
      }
      else if (targetElement == "dst_bgp_aspath" || targetElement == "src_bgp_aspath") {
        target = dataObj[targetElement];
        let asns = dataObj[targetElement].split(" ");
        for (let asnIndex=0, asnLen=asns.length; asnIndex<asnLen; asnIndex++) {
          shifted += parseInt(CharShift(parseInt(asns[asnIndex]).toString(2),1),2).toString(10);
          if (asnIndex < asnLen-1) {
            shifted += " "
          }
        }
        shifted2 = shifted;
        updateObj[targetElement] = dataObj[targetElement].replace(target, shifted);
      }
      updateObj.key = updateObj.key.replace(target, shifted2);
      if (lookupFound) {
        updateObj.lookup = updateObj.lookup.replace(target, shifted);
      }
    }
  }
  return updateObj;
}

function kentikDoBitShift (clientName = "Anonymized") {
    console.log("Bit Shift Anonymization Called From Extention ");
    document.querySelector('.portal-navbar small.pt-text-muted:last-child').innerHTML =clientName;
    let storeLen = $store.$explorer.dataview.queryBuckets.activeBuckets[0].queryResults.nonOverlayRows.length;
    for (let storeIndex=0; storeIndex<storeLen; storeIndex++) {
      let storeObj = $store.$explorer.dataview.queryBuckets.activeBuckets[0].queryResults.nonOverlayRows[storeIndex].get();
      let updateObj = BitShift(storeObj);
      // console.log("Updated for " + storeIndex + ": " + JSON.stringify(updateObj));
      $store.$explorer.dataview.queryBuckets.activeBuckets[0].queryResults.nonOverlayRows[storeIndex].set(updateObj);
    }
    $store.$explorer.dataview.queryBuckets.at(0).collection.setLastUpdated();
    curentRow = $store.$explorer.dataview.queryBuckets.activeBuckets[0].queryResults.nonOverlayRows[0].get()
    curentRowKey = curentRow.key;
    kentikSudoToolsBitShiftUpdateCheck = true;
    kentikSudoToolsDataUpdateCheck();
    console.log("Bit Shift Anonymization Completed");
}

function kentikRoleAnonymization() {
    kentikDoBitShift();
}

function kentikWaitForData() {
    console.log("kentikWaitForData");
    try {
      if (typeof($store) === 'undefined') {
          setTimeout(kentikWaitForData, 50);
          return;
      } else if (typeof($store.$explorer) === 'undefined') {
        setTimeout(kentikWaitForData, 50);
        return;
      } else if (typeof($store.$explorer.dataview) === 'undefined') {
        setTimeout(kentikWaitForData, 50);
        return;
      } else if (typeof($store.$explorer.dataview.queryBuckets) === 'undefined') {
        setTimeout(kentikWaitForData, 50);
        return;
      } else if (typeof($store.$explorer.dataview.queryBuckets.activeBuckets[0].queryResults.nonOverlayRows) === 'undefined') {
        setTimeout(kentikWaitForData, 50);
        return;
      } else if ($store.$explorer.dataview.queryBuckets.activeBuckets[0].queryResults.nonOverlayRows === null) {
        setTimeout(kentikWaitForData, 50);
        return;
      } else if ($store.$explorer.dataview.queryBuckets.activeBuckets[0].queryResults.nonOverlayRows.length < 1) {
        setTimeout(kentikWaitForData, 50);
        return;
      } else {
        console.log("Anonymizating Data");
        let kentikSudoToolsAnonymousTarget = kentikSudoToolsSettings.kentikSudoToolsAnonymousTarget;
        let kentikSudoToolsAnonymousBitShift = kentikSudoToolsSettings.kentikSudoToolsAnonymousBitShift;
        if (kentikSudoToolsAnonymousBitShift != null) {
            console.log("Doing Bitshift Anonymization");
            kentikRoleAnonymization();
        } else if (kentikSudoToolsAnonymousTarget != null) {
            console.log("Doing Targeted Anonymization");
            kentikAnonymization(kentikSudoToolsAnonymousTarget);
        }
      }
    } catch(error) {
      console.error(error);
      setTimeout(kentikWaitForData, 50);
    }
}

console.log("Kenitk Com Script Injected and Loaded");
