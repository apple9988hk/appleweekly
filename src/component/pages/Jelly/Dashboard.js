import React from 'react'
import ActiveISummary from "./ActiveISummary"
import ISumOperator from "./ISumOperator"
import ActiveMaster from './ActiveMaster'

function Dashboard() {
  return (
    <>
        <div>Dashboard</div>
        <div className="divider" />
        <ActiveMaster />
        <div className="divider" />
        <ActiveISummary />
        <div className="divider" />
        <ISumOperator />
    </>

  )
}

export default Dashboard