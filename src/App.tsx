// App.tsx
import React from "react";
import ChipInput from "./components/ChipInput";
import { User } from "./types";
import Data from "./MOCK_DATA.json"

const userList: User[] = Data;

const App: React.FC = () => {
  return (
    <div className="p-20 lg:p-40 flex justify-center">
      <ChipInput userList={userList} />
    </div>
  );
};

export default App;
