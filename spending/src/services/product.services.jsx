import { API_URL } from "../api";
import { authService } from "./auth.services";

const date = new Date(); 
let year= date.getFullYear(); 
let month = date.getMonth() + 1
month = `${month}`
if(month.length === 1){
    month = `0${month}`
}
let current = `${year}-${month}`

const token = authService.getUser()

export class ProductsService {
    async getFinance(){
        const res = await fetch(`${API_URL}/finance/${current}`,{headers: {
          "Content-Type": "application/json",
          "Authorization": token
      }});
        return res.json();
      }
    async postExpense(name,amount,occurrence,term){
        if (term === "current"){
            term = current
        }
        let data = JSON.stringify({"name":name,'amount':amount,"term":term,'occurrence':occurrence})
        return await fetch(`${API_URL}/expense/add`,{
            method:"POST",
            body: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }).then(res => res.json());
    }
    async postIncome(name,amount,occurrence,term){
        if (term === "current"){
            term = current
        }
        let data = JSON.stringify({"name":name,'amount':amount,"term":term,'occurrence':occurrence})
        return await fetch(`${API_URL}/income/add`,{
            method:"POST",
            body: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }).then(res => res.json());
    }
    async remove(id){
        return await fetch(`${API_URL}/item/${id}`,{
            method:"DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }).then(res => res.json());

    }
    async account(){
        return await fetch(`${API_URL}/account`,{
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }).then(res => res.json());

    }
}

export const productsService = new ProductsService();