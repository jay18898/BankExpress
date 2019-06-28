//Using Async / Await

//mssql for database
const sql = require('mssql')

//config file for db connection
const config = require('./config')
var crud={};
var pool;

//Connect MSSQL
crud.connectDB = async()=>{
    try{
        pool =  await sql.connect(config)
    }
    catch(err)
    {
        console.log(err)
    }
     
}


// var pool =   sql.connect(config)
 crud.insertBank =  async function (accno,name,address,phoneno,acctype) {
     try {
        // let pool =  await sql.connect(config)
        let result1 =  await pool.request().query(`INSERT INTO tblbank(accno,name,address,phoneno,acctype) VALUES ('${accno}','${name}','${address}','${phoneno}','${acctype}')`)
        
        return result1.rowsAffected;
    
    } catch (err) {
        console.log(err)
    }
}

crud.insertActiveAccount = async(accno)=>{
    try {
        // let pool =  await sql.connect(config)
        let result1 =  await pool.request().query(`INSERT INTO tblactiveac(accno,active) VALUES ('${accno}','1')`)
        
        return result1.rowsAffected;
        // console.dir(result1)
        // sql.close()
    
    } catch (err) {
        console.log(err)
    }
}

crud.insertPassBook = async(accno,date,time,balance,description) =>{
    try {
        // let pool =  await sql.connect(config)
        let result1 =  await pool.request().query(`INSERT INTO tblPassBook(accno,date,time,balance,description) VALUES ('${accno}','${date}','${time}','${balance}','${description+' Rs.'}')`)
        return result1.rowsAffected;  
        // sql.close()
    
    } catch (err) {
        console.log(err)
    }
}

//Select bank balance only
crud.selectBankBalance = async (accno)=>{
    try{
        // let pool =  await sql.connect(config)
        let result1 =  await pool.request().query(`select TOP 1 tblPassBook.balance from tblPassBook,tblactiveac where tblPassBook.accno=${accno} and tblactiveac.active=1 and tblactiveac.accno=tblPassBook.accno ORDER BY tblPassBook.pbno DESC`)
        // sql.close()
        return   result1.recordset.map((value,key)=>value.balance)  
    }
    catch(err)
    {
        console.log(err)
    }
}
crud.selectAccNo = async ()=>{
    try {
        // let pool =  await sql.connect(config)
        let result1 =  await pool.request().query(`SELECT TOP 1 accno FROM tblbank ORDER BY tblbank.accno DESC `)
        // sql.close()
        // console.log('result:'+result1.recordset.map((value,key)=>value.accno))
        return   result1.recordset.map((value,key)=>value.accno) 
    } catch (err) {
        console.log(err)
    }
}
//select All details of bank Account 
crud.selectBank = async (accno)=>{
    try{
        // let pool =  await sql.connect(config)
        let result1 =  await pool.request().query(`select TOP 1 tblbank.*,tblPassBook.balance from tblbank,tblactiveac,tblPassBook  where tblbank.accno=${accno} and tblactiveac.active=1 and tblPassBook.accno=tblbank.accno and tblPassBook.accno=tblactiveac.accno order by tblPassBook.pbno DESC`)
        // sql.close()
        return result1.recordset;
        // console.dir(result1)
    }
    catch(err)
    {
        console.log(err)
    }
}

crud.selectPassBook = async(accno)=>{
    try {
        // let pool =  await sql.connect(config)
        let result1 =  await pool.request().query(`select * from tblPassBook  where tblPassBook.accno=${accno}`)
            // sql.close()
            return result1.recordset;
    } catch (err) {
        console.log(err)
    }
}

// update bank balance for deposite and withdrawal 
crud.updateBank =  async  (amount,accno) =>{
    try {
        // let pool =  await sql.connect(config)
        let result1 =  await pool.request().query(`UPDATE tblPassBook SET balance = '${amount}' WHERE accno = ${accno}`)
        // sql.close()
    } catch (err) {
        console.log(err)
    }
}

//Delete perticular Account 
crud.deleteBank =  async (accno) =>{
 
    try {
        // let pool =  await sql.connect(config)
        let result1 =  await pool.request().query(`DELETE FROM tblbank  WHERE accno=${accno};`)
        // sql.close()
    
    } catch (err) {
        console.log(err)
    }
}

crud.closeAccount = async(accno)=>{
    //UPDATE tblactiveac SET active = '0' WHERE accno = ${accno}
    try {
        // let pool =  await sql.connect(config)
        let result1 =  await pool.request().query(`UPDATE tblactiveac SET active = '0' WHERE accno = ${accno}`)
        // sql.close()
    
    } catch (err) {
        console.log(err)
    }
}

sql.on('error', err => {
    console.log(err)
})

crud.connectDB()

module.exports = crud;