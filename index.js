const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bankServer = [];

// ... (existing functions)
function getAccount(accountNumber) {
    return bankServer.find((acc) => acc.accountNumber === accountNumber);
}

function validateAddAccount(accountName, accountNumber, balance) {
    let message;
    if (getAccount(accountNumber)) {
        message = "Account creation failed. Account number already exists.";
    } else if (balance < 500) {
        message = "Account creation failed. Initial balance should be at least 500.";
    } else if (!/^[a-zA-Z\s]+$/.test(accountName)) {
        message = "Account name should only contain letters and spaces.";
    } else if (accountName.length < 3 || accountName.length > 50) {
        message = "Account name should be between 3 and 50 characters.";
    } else if (accountNumber === 0 || !/^[0-9]+$/.test(accountNumber)) {
        message = "Invalid account number. Please enter a valid decimal number.";
    }

    return message;
}

function validateSendMoney(senderNumber, receiverNumber, amount) {
    const senderAccount = getAccount(senderNumber);
    let message;

    if (senderNumber === receiverNumber) {
        message = "Sender and receiver account numbers cannot be the same.";
    } else if (!senderAccount) {
        message = `No account found with Account Number: ${senderNumber}`;
    } else if (!getAccount(receiverNumber)) {
        message = `No account found with Account Number: ${receiverNumber}`;
    } else if (amount <= 0) {
        message = "Invalid amount. Please enter a positive value for the money transfer.";
    } else if (senderAccount.balance < parseInt(amount)) {
        message = "Transaction failed. Insufficient funds in the account.";
    }

    return message;
}

