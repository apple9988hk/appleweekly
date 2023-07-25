import React from 'react'
import ActiveISummary from "./ActiveISummary"
import ISumOperator from "./ISumOperator"

function Dashboard() {
  return (
    <>
        <div>Dashboard</div>
        <div className="divider" />
        <ActiveISummary />
        <div className="divider" />
        <ISumOperator />
    </>

  )
}

export default Dashboard