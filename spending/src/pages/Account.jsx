import { productsService } from "../services/product.services";
import { edit, home, negative_recurring, positive_recurring, trash } from "../assets";
import { useState } from "react";
import { authService } from "../services/auth.services";


const Account = () => {
    
    const user = authService.getUser()
    if(user === null){
        window.location.href = `https://${window.location.host}/#login`
    }
    const [status,setStat] = useState("false")
    const [data,setData] = useState([])
    function refetch(){
        productsService.account().then(function(data){
            setData(data)
            setStat('success')
        })

    }
    refetch()
    
        
    
    
    
    const remove = (index) => {
        productsService.remove(index).then(function(){
          refetch()
        })
        
        
    }
    const [expense,setExpense] = useState(false)
    const switchExpense = () => {
        if (expense){
        setExpense(false)
        }else{
        setExpense(true)
        }
    }
    const [income,setIncome] = useState(false)
    const switchIncome = () => {
        if (income){
        setIncome(false)
        }else{
        setIncome(true)
        }
    }
    const submitExpense = () => {
        switchExpense()
        const expense_name = document.getElementById("name").value
        const expense_amount = document.getElementById("amount").value
        const expense_occurrence = "recurring"
        let term = null
        productsService.postExpense(expense_name,expense_amount,expense_occurrence,term).then(function(){
          refetch()
        })
      }
      const submitIncome = () => {
        switchIncome()
        const income_name = document.getElementById("IncomeName").value
        const income_amount = document.getElementById("IncomeAmount").value
        const income_occurrence = "recurring"
        let term = null
        productsService.postIncome(income_name,income_amount,income_occurrence,term).then(function(){
          refetch()
        })
      }
      const logout = () =>{
        authService.logout()
        window.location.href = `https://${window.location.host}/#login`
      }
  return (
    <div className="absolute w-full h-full bg-primary flex justify-around">
        {status === "success" && (
            
            <div className="w-[400px]">
            <div>
                <a href="/">
                    <img src={home} alt="home" className="w-[50px]"/>
                </a>
                
            </div>
            <div className="p-6">
                <h1 className="text-white ubuntu text-center font-semibold text-[24px]">{data.email}</h1>
            </div>
            <div>
                <p className="text-[20px] text-white ubuntu">Recurring items:</p>
                {data.items.map((item,index) => (
                    <div key={index} className="flex justify-between group">
                    <div className="flex items-center">
                      <h1 className="text-[20px] text-white ubuntu">{item.name}:</h1>
                      {item.occurrence === 'recurring' && (
                        <img src={item.direction === 'income' ? positive_recurring:negative_recurring} alt="recurring" className="w-[22px] h-[22px] ml-2"/>
                      )}
                      <button className="ml-2 group-hover:block hidden" onClick={remove.bind(this,item._id)}><img src={trash} alt="delete" className="h-[22px]" /></button>
                      <button className="ml-2 group-hover:block hidden" onClick={remove.bind(this,item._id)}><img src={edit} alt="edit"  className="h-[22px]"/></button>
                    </div>
                    <h1 className={`mr-6 font-semibold text-[20px] font-semibold ubuntu ${item.direction === 'income' ? 'text-positive':'text-negative'}`}>{item.amount}</h1>
                  </div>
                ))}
            </div>
            <div className="flex justify-between">
              <button className="w-[40%] bg-positive text-white ubuntu rounded-[8px] h-[48px] sans" onClick={switchIncome}>Add Income</button>
              <button className="w-[40%] bg-negative text-white ubuntu rounded-[8px] h-[48px] sans" onClick={switchExpense}>Add Expense</button>
            </div>
            <div>
                <button onClick={logout} className="mt-6 w-[100%] bg-negative text-white ubuntu rounded-[8px] h-[48px] sans">Logout</button>
            </div>
        </div>
        )}
        <div className={`flex flex-col justify-between absolute top-0 bg-primary border border-negative rounded-[20px] w-[400px] h-[40%] top-[25%] p-6 ${expense === true? 'block':'hidden'}`}>
        <div>
          <div className="flex justify-end items-center">
            <button className="text-white bg-negative w-[22px] h-[22px] rounded-[50%]" onClick={switchExpense} >X</button>
          </div>
          <div className="flex justify-between mt-4 items-center">
            <p className="text-white ubuntu text-[16px]">Name</p>
            <input className="border-2 border-negative rounded-[8px] bg-primary focus:outline-none text-white pl-2 focus:border-white"  type="text" name="name" id="name"/>
          </div>
          <div className="flex justify-between mt-4 items-center">
            <p className="text-white ubuntu text-[16px]">Amount</p>
            <input className="border-2 border-negative rounded-[8px] bg-primary focus:outline-none text-white pl-2 focus:border-white"  type="text" name="amount" id="amount"/>
          </div>
          

        </div>
        <div>
          <div className="flex justify-around">
            <button className="w-[50%] bg-negative text-white h-[48px] ubuntu font-semibold rounded-[8px]" onClick={submitExpense}>ADD Expense</button>
          </div>
        </div>
      
      
        </div>
        <div className={`flex flex-col justify-between absolute top-0 bg-primary border border-positive rounded-[20px] w-[400px] h-[40%] top-[25%] p-6 ${income === true? 'block':'hidden'}`}>
            <div>
                <div className="flex justify-end items-center">
                <button className="text-white bg-positive w-[22px] h-[22px] rounded-[50%]" onClick={switchIncome} >X</button>
                </div>
                <div className="flex justify-between mt-4 items-center">
                <p className="text-white ubuntu text-[16px]">Name</p>
                <input className="border-2 border-positive rounded-[8px] bg-primary focus:outline-none text-white pl-2 focus:border-white"  type="text" name="name" id="IncomeName"/>
                </div>
                <div className="flex justify-between mt-4 items-center">
                <p className="text-white ubuntu text-[16px]">Amount</p>
                <input className="border-2 border-positive rounded-[8px] bg-primary focus:outline-none text-white pl-2 focus:border-white"  type="text" name="amount" id="IncomeAmount"/>
                </div>
                

            </div>
            <div>
                <div className="flex justify-around">
                <button className="w-[50%] bg-positive text-white h-[48px] ubuntu font-semibold rounded-[8px]" onClick={submitIncome}>ADD Income</button>
                </div>
            </div>
            
            
        </div>
        
    </div>
  )
}

export default Account