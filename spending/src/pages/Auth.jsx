import React from 'react'
import { useSearchParams } from 'react-router-dom';
import { productsService } from '../services/product.services';

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const client_id = searchParams.get("client_id")
  const redirect_uri = searchParams.get("redirect_uri")
  const state = searchParams.get("state")
  console.log(redirect_uri)
  const authorise = () => {
    productsService.getCode().then(function (response){
      const url = redirect_uri+`?code=${response.code}&state=${encodeURIComponent(state)}`
      window.location.href=url
      console.log(url)
    })

  }
  return (
    <div className="absolute w-full h-full bg-primary flex justify-around">
      <div className="w-[412px]">
        <div className="h-full flex flex-col justify-around">
          <div className='h-1/2 flex flex-col justify-between'>
          <h1 className='text-white'>Do you want authorise ifftt</h1>
          <button className='text-white bg-positive' onClick={authorise}>Authorise</button>
          <button className='text-white bg-negative'>Decline</button>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Auth
