import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import PaginationTable from './react-pagination';

const widthStyle = {
    minWidth: '200px',
    maxWidth: '300px'
}

export default class ReactTable extends Component {


    constructor() {
        super();

         // an example array of items to be paged
         var exampleItems = [...Array(150).keys()].map(i => ({ id: (i+1), name: 'Item ' + (i+1) }));

         this.state = {
             exampleItems: exampleItems,
             pageOfItems: []
         };
         this.onChangePage = this.onChangePage.bind(this);
    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }

    render() {
        return (
            <div>

           
            <Table responsive>
  <thead>
    <tr>
      <th>#</th>
      {Array.from({ length: 12 }).map((_, index) => (
        <th key={index} style={widthStyle}>Table heading</th>
      ))}
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      {Array.from({ length: 12 }).map((_, index) => (
        <td key={index}>Table cell {index}</td>
      ))}
    </tr>
    <tr>
      <td>2</td>
      {Array.from({ length: 12 }).map((_, index) => (
        <td key={index}>Table cell {index}</td>
      ))}
    </tr>
    <tr>
      <td>3</td>
      {Array.from({ length: 12 }).map((_, index) => (
        <td key={index}>Table cell {index}</td>
      ))}
    </tr>
  </tbody>
</Table>

<div>
{this.state.pageOfItems.map(item =>
                            <div key={item.id}>{item.name}</div>
                        )}
                        <PaginationTable items={this.state.exampleItems} onChangePage={this.onChangePage} />
</div>
</div>
        )
    }
}