var dbApi = require("../dbCallApi")

var bankController = {};

bankController.home = function(req, res) {
	res.render("../views/bank/home");
}

bankController.show_account_info = function(req, res) {
	
	dbApi.BalanceInquiry(req.body.accno).then((result) => {
		currentBalance = result
		if (currentBalance != '') {
		
		 res.render('../views/bank/account_info',{result:result,msg:''})
		}
		else
		{
			res.render('../views/bank/account_info',{result:'',msg:`Opps..!Account Not Found for Account No: ${req.body.accno}`})
		}

	}).catch(err => { console.log(err) })
}
bankController.account_info = function(req, res) {
	res.render("../views/bank/account_info",{result:'',msg:''});
  }

bankController.add_account = function(req, res) {
  res.render("../views/bank/add_account",{msg:''});
}

bankController.save_account = function(req, res) {
	
	dbApi.SelectAccountNo().then((result) => {
		var accno=0;
	 
		if(result.length>0)
		 {
			 accno = parseInt(result)+1 
		 }
		 else
		 {
			accno=100
		 } 

		 dbApi.CreateAccount(accno, req.body.name,req.body.address ,req.body.phoneno,req.body.account_type)
			.then((result) => {
				if(result>0)
				{
					dbApi.InsertActiveAccount(accno).then((result)=>{
						if(result>0)
						{
						  let  description = `DEPOSITE: ${req.body.dpamount}`
						   let date = convert(new Date())
						   let time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
							dbApi.InsertPassBook(accno,date,time,req.body.dpamount,description).then((result)=>{
								if(result>0)
								{
									let name = req.body.name;
									// let msg ='Successfully Account was created.'+`Thank You for be with us: ${req.body.name}.`+`Your Account No is : ${accno}`
									res.render('../views/bank/add_account',{msg:`Successfully Account was created. Thank You for be with us: ${name}. Your Account No is : ${accno}`});
									   }
								else{
									res.send(`Something wrong`)
								}
							   
							}).catch(err => res.send(err))   
						}
						else{
								res.send(`something wrong.!`)
						}
										 
					}).catch(err => console.log(err))
				}
				else{
						res.send(`something went wrong.!`)
				}
			   
			})
			.catch(err => res.send(err)) 
	
	 }).catch(err =>res.send(err))
}

bankController.deposit = function(req, res) {
	res.render("../views/bank/deposit",{msg:''});
}


bankController.withdrawal = function(req, res) {
	res.render("../views/bank/withdrawal",{msg:''});
}

bankController.print_passbook = function(req, res) {
	res.render("../views/bank/print_passbook",{result:''});
}

bankController.insert_passbook = function(req, res) {
	if(req.body.form==='dpform')
	{
		
		dbApi.BankBalance(req.body.accno).then((result) => {
			currentBalance = result
			if (currentBalance != '') {
				if (!isNaN(req.body.dpamount)) {
					var Amount = parseFloat(result) + parseFloat(req.body.dpamount)
					
						description=`DEPOSITE: ${req.body.dpamount}`
						date = convert(new Date())
						time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
					
						dbApi.InsertPassBook(req.body.accno,date,time,Amount,description)
						.then(()=>{
							res.render('../views/bank/deposit',{msg:`Successfully Deposited: ${req.body.dpamount} in Account No: ${req.body.accno}`});
							
							})
						.catch(err => console.log(err))
				
				}
				else {
					res.render('../views/bank/deposit',{msg:`Not Input Valid..!`});
				}
			}
			else{
				res.render('../views/bank/withdrawal',{msg:`Opps..!Account Not Found for Account No: ${req.body.accno}`})
			}

			})
		.catch(err => {
		console.log(err)
		})
	}
	else if(req.body.form==='wdform')
	{
		dbApi.BankBalance(req.body.accno).then((result) => {
			currentBalance = result
			if (currentBalance != '') {
				
					if (!isNaN(req.body.wdamount)) {
						if (parseFloat(req.body.wdamount) > parseFloat(currentBalance)) {
							res.render('../views/bank/withdrawal',{msg:'You have not enough balance:please try again'})
							
						}
						else {
							var Amount = parseFloat(currentBalance) - parseFloat(req.body.wdamount);
							description=`WITHDRAWAL: ${req.body.wdamount}`
							date = convert(new Date())
							time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
						
							dbApi.InsertPassBook(req.body.accno,date,time,Amount,description)
							.then(()=>{
								res.render('../views/bank/deposit',{msg:`Successfully Withdrawal: ${req.body.wdamount} in Account No: ${req.body.accno} `});
								})
							.catch(err => console.log(err))
						}
					}
					else {
						res.render('../views/bank/withdrawal',{msg:'please enter valid input'})						
					}
			}
			else {
				res.render('../views/bank/withdrawal',{msg:`Opps..!Account Not Found for Account No: ${req.body.accno}`})
				
			}

		}).catch(err => console.log(err))
	}
	else if(req.body.form==='caform')
	{
		dbApi.BankBalance(req.body.accno).then((result) => {
			currentBalance = result
			if (currentBalance != '') {

							var Amount = parseFloat(currentBalance)
							description=`Account Closed.`
							date = convert(new Date())
							time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
						
							dbApi.CloseAccount(req.body.accno).then(() => {
								dbApi.InsertPassBook(req.body.accno,date,time,Amount,description)
								.then(()=>{
									res.render('../views/bank/close_account',{msg:`Account No: ${req.body.accno} is Successfully Closed `});
									})
								.catch(err => console.log(err))
							}).catch( ()=>{
								res.render("../views/bank/close_account",{msg:`Opps..!Account Not Found for Account No: ${req.body.accno}`});
								
							})



							
			}
			else {
				res.render('../views/bank/close_account',{msg:`Opps..!Account Not Found for Account No: ${req.body.accno}`})
				
			}

		}).catch(err => console.log(err))
	}
	else
	{
		res.render('../views/bank/withdrawal',{msg:`Something went wrong..!`});
	}
	
}


bankController.show_print_passbook = function(req, res) {
	
		dbApi.SelectPassBook(req.body.accno).then((result) => {
			
			if (result != '') {
				
				res.render('../views/bank/print_passbook',{result:result})
			}
			else {
				res.render('../views/bank/print_passbook',{result:`Opps..!Account Not Found for Account No:${req.body.accno}`})
				
			}

		}).catch(err => { console.log(err) })

	
}

bankController.close_account = function(req, res) {
	res.render("../views/bank/close_account",{msg:''});
}

bankController.closing_account = function(req, res) {
	dbApi.BalanceInquiry(req.body.accno)
	.then((result) => {
		if (result != '') {
			dbApi.CloseAccount(req.body.accno).then(() => {
				res.render("../views/bank/close_account",{msg:`Account ${req.body.accno} Successfully Closed.!`});
			}).catch( ()=>{
				res.render("../views/bank/close_account",{msg:`Opps..!Account Not Found for Account No: ${req.body.accno}`});
				
			})
		
		}
		else {
			res.render("../views/bank/close_account",{msg:`please enter valid input`});
						
		}
	})
	.catch(err => console.log(err))
}
bankController.delete = function(req, res) {
	Product.remove({_id: req.params.id}, function(err) {
		if(err)
		{
			console.log("Error:", err);
		}
		else{
			console.log("Product deleted!");
			res.redirect("/products/");
		}
	});
};

function convert(str) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth()+1)).slice(-2),
        day  = ("0" + date.getDate()).slice(-2);
    return [ date.getFullYear(), mnth, day ].join("-");
  }
module.exports = bankController;






























