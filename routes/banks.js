var express = require('express');
var router = express.Router();

var bank = require("../controllers/BankController");

// Get Home page
router.get('/',bank.home);

// Get info of single account no
router.get('/account_info', bank.account_info);


// Get info of single account no
router.post('/show_account_info', bank.show_account_info);

// Add Account[Create Account Page]
router.get('/add_account', bank.add_account);

// Save Account
router.post('/save_account', bank.save_account);

// Deposit Amount
router.get('/deposit', bank.deposit);

// Withdrawal Amount
router.get('/withdrawal', bank.withdrawal);

// Close Account
router.get('/close_account', bank.close_account);


// insert passbook
router.post('/insert_passbook', bank.insert_passbook);


// Print Passbook by account no
router.post('/show_print_passbook', bank.show_print_passbook);


router.get('/print_passbook', bank.print_passbook);
// delete
router.post('/delete/:id', bank.delete);

module.exports = router;