app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bank Server</title>
    </head>
    <body>
    
        <!-- Your HTML code... -->
        <h1>Bank Server</h1>
    
        <!-- Add Account Form -->
        <h2>Add Account</h2>
        <form id="addAccountForm" action="/api/addAccount" method="POST">
            <label for="accountName">Account Name:</label>
            <input type="text" id="accountName" name="accountName" required><br><br>
    
            <label for="accountNumber">Account Number:</label>
            <input type="text" id="accountNumber" name="accountNumber" required><br><br>
    
            <label for="balance">Balance:</label>
            <input type="number" id="balance" name="balance" required><br><br>
    
            <button type="submit">Add Account</button>
        </form>
    
        <!-- Delete Account Form -->
        <h2>Delete Account</h2>
        <form id="deleteAccountForm" action="/api/deleteAccount" method="POST">
            <label for="deleteAccountNumber">Account Number:</label>
            <input type="text" id="deleteAccountNumber" name="accountNumber" required><br><br>
    
            <button type="submit">Delete Account</button>
        </form>
    
        <!-- View Account Form -->
        <h2>View Account</h2>
        <form id="viewAccountForm" action="/api/viewAccount" method="POST">
            <label for="viewAccountNumber">Account Number:</label>
            <input type="text" id="viewAccountNumber" name="accountNumber" required><br><br>
    
            <button type="submit">View Account</button>
        </form>
    
        <!-- Send Money Form -->
        <h2>Send Money</h2>
        <form id="sendMoneyForm" action="/api/sendMoney" method="POST">
            <label for="senderNumber">Sender Account:</label>
            <input type="text" id="senderNumber" name="senderNumber" placeholder="Sender Account" required><br><br>
    
            <label for="receiverNumber">Receiver Account:</label>
            <input type="text" id="receiverNumber" name="receiverNumber" placeholder="Receiver Account" required><br><br>
    
            <label for="sendAmount">Amount:</label>
            <input type="number" id="sendAmount" name="amount" required><br><br>
    
            <button type="submit">Send Money</button>
        </form>
    
        <!-- View All Accounts Button -->
        <h2>View All Accounts</h2>
        <form id="viewAllAccountsForm" action="/api/viewAllAccounts" method="GET">
            <button type="submit">View All Accounts</button>
        </form>
    
        <!-- Display Messages and Account Details -->
        <div id="message"></div>
        <div id="accountDetails"></div>
        <script>
            // Your JavaScript code...
            document.getElementById("addAccountForm").addEventListener("submit", function (event) {
                event.preventDefault();
                addAccount();
            });
    
            document.getElementById("deleteAccountForm").addEventListener("submit", function (event) {
                event.preventDefault();
                deleteAccount();
            });
    
            document.getElementById("viewAccountForm").addEventListener("submit", function (event) {
                event.preventDefault();
                viewAccount();
            });
    
            document.getElementById("sendMoneyForm").addEventListener("submit", function (event) {
                event.preventDefault();
                sendMoney();
            });
    
            document.getElementById("viewAllAccountsForm").addEventListener("submit", function (event) {
                event.preventDefault();
                viewAllAccounts();
            });
    
            function addAccount() {
                const accountName = document.getElementById("accountName").value;
                const accountNumber = document.getElementById("accountNumber").value;
                const balance = document.getElementById("balance").value;
    
                fetch("/api/addAccount", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        accountName,
                        accountNumber,
                        balance,
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    document.getElementById("message").innerText = data.message;
                })
                .catch(error => {
                    console.error("Error:", error);
                });
            }
    
            function deleteAccount() {
                const deleteAccountNumber = document.getElementById("deleteAccountNumber").value;
    
                fetch("/api/deleteAccount", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        accountNumber: deleteAccountNumber,
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    document.getElementById("message").innerText = data.message;
                })
                .catch(error => {
                    console.error("Error:", error);
                });
            }
    
            function viewAccount() {
                const viewAccountNumber = document.getElementById("viewAccountNumber").value;
    
                fetch("/api/viewAccount", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        accountNumber: viewAccountNumber,
                    }),
                })
                .then(response => response.json())
                
                }).then(data => {
                    if (data.success) {
                        document.getElementById("accountDetails").innerText = Accountdetails;
                    } else {
                        document.getElementById("message").innerText = data.message;
                    }
                .catch(error => {
                    console.error("Error:", error);
                });
            }
    
            function sendMoney() {
                const senderNumber = document.getElementById("senderNumber").value;
                const receiverNumber = document.getElementById("receiverNumber").value;
                const sendAmount = document.getElementById("sendAmount").value;
    
                fetch("/api/sendMoney", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        senderNumber,
                        receiverNumber,
                        amount: sendAmount,
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    document.getElementById("message").innerText = data.message;
                })
                .catch(error => {
                    console.error("Error:", error);
                });
            }
    
            function viewAllAccounts() {
                fetch("/api/viewAllAccounts", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById("accountDetails").innerText = All accounts;
                    } else {
                        document.getElementById("message").innerText = "Error fetching accounts.";
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    document.getElementById("message").innerText = "An error occurred. Please try again.";
                });
                
            }
        </script>
    </body>
    </html>    
    `);
});

// ... (existing routes)
app.post("/api/addAccount", (req, res) => {
    const accountName = req.body.accountName;
    const accountNumber = parseInt(req.body.accountNumber);
    const balance = parseInt(req.body.balance);

    const validationResult = validateAddAccount(accountName, accountNumber, balance);

    if (!validationResult) {
        const newAccount = {
            accountName,
            accountNumber,
            balance,
        };
        bankServer.push(newAccount);
        res.send({ success: true, message: "Account created successfully!" });
    } else {
        res.send({ success: false, message: validationResult });
    }
});

app.post("/api/deleteAccount", (req, res) => {
    const deleteAccountNumber = parseInt(req.body.accountNumber);
    const accountIndex = bankServer.findIndex((acc) => acc.accountNumber === deleteAccountNumber);

    if (accountIndex !== -1) {
        bankServer.splice(accountIndex, 1);
        res.send({ success: true, message: "Account deleted successfully!" });
    } else {
        res.send({ success: false, message: `No account found with Account Number: ${deleteAccountNumber}` });
    }
});

app.post("/api/viewAccount", (req, res) => {
    const viewAccountNumber = parseInt(req.body.accountNumber);
    const account = getAccount(viewAccountNumber);

    if (account) {
        res.send({ success: true, account });
    } else {
        res.send({ success: false, message: `No account found with Account Number: ${viewAccountNumber}` });
    }
});

app.post("/api/sendMoney", (req, res) => {
    const senderNumber = parseInt(req.body.senderNumber);
    const receiverNumber = parseInt(req.body.receiverNumber);
    const amount = parseFloat(req.body.amount); // Use parseFloat instead of parseInt for decimal values
    
    const validationResult = validateSendMoney(senderNumber, receiverNumber, amount);

    if (!validationResult) {
        const senderAccount = getAccount(senderNumber);
        const receiverAccount = getAccount(receiverNumber);

        senderAccount.balance -= amount;
        receiverAccount.balance += amount;

        res.send({ success: true, message: "Transaction successful. Money sent." });
    } else {
        res.send({ success: false, message: validationResult });
    }
});

app.get("/api/viewAllAccounts", (req, res) => {
    res.send({ success: true, data: bankServer });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
