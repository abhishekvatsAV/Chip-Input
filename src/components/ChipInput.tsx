import React, { useState, useEffect, useRef, KeyboardEvent, ChangeEvent, MouseEvent } from "react";
import { User } from "../types";

interface ChipInputProps {
  userList: User[];
}

const ChipInput: React.FC<ChipInputProps> = ({ userList }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [highlightedUser, setHighlightedUser] = useState<User | null>(null);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const filterListRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (e: any) => {
    if (filterListRef.current && !filterListRef.current.contains(e.target)) {
      setIsInputFocused(false);
    }
  };

  useEffect(() => {
    setFilteredUsers(userList.filter((user) => !selectedUsers.includes(user)));
  }, [userList, selectedUsers]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.trim() === "") {
      setFilteredUsers(userList.filter((user) => !selectedUsers.includes(user)));
    } else {
      const filtered = userList.filter((user) => user.name.toLowerCase().includes(value.toLowerCase()));
      setFilteredUsers(filtered.filter((user) => !selectedUsers.includes(user)));
    }
  };

  const handleChipClick = (user: User) => {
    setSelectedUsers([...selectedUsers, user]);
    setInputValue("");
    setHighlightedUser(null);
  };

  const handleRemoveChip = (index: number) => {
    const updatedUsers = [...selectedUsers];
    const removedUser = updatedUsers.splice(index, 1)[0];
    setSelectedUsers(updatedUsers);
    setFilteredUsers([...filteredUsers, removedUser]);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && inputValue === "") {
      if (!highlightedUser) {
        const lastChipIndex = selectedUsers.length - 1;
        setHighlightedUser(selectedUsers[lastChipIndex]);
      } else {
        const updatedUsers = selectedUsers.filter((user) => user !== highlightedUser);
        setSelectedUsers(updatedUsers);
        setFilteredUsers([...filteredUsers, highlightedUser]);
        setHighlightedUser(null);
      }
    } else if (event.key === "ArrowDown") {
      if (filteredUsers.length > 0) {
        const index = highlightedUser ? filteredUsers.indexOf(highlightedUser) + 1 : 0;
        setHighlightedUser(filteredUsers[index % filteredUsers.length]);
      }
    } else if (event.key === "ArrowUp") {
      if (filteredUsers.length > 0) {
        const index = highlightedUser ? filteredUsers.indexOf(highlightedUser) - 1 : filteredUsers.length - 1;
        setHighlightedUser(filteredUsers[(index + filteredUsers.length) % filteredUsers.length]);
      }
    } else if (event.key === "Enter") {
      if (highlightedUser) {
        handleChipClick(highlightedUser);
      }
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleSuggestionClick = (event: MouseEvent<HTMLDivElement>, user: User) => {
    event.preventDefault();
    handleChipClick(user);
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 relative border-b-2 border-blue-700">
      {selectedUsers.map((user, index) => (
        <div
          key={index}
          className={`flex items-center bg-gray-400 text-white rounded-md p-2 ${
            user === highlightedUser ? "ring ring-blue-500" : ""
          }`}
        >
          <img src={user.icon} alt={user.name} className="w-6 h-6 rounded-full mr-2" />
          <div>
            <div>{user.name}</div>
          </div>
          <button className="ml-2 text-white font-bold focus:outline-none" onClick={() => handleRemoveChip(index)}>
            X
          </button>
        </div>
      ))}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className=" outline-none p-2"
          placeholder="Type to AddUser"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={handleInputFocus}
        />

        {isInputFocused && filteredUsers.length > 0 && (
          <div
            className="absolute mt-2 p-2 bg-white border border-gray-300 rounded-md w-60 max-h-[50vh] overflow-scroll"
            ref={filterListRef}
          >
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`cursor-pointer p-2 hover:bg-gray-200 ${user === highlightedUser ? "  bg-gray-300 text-white" : ""}`}
                onClick={(event) => handleSuggestionClick(event, user)}
              >
                <img src={user.icon} alt={user.name} className="w-6 h-6 rounded-full mr-2" />
                <div>
                  <div>{user.name}</div>
                  <div className={`text-xs ${user === highlightedUser ? "text-white" : "text-gray-300"} `}>{user.email}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChipInput;
