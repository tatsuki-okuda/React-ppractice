import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Table from './Table';
import useValueRef from './useValueRef';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  customKey: JSX.Element;
};

interface BTN {
  name: string | null;
  onCLick: (name: string | null) => void
}

export interface TableHeader {
  key: string;
  no: number;
  title: string | JSX.Element;
}

const initialHeader : TableHeader[]= [{
  key: '0',
  no: 0,
  title: 'id'
}, {
  key: '1',
  no: 1,
  title: 'name'
}, {
  key: '2',
  no: 2,
  title: 'username'
}, {
  key: '3',
  no: 3,
  title: 'email'
}, {
  key: '4',
  no: 4,
  title: 'customKey'
}];


const Button:React.FC<BTN> = ({name, onCLick}) => {
  return (
    <>
      <button onClick={() => onCLick(name)}>{name}</button>
    </>
  )
}



function App() {

  const hederRef = useRef(initialHeader);
  const [users, setUsers] = useState<User[]>([]);
  const usersRef = useValueRef(users);

  
  const nameChange = (name: string) => {
    const result = users.find(v => v.username === name);
    return result ? result.username : 'No Name';
  }

  const apply = (name: string | null) => {
    // クロージャーの影響で値が古い値の参照先になっている
    console.log('apply', users);
    // refの場合はrefの参照先が常に一定なので最新の値で取れる。
    console.log('apply2', usersRef.current);
  };


  const MemoBtn = React.memo((v: User) => {
    return <Button name={v.username ?? null} onCLick={(name) => apply(name)}/>
  })



  useEffect(() => {
    (async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const usersData: User[] = await response.json();
      const customUsers: User[] = usersData.map(v => ({
        ...v,
        username: nameChange(v.username),
        customKey: <MemoBtn username={v.username} id={v.id} name={v.name} email={v.email} customKey={v.customKey}/>
      }));
      setUsers(customUsers);
    })();
  }, []);



  return (
    <div className="App">
      <div style={{ margin: '2em' }}>
        {/* ここではクロージャが最新で取れる */}
        <button onClick={() => apply(null)}>apply</button>
        
        <Table 
          header={hederRef.current}
          data={users}
        />
      </div>
    </div>
  )
}

export default App
