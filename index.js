const axios = require("axios");
const xml2js = require("xml2js");

async function fetchVoucherData() {
  const tallyURL = "http://localhost:9002";
  const ledgerNames = [
    "Salary A/c",
    "Furniture",
    "Cab Repairing",
    "Msco Tech Limited",
  ];

  try {
    for (const ledgerName of ledgerNames) {
      const xmlRequest = `
        <ENVELOPE>
          <HEADER>
            <TALLYREQUEST>Export Data</TALLYREQUEST>
          </HEADER>
          <BODY>
            <EXPORTDATA>
              <REQUESTDESC>
                <REPORTNAME>Ledger Vouchers</REPORTNAME>
                <STATICVARIABLES>
                  <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                  <LEDGERNAME>Salary A/c</LEDGERNAME>
                  <LEDGERNAME>Furniture</LEDGERNAME>
                  <LEDGERNAME>Msco Tech Limited</LEDGERNAME>
                  
                </STATICVARIABLES>
              </REQUESTDESC>
            </EXPORTDATA>
          </BODY>
        </ENVELOPE>`;

      const response = await axios.post(tallyURL, xmlRequest, {
        headers: {
          "Content-Type": "application/xml",
        },
      });

      const result = await xml2js.parseStringPromise(response.data);
      console.log(
        `Voucher Data for ${ledgerName}:`,
        JSON.stringify(result, null, 2)
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchVoucherData();
