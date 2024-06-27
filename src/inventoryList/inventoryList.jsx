import React from 'react';
import { Accordion } from './accordion';
import { RecentlyAddedItems } from './recentlyAddedItems';
import { Notifier } from './inventoryNotifier';
import { Popup } from '../popup/popup'
import "./inventoryList.css";
import "../popup/popup.css";

export function InventoryList() {
  const [items, setItems] = React.useState([]);
  const [recentlyAdded, setRecentlyAdded] = React.useState([]);
  const [recentlyIsOpen, setRecentlyIsOpen] = React.useState(false);
  const [addIsOpen, setAddIsOpen] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/items')
      .then((response) => response.json())
      .then((itemsArray) => {
        setItems(itemsArray);
        setRecentlyAdded(itemsArray.slice(itemsArray.length >= 10 ? itemsArray.length - 10 : 0,  itemsArray.length).toReversed());
      });
  }, []);

  // Recently Added //

  function toggleRecentlyPopup() {
	setRecentlyIsOpen(!recentlyIsOpen);
  }

  // Add Item //

  function toggleAddItemPopup() {
    setAddIsOpen(!addIsOpen);
  }

  async function closeAddItemPopup(type){
    if (type == "add") {
        
      const newItemName = document.querySelector("#newItemName");
      const newItemUPC = document.querySelector("#newItemUPC");
      const newItemStyle = document.querySelector("#newItemStyle");
      const newItemSize = document.querySelector("#newItemSize");

      if (!newItemName.value || !newItemUPC.value || !newItemStyle.value || !newItemSize.value) { //one field isn't filled out
          let message = document.querySelector("#badItemInfoMessage");
          message.textContent = "Please enter valid information";
      } else {
          const newItem = {name: newItemName.value, UPC: newItemUPC.value, style: newItemStyle.value, size: newItemSize.value};
          let response = await saveItem(newItem);
          if (response.msg === "duplicate") {
              var message = document.querySelector("#badItemInfoMessage");
              message.textContent = "UPC code already used.";
          } else {
              let addedItem = response.find((item) => item.UPC === newItem.UPC);
              Notifier.broadcastEvent(addedItem);
              setItems(response)
              setRecentlyAdded(response.slice(response.length >= 10 ? response.length - 10 : 0,  response.length).toReversed());
              toggleAddItemPopup();
          }
      }
    } else { //cancel clicked
        var message = document.querySelector("#badItemInfoMessage");
        message.textContent = "";
        toggleAddItemPopup();
    }
  }

  async function saveItem(newItem) {

    const response = await fetch('/api/addItem', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(newItem),
    });
  
    return await response.json();
  }

  // Edit Item //
  
  async function closeEditItemPopup(type) {
    // In the future there also needs to be a variable for the edited item before it was even edited
    const editedItem = {name: editItemName.value, UPC: editItemUPC.value, style: editItemStyle.value, size: editItemSize.value};
    if (type === "confirm") {
        
  
        const response = await fetch('/api/editItem', {
            method: 'PATCH',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({item: editedItem, oldUPC: editedItem.UPC}),
        });
  
        const updatedItems = await response.json();
  
        if (updatedItems.msg === "duplicate") {
            var message = document.querySelector("#badEditInfoMessage");
            message.textContent = "UPC code already used.";
            return;
        }
        
        //reload inventory
        setItems(updatedItems);
        //reload recently added
        setRecentlyAdded(updatedItems.slice(updatedItems.length >= 10 ? updatedItems.length - 10 : 0,  updatedItems.length).toReversed());
  
    } else if (type === "delete") {
  
        const response = await fetch('/api/deleteItem', {
            method: 'PATCH',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(editedItem),
        });
  
        const updatedItems = await response.json();
  
        setItems(updatedItems);
        setRecentlyAdded(updatedItems.slice(updatedItems.length >= 10 ? updatedItems.length - 10 : 0,  updatedItems.length).toReversed());
  
    }
    editItemPopup.classList.remove('open-popup');
  }

  return (
    <main id="main-content">
        <div id="notification-content">
            <h5 style={{ marginBottom: '0', paddingRight: '.5rem' }}>Recently added items:</h5>
            <i className="bi bi-card-list" onClick={toggleRecentlyPopup}></i>
        </div>
        <div id="add-item">
            <button onClick={toggleAddItemPopup} style={{fontSize: '1.5rem', borderRadius: '.5rem'}} className="btn btn-primary">Add Inventory Item</button>
        </div>
        <Accordion items={items}></Accordion>
        {/* <!--Add Item popup--> */}

        {addIsOpen && 
			<Popup>
				<h2>Add Item</h2>
				<div className="login-form">
					<div className="form-group" style={{display: "flex", flexDirection: "row"}}>
						<span>Name:</span>
						<input type="text" className="form-control login-content" id="newItemName" placeholder="Name"></input>
					</div>
					<div className="form-group">
						<span>UPC:</span>
						<input type="text" className="form-control login-content" id="newItemUPC" placeholder="UPC"></input>
					</div>
					<div className="form-group">
						<span>Style:</span>
						<input type="text" className="form-control login-content" id="newItemStyle" placeholder="Style code"></input>
					</div>
					<div className="form-group">
						<span>Size:</span>
						<input type="text" className="form-control login-content" id="newItemSize" placeholder="Size"></input>
					</div>
					<div id="badItemInfoMessage"></div>
					<button onClick={() => closeAddItemPopup('add')} className="btn btn-primary login-content">Add</button>
					<button onClick={() => closeAddItemPopup('cancel')} className="btn btn-outline-dark login-content">Cancel</button>
				</div>
			</Popup>
        }

        {/* <!--Recently Added Popup--> */}

		{recentlyIsOpen &&
			<Popup>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<h4 style={{paddingTop: ".5rem"}}>Recently added items</h4>
					<RecentlyAddedItems items={ recentlyAdded } ></RecentlyAddedItems>
					<button onClick={toggleRecentlyPopup} className="btn btn-outline-dark login-content">Close</button>
				</div>
			</Popup>
		}

        {/* <!--Edit Item Popup--> */}
        <div className="popup" id="editItemPopup">
            <h2>Edit Item</h2>
            <div className="login-form">
                <div className="form-group" style={{display: "flex", flexDirection: "row"}}>
                    <span>Name:</span>
                    <input type="text" className="form-control login-content" id="editItemName" placeholder="Name"></input>
                </div>
                <div className="form-group">
                    <span>UPC:</span>
                    <input type="text" className="form-control login-content" id="editItemUPC" disabled placeholder="UPC"></input>
                  </div>
                <div className="form-group">
                    <span>Style:</span>
                    <input type="text" className="form-control login-content" id="editItemStyle" placeholder="Style code"></input>
                </div>
                <div className="form-group">
                    <span>Size:</span>
                    <input type="text" className="form-control login-content" id="editItemSize" placeholder="Size"></input>
                </div>
                <div id="badEditInfoMessage"></div>
                <button onClick={() => closeEditItemPopup('confirm')} className="btn btn-primary login-content">Confirm</button>
                <button onClick={() => closeEditItemPopup('cancel')} className="btn btn-outline-dark login-content">Cancel</button>
            </div>
            <button onClick={() => closeEditItemPopup('delete')} className="btn btn-danger" style={{fontSize: ".75rem", marginTop: "1rem"}}>Delete Item</button>
        </div>
    </main>
  );
}