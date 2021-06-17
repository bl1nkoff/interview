import React from 'react'
import NewsList from '../../elements/newslist'
import MainLayout from '../../layouts/MainLayout'

const APIUrl = process.env.API_URL + 'newslist?'

export default function NewsListFuncHFull({newslist}){
  return( 
  <MainLayout>
    <NewsList newslist={newslist} nofirst={false}/>
  </MainLayout>  
  )
}

NewsListFuncHFull.getInitialProps = async ({ query, req }) => {
  if (!req) {
    return {newslist: null}
  }
  const response = await fetch(APIUrl + `region=${query.region}&heading=${query.heading}`)
  const answer = await response
  return {newslist: answer.status == 200 ? await answer.json(): null}
}