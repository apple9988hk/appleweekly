import React from 'react'
import ActiveISummary from "./ActiveISummary"
// import ISumOperator from "./ISumOperator"
import ActiveMaster from './ActiveMaster'
import ExpCondition from './ExpCondition'

function Dashboard() {
  return (
    <>
        <div>Dashboard</div>
        <div className="divider" />
        <ActiveMaster />
        <div className="divider" />
        <ActiveISummary />
        <div className="divider" />
        <ExpCondition />
        {/* <ISumOperator /> */}
    </>

  )
}

export default Dashboard