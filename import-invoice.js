var request = require("request");
var convert = require("xml-js");

function createLedger(json) {
  var conversion = { compact: true, ignoreComment: true, spaces: 4 };
  xml = convert.json2xml(json, conversion);
  var options = {
    method: "POST",
    url: "http://localhost:9002",
    headers: {
      "cache-control": "no-cache",
      "Content-Type": "text/xml",
    },
    body: xml,
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
  });
}

// Function to create ledger in Tally
function createTallyLedger() {
  var jsonData = {
    ENVELOPE: {
      HEADER: {
        TALLYREQUEST: { _text: "Import Data" },
      },
      BODY: {
        IMPORTDATA: {
          REQUESTDESC: {
            REPORTNAME: { _text: "All Masters" },
          },
          REQUESTDATA: {
            TALLYMESSAGE: {
              _attributes: { xmlns: "TallyUDF" },
              LEDGER: {
                _attributes: { NAME: "Bag", ACTION: "Create" },
                NAME: { _text: "Bag" },
                PARENT: { _text: "Fixed Assets" },
                ADDRESS: { _text: "Renuka Complex,xyz Road" },
                GSTIN: { _text: "" },
                ISBILLWISEON: { _text: "No" },
                ISGSTINCL: { _text: "No" },
                ISGDPREGISTRATIONNUMBER: { _text: "No" },
                ISTCSAPPLICABLE: { _text: "No" },
              },
            },
          },
        },
      },
    },
  };

  createLedger(jsonData);
}

// Call the function to create ledger in Tally
createTallyLedger();
