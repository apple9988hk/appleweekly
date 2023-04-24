import React, { useState, useEffect, useCallback, useMemo } from "react";
import DataTable from "react-data-table-component";

const ExpandedComponent = ({ data }) => (
    // <pre>{JSON.stringify(data, null, 2)}</pre>
    <div>
        {data.title} + {data.year}
    </div>

);

const columns = [
    {
        name: 'id',
        selector: row => row.id,
        sortable: false,
    },
    {
        name: 'Title',
        selector: row => row.title,
        sortable: true,
    },
    {
        name: 'Year',
        selector: row => row.year,
        sortable: true,
    },
];

const data = [
  {
    id: 1,
    title: "Beetlejuice",
    year: "1988",
  },
  {
    id: 2,
    title: "Ghostbusters",
    year: "1984",
  },
  {
    id: 1,
    title: "Beetlejuice",
    year: "1988",
  },
  {
    id: 2,
    title: "Ghostbusters",
    year: "1984",
  },
  {
    id: 1,
    title: "Beetlejuice",
    year: "1988",
  },
  {
    id: 2,
    title: "Ghostbusters",
    year: "1984",
  },
  {
    id: 1,
    title: "Beetlejuice",
    year: "1988",
  },
  {
    id: 2,
    title: "Ghostbusters",
    year: "1984",
  },
  {
    id: 1,
    title: "Beetlejuice",
    year: "1988",
  },
  {
    id: 2,
    title: "Ghostbusters",
    year: "1984",
  },
  {
    id: 1,
    title: "Beetlejuice",
    year: "1988",
  },
  {
    id: 2,
    title: "Ghostbusters",
    year: "1984",
  },
  {
    id: 1,
    title: "Beetlejuice",
    year: "1988",
  },
  {
    id: 2,
    title: "Ghostbusters",
    year: "1984",
  },
  {
    id: 1,
    title: "Beetlejuice",
    year: "1988",
  },
  {
    id: 2,
    title: "Ghostbusters",
    year: "1984",
  },
  {
    id: 1,
    title: "Beetlejuice",
    year: "1988",
  },
  {
    id: 2,
    title: "Ghostbusters",
    year: "1984",
  },
  {
    id: 1,
    title: "Beetlejuice",
    year: "1988",
  },
  {
    id: 2,
    title: "Ghostbusters",
    year: "1984",
  },
];



function TableTest() {
  return (
    <div className="mx-auto max-w-3xl">
        <h1>
            Hello
        </h1>
        <DataTable
                    columns={columns} 
                    data={data} 
            direction="auto"
            fixedHeader
            fixedHeaderScrollHeight="1000px"
            pagination
            responsive
            selectableRows
            subHeaderAlign="right"
            subHeaderWrap
            theme = "dark"
        />
                <DataTable 
            columns={columns} 
            data={data} 
            selectableRows
            expandableRows
            expandableRowsComponent={ExpandedComponent}
        />
    
    </div>
  )
}

export default TableTest

