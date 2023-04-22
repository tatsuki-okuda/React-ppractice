import React from 'react';

import { User, TableHeader} from './App';

interface Table {
  header: TableHeader[],
  data: User[];
}

const Table: React.FC<Table> = ({header, data}) => {
  return (
    <table>
      <thead>
        <tr>
          {
            header && header.map(v => (
              <th className="item" key={v.no+'header'}>{v.title}</th>
            ))
          }
          
        </tr>
      </thead>
      <tbody>
        {
          data && data.map(v => (
            <tr className="item" key={v.email} onClick={() => console.log('tr click',data)}>
            {
              header.map((header, index) => {
                if( typeof v[header.title as keyof User] === 'object'){
                  return <td key={header.title+index.toString()}>{v.customKey}</td>
                } else {
                  return <td key={header.title+index.toString()}>{v[header.title as keyof User]}</td>
                }
              })
            }
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

export default Table