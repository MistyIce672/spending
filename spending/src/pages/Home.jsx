import { productsService } from "../services/product.services";
import { useEffect, useState } from "react";
import styles from "../style";
import { dollar, edit, hamburger, negative_recurring, positive_recurring, trash, user } from "../assets";
import { authService } from "../services/auth.services";
import  { useNavigate  }  from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();
  const token = authService.getUser()
  console.log(token,"getUser")
  if(token === null){
    navigate("/login");
  }
  
  const [status,setStat] = useState("loading")
  const [data,setData] = useState({})
  function refetch(){
    console.log("refetech")
      productsService.getFinance(token).then(function(response){
          setData(response)
          console.log(response.status)
          if (response.status === true){
            console.log("set")
            setStat('success')
          }else if (response.error === "invalid token"){
            navigate("/login");
          }
          
      })

  }
  useEffect(() =>{
    refetch();
  }, [])
  
  
  const submitExpense = () => {
    switchExpense()
    const expense_name = document.getElementById("name").value
    const expense_amount = document.getElementById("amount").value
    const expense_occurrence = document.getElementById("occurrence").value
    let term = "current"
    if (expense_occurrence === "recurring"){
      term = null
    }
    productsService.postExpense(expense_name,expense_amount,expense_occurrence,term).then(function(){
      refetch()
    })
  }
  const submitIncome = () => {
    switchIncome()
    const income_name = document.getElementById("IncomeName").value
    const income_amount = document.getElementById("IncomeAmount").value
    const income_occurrence = document.getElementById("IncomeOccurrence").value
    let term = "current"
    if (income_occurrence === "recurring"){
      term = null
    }
    productsService.postIncome(income_name,income_amount,income_occurrence,term).then(function(){
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
  const remove = (index) => {
    productsService.remove(index).then(function(){
      refetch()
    })
    
    
  }


  return (
    <div className="absolute w-full h-full bg-primary flex justify-around">
      {status === "loading" && (
        <div className="m-auto">
          <div className="border-4 border-positive p-6 rounded-[50%] animate-coin">
            <img src={dollar} alt="dollar" className="w-[120px]" />
          </div>
          <p className="text-white ubuntu text-[24px] text-center">Loading...</p>
        </div>
      )} 
      {status === "success" && (
        <div className="w-[412px]">
          <div className="flex justify-between">
            <button>
              <img src={hamburger} alt="menu" className="w-[50px]" />
              </button>
            <a href="/#/account">
              <img src={user} alt="account" className="w-[50px]"/>
            </a>
          </div>
          <div>
            <div className="flex justify-between p-8">
              <div>
                <h1 className={`text-positive ${styles.headText}`}>Income:</h1>
                <h1 className={`text-positive ${styles.headText}`}>{data.total_income}</h1></div>
              <div>
                <h1 className={`text-negative ${styles.headText}`}>Expenses:</h1>
                <h1 className={`text-negative ${styles.headText}`}>{data.total_expenses}</h1></div>
            </div>
            <div>
              {data.income.sort((a, b) => a.amount < b.amount ? 1 : -1).map((item,index) => (
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
              {data.expenses.sort((a, b) => a.amount < b.amount ? 1 : -1).map((item,index) => (
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




    
          </div>
          <div className="mb-[10rem]">
            <div>
              <div className={`flex justify-between ${data.total > 0 ? 'text-positive':'text-negative'}`}>
                <h1 className={`${styles.headText} `}>Balance</h1>
                <h1 className={` ${styles.headText} `}>{data.total}</h1>
              </div>
            </div>
            <div className="flex justify-between">
              <button className="w-[40%] bg-positive text-white ubuntu rounded-[8px] h-[48px] sans" onClick={switchIncome}>Add Income</button>
              <button className="w-[40%] bg-negative text-white ubuntu rounded-[8px] h-[48px] sans" onClick={switchExpense}>Add Expense</button>
            </div>
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
          <div className="flex justify-between mt-4 items-center">
            <p className="text-white ubuntu text-[16px]">occurrence</p>
            <select name="occurrence" id="occurrence" className="bg-negative p-2 rounded-[8px] text-white">
              <option value="one_time">one time</option>
              <option value="recurring">recurring</option>
            </select>
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
            <div className="flex justify-between mt-4 items-center">
              <p className="text-white ubuntu text-[16px]">occurrence</p>
              <select name="occurrence" id="IncomeOccurrence" className="bg-positive p-2 rounded-[8px] text-white">
                <option value="one_time">one time</option>
                <option value="recurring">recurring</option>
              </select>
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

export default Home