var crud =  require("./models/Bank");

var dbApi = {};

dbApi.CreateAccount = async (accno, userName, userAdd, userPhoneNo, userBankAccType) =>
  await crud.insertBank(accno, userName, userAdd, userPhoneNo, userBankAccType)
  
dbApi.InsertPassBook = async(accno,date,time,balance,description) => await crud.insertPassBook(accno,date,time,balance,description)

dbApi.InsertActiveAccount = async(accno)=> await crud.insertActiveAccount(accno)

dbApi.BalanceInquiry = async (acno) => await crud.selectBank(acno)

dbApi.BankBalance = async (acno) => await crud.selectBankBalance(acno)

dbApi.SelectAccountNo = async () => await crud.selectAccNo()

dbApi.SelectPassBook = async(accno)=> await  crud.selectPassBook(accno)

dbApi.UpdateAccount = async (amount, accno) => await crud.updateBank(amount, accno)

dbApi.DeleteAccount = async (accno) => crud.deleteBank(accno)

dbApi.CloseAccount = async(accno)=> crud.closeAccount(accno) 

module.exports = dbApi;