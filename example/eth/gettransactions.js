//
// Sends an Ethereum transaction on BitGo
//
var BitGoJS = require('../../src/index.js');
var BN = require("ethereumjs-util").BN;

if (process.argv.length < 5) {
  console.log("usage:\n\t" + process.argv[0] + " " + process.argv[1] + " <user> <password> <walletId>");
  process.exit(-1);
}

var user = process.argv[2];
var password = process.argv[3];
var otp = '0000000';
var walletId = process.argv[4];
var _ = require('lodash');

var bitgo = new BitGoJS.BitGo();

var getTransactions = function() {
  console.log("Getting wallet..");

  // Now get the wallet
  bitgo.eth().wallets().get({id: walletId}, function(err, wallet) {
    if (err) { console.log("Error getting wallet!"); console.dir(err); return process.exit(-1); }
    // console.dir(wallet.wallet);
    console.log("Balance is: " + wallet.balance());
    console.log("Balance in ETH: " + bitgo.eth().weiToEtherString(wallet.balance()));

    wallet.transactions({}, function(err, res) {
      // console.dir(res);
      var interestingFields = ['txHash', 'parentTxHash', 'from', 'to', 'value', 'blockHash', 'confirmations', 'type', 'receiveTime'];
      var prettyTxs = _.map(res.transactions, function(t) { return _.pick(t, interestingFields); });
      console.log("Count: " + res.count);
      console.log("Start: " + res.start);
      console.log("Limit: " + res.limit);
      console.log("Transactions: ");
      
      console.dir(prettyTxs);
    });
  });
};

// Authenticate first
bitgo.authenticate({ username: user, password: password, otp: otp }, function(err, result) {
  if (err) { console.dir(err); throw new Error("Could not authenticate!"); }
  console.log("Authenticated.. ");
  getTransactions();
});
