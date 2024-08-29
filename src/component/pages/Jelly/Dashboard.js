import React from 'react'
import ActiveISummary from "./ActiveISummary"
// import ISumOperator from "./ISumOperator"
import ActiveMaster from './ActiveMaster'
import ExpCondition from './ExpCondition'
import RecentJVL from "./RecentJVL"

function Dashboard() {
  return (
    <>
        <div>Dashboard</div>
        {/* {/* <div className="divider" /> */}
        <ActiveMaster />
        <div className="divider" />
        <ActiveISummary />
        <div className="divider" />
        <ExpCondition /> 
        <div className="divider" />
        <RecentJVL />
        {/* <ISumOperator /> */}
    </>

  )
}

export default Dashboard