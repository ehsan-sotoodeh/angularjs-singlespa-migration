import axios from "axios";

const BING_MAP_KEY =
  "Apk2wwOfyW26tQC-4Ca-5vOyCySWHNfMJj1wTkhx-xEyvXdY0SrW_RfEJettZxzh";

const AUTO_SUGGEST_URL = "http://dev.virtualearth.net/REST/v1/Autosuggest";

const FIND_LOCATION_URL = "http://dev.virtualearth.net/REST/v1/Locations/";

export const summarizeText = (text = "", length) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

export const getLocationFromAddress = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await axios.get(
        FIND_LOCATION_URL + address,
        {
          params: {
            key: BING_MAP_KEY,
            maxResults: 10,
          },
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );
      const foundLocations =
        result?.data?.resourceSets[0]?.resources[0]?.point.coordinates;
      const foundAddress = result?.data?.resourceSets[0]?.resources[0]?.name;
      resolve({ location: foundLocations, address: foundAddress });
    } catch (error) {
      reject(error);
    }
  });
  return;
};
export const getAddressFromLocation = (location) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await axios.get(
        FIND_LOCATION_URL + `${location[0]},${location[1]}`,
        {
          params: {
            key: BING_MAP_KEY,
            maxResults: 10,
          },
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );
      const foundAddress = result?.data?.resourceSets[0]?.resources[0]?.address;
      resolve(foundAddress);
    } catch (error) {
      reject(error);
    }
  });
};

export const suggestAddressByQuery = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await axios.get(
        AUTO_SUGGEST_URL,
        {
          params: {
            key: BING_MAP_KEY,
            query: query,
            userLocation: [48.604311, -122.981998, 5000],
            maxResults: 10,
          },
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );

      const foundPlaces = result?.data?.resourceSets[0]?.resources[0]?.value;
      resolve(foundPlaces);
    } catch (error) {
      reject(error);
    }
  });
  return;
};

export const getBrowserDetails = () => {
  const nAgt = navigator.userAgent;
  let browserName = navigator.appName;
  const userAgent = navigator.userAgent;
  let fullVersion = "" + parseFloat(navigator.appVersion);
  let majorVersion = parseInt(navigator.appVersion, 10);
  let nameOffset, verOffset, ix;

  // In Opera, the true version is after "Opera" or after "Version"
  if ((verOffset = nAgt.indexOf("Opera")) != -1) {
    browserName = "Opera";
    fullVersion = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf("Version")) != -1)
      fullVersion = nAgt.substring(verOffset + 8);
  }
  // In MSIE, the true version is after "MSIE" in userAgent
  else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
    browserName = "Microsoft Internet Explorer";
    fullVersion = nAgt.substring(verOffset + 5);
  }
  // In Chrome, the true version is after "Chrome"
  else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
    browserName = "Chrome";
    fullVersion = nAgt.substring(verOffset + 7);
  }
  // In Safari, the true version is after "Safari" or after "Version"
  else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
    browserName = "Safari";
    fullVersion = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf("Version")) != -1)
      fullVersion = nAgt.substring(verOffset + 8);
  }
  // In Firefox, the true version is after "Firefox"
  else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
    browserName = "Firefox";
    fullVersion = nAgt.substring(verOffset + 8);
  }
  // In most other browsers, "name/version" is at the end of userAgent
  else if (
    (nameOffset = nAgt.lastIndexOf(" ") + 1) <
    (verOffset = nAgt.lastIndexOf("/"))
  ) {
    browserName = nAgt.substring(nameOffset, verOffset);
    fullVersion = nAgt.substring(verOffset + 1);
    if (browserName.toLowerCase() == browserName.toUpperCase()) {
      browserName = navigator.appName;
    }
  }
  // trim the fullVersion string at semicolon/space if present
  if ((ix = fullVersion.indexOf(";")) != -1)
    fullVersion = fullVersion.substring(0, ix);
  if ((ix = fullVersion.indexOf(" ")) != -1)
    fullVersion = fullVersion.substring(0, ix);

  majorVersion = parseInt("" + fullVersion, 10);
  if (isNaN(majorVersion)) {
    fullVersion = "" + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
  }

  var OSName = "Unknown OS";
  if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
  if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
  if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
  if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";

  return {
    OSName,
    browserName,
    fullVersion,
    userAgent,
  };
};
