import React, { useState, useRef, useEffect } from "react";
import "./Main.css";
import {userData} from '../Atoms/UserData'
import UserMain from "../Atoms/UserMain";
import SelectedUser from "../Atoms/SelectedUser";

const AutoComplete = () => {
  const [inputValue, setInputValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isFilterVisible, setFilterVisibility] = useState(false);
  const inputRef = useRef(null);
  const backspacePressedRef = useRef(false);

  // Update the filtered items based on user input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const filtered = userData.filter(
      (user) =>
        user.name.toLowerCase().includes(value.toLowerCase()) &&
        !selectedItems.includes(user)
    );
    setFilteredItems(filtered);
    setFilterVisibility(true);
  };

  // Add item to selected items, remove from filtered items, and focus the input
  const handleItemClick = (item) => {
    setSelectedItems([...selectedItems, item]);
    setFilteredItems(filteredItems.filter((i) => i !== item));
    setInputValue("");
    setFilterVisibility(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
    backspacePressedRef.current = false; // Reset backspacePressed when an item is clicked
  };

  // For Remove Item From Selected Item and Add it to List of Filtered Item
  const handleRemoveItemClick = (item) => {
    setSelectedItems(selectedItems.filter((i) => i !== item));
    setFilteredItems([...filteredItems, item]);
    backspacePressedRef.current = false; // Reset backspacePressed when an item is removed
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);
  };

  // Handle backspace for highlighting and removing the last selected item
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "Backspace" &&
        inputValue === "" &&
        selectedItems.length > 0
      ) {
        if (!backspacePressedRef.current) {
          setSelectedItems(
            selectedItems.map((item, index) => ({
              ...item,
              highlighted: index === selectedItems.length - 1,
            }))
          );

          backspacePressedRef.current = true;
        } else {
          // Second or subsequent backspace press - remove the last added item
          const lastAddedItem = selectedItems[selectedItems.length - 1];
          setSelectedItems(selectedItems.slice(0, -1)); // Remove the last item
          setFilteredItems([
            ...filteredItems,
            lastAddedItem
          ]);
          backspacePressedRef.current = false;
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 0);
        }
      } else {
        backspacePressedRef.current = false; 
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputValue, selectedItems, filteredItems]);

  // Hide filter items when the input loses focus
  const handleInputBlur = () => {
    setFilterVisibility(false);
  };

  return (
    <div className="auto-complete">
      <div className="selected-items">
        {selectedItems.map((item, index) => (
          <SelectedUser
            key={index}
            image={item.profilePhoto}
            name={item.name}
            highlighted={item.highlighted ? true : false}
            onClick={() => handleRemoveItemClick(item)}
          />
        ))}
        <div className="auto-complete-container">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputChange}
            placeholder="Add new user..."
          />
          {isFilterVisible && filteredItems.length > 0 && (
            <div className="auto-complete-list">
              {filteredItems.map((item) => (
                <UserMain
                  id={item.id}
                  name={item.name}
                  profilePhoto={item.profilePhoto}
                  email={item.email}
                  onMouseDown={() => handleItemClick(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoComplete;
