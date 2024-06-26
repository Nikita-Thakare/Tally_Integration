const axios = require("axios");

async function createLedger() {
  const tallyURL = "http://localhost:9002"; // Tally ODBC URL or XML Port

  const xmlRequest = `
    <ENVELOPE>
      <HEADER>
        <TALLYREQUEST>Import Data</TALLYREQUEST>
      </HEADER>
      <BODY>
        <IMPORTDATA>
          <REQUESTDESC>
            <REPORTNAME>All Masters</REPORTNAME>
          </REQUESTDESC>
          <REQUESTDATA>
            <TALLYMESSAGE xmlns:UDF="TallyUDF">
              <LEDGER NAME="Bag" ACTION="Create">
                <NAME.LIST>
                  <NAME>Bag</NAME>
                </NAME.LIST>
                <PARENT>Fixed Assets</PARENT>
                <ADDRESS>Renuka Complex,xyz Road</ADDRESS>
                <GSTIN></GSTIN>
                <ISBILLWISEON>No</ISBILLWISEON>
                <ISGSTINCL>No</ISGSTINCL>
                <ISGDPREGISTRATIONNUMBER>No</ISGDPREGISTRATIONNUMBER>
                <ISTCSAPPLICABLE>No</ISTCSAPPLICABLE>
              </LEDGER>
            </TALLYMESSAGE>
          </REQUESTDATA>
        </IMPORTDATA>
      </BODY>
    </ENVELOPE>`;

  try {
    const response = await axios.post(tallyURL, xmlRequest, {
      headers: {
        "Content-Type": "application/xml",
      },
    });

    console.log("Create Ledger Response:", response.data);
  } catch (error) {
    console.error("Error creating ledger:", error);
  }
}

// Call the function to create the "Bag" ledger
createLedger();
