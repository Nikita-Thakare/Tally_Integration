const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();

const TALLY_URL = "http://localhost:9002";

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("form");
});

app.post("/submit", async (req, res) => {
  const { ledgerName, amount, narration } = req.body;

  const ledgerXML = `
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
                        <LEDGER NAME="${ledgerName}" RESERVEDNAME="">
                            <NAME.LIST>
                                <NAME>${ledgerName}</NAME>
                            </NAME.LIST>
                            <PARENT>Sundry Debtors</PARENT>
                            <ISBILLWISEON>Yes</ISBILLWISEON>
                        </LEDGER>
                    </TALLYMESSAGE>
                </REQUESTDATA>
            </IMPORTDATA>
        </BODY>
    </ENVELOPE>`;

  const voucherXML = `
  <ENVELOPE>
    <HEADER>
        <TALLYREQUEST>Import Data</TALLYREQUEST>
    </HEADER>
    <BODY>
        <IMPORTDATA>
            <REQUESTDESC>
                <REPORTNAME>Vouchers</REPORTNAME>
            </REQUESTDESC>
            <REQUESTDATA>
                <TALLYMESSAGE xmlns:UDF="TallyUDF">
                    <VOUCHER VCHTYPE="Payment" ACTION="Create">
                        <DATE>20240601</DATE>
                        <VOUCHERTYPENAME>Payment</VOUCHERTYPENAME>
                        <VOUCHERNUMBER>PV006</VOUCHERNUMBER>
                        <PARTYLEDGERNAME>Bank Accounts</PARTYLEDGERNAME>
                        <NARRATION>${narration}</NARRATION>
                        <ALLLEDGERENTRIES.LIST>
                            <LEDGERNAME>${ledgerName}</LEDGERNAME>
                            <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
                            <AMOUNT>-${amount}</AMOUNT>
                        </ALLLEDGERENTRIES.LIST>
                        <ALLLEDGERENTRIES.LIST>
                            <LEDGERNAME>${ledgerName}</LEDGERNAME>
                            <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
                            <AMOUNT>${amount}</AMOUNT>
                        </ALLLEDGERENTRIES.LIST>
                    </VOUCHER>
                </TALLYMESSAGE>
            </REQUESTDATA>
        </IMPORTDATA>
    </BODY>
  </ENVELOPE>`;

  try {
    // Send Ledger XML to Tally
    const ledgerResponse = await axios.post(TALLY_URL, ledgerXML, {
      headers: { "Content-Type": "text/xml" },
    });
    console.log(ledgerResponse.data);

    // Send Voucher XML to Tally
    const voucherResponse = await axios.post(TALLY_URL, voucherXML, {
      headers: { "Content-Type": "text/xml" },
    });
    console.log(voucherResponse.data);

    res.redirect("/");
  } catch (error) {
    console.error("Error importing data to Tally:", error);
    res.status(500).send("Error importing data to Tally");
  }
});

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
