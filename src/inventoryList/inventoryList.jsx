import React from 'react';
import { Accordion } from './accordion';
import "./inventoryList.css";
import "../popup.css";

// Recently added //

// let recentlyAddedPopup = document.getElementById('recentlyAddedPopup');

// function openRecentlyAddedPopup () {
//   recentlyAddedPopup.classList.add('open-popup');
// }

// function closeRecentlyAddedPopup () {
//   recentlyAddedPopup.classList.remove('open-popup');
// }

// async function loadRecentlyAdded(items) {
//   if (!items) {
//       items = await getItems();
//   }
  
//   let recentlyAddedItems = items.slice(items.length >= 10 ? items.length - 10 : 0,  items.length).toReversed();

//   const recentlyAddedListEl = document.querySelector('#recentlyAddedList');
//   recentlyAddedListEl.innerHTML = "";
//   recentlyAddedItems.forEach((item) => {
//       recentlyAddedListEl.innerHTML = recentlyAddedListEl.innerHTML + `
//       <li class="list-group-item">
//           <div class="list-group-item-detail">
//               <span class="list-group-item-type">`+ item.user+`</span>
//               <span>added &nbsp; &mdash;</span>
//           </div>
//           <div class="list-group-item-detail">
//               <span class="list-group-item-type">Name: </span>
//               <span>`+item.name+`</span>
//           </div>
//           <div class="list-group-item-detail">
//               <span class="list-group-item-type">UPC: </span>
//               <span>`+item.UPC+`</span>
//           </div>
//           <div class="list-group-item-detail">
//               <span class="list-group-item-type">Style: </span>
//               <span>`+item.style+`</span>
//           </div>
//           <div class="list-group-item-detail">
//               <span class="list-group-item-type">Size: </span>
//               <span>`+item.size+`</span>
//           </div>
//       </li>`;
//   });
// }

// Add item //

// let popup = document.getElementById('popup');

// function openAddItemPopup() {
//   popup.classList.add('open-popup');
// }

// async function closeAddItemPopup(type){
//   if (type == "add") {
      
//       const newItemName = document.querySelector("#newItemName");
//       const newItemUPC = document.querySelector("#newItemUPC");
//       const newItemStyle = document.querySelector("#newItemStyle");
//       const newItemSize = document.querySelector("#newItemSize");

//       if (!newItemName.value || !newItemUPC.value || !newItemStyle.value || !newItemSize.value) { //one field isn't filled out
//           var message = document.querySelector("#badItemInfoMessage");
//           message.textContent = "Please enter valid information";
//       } else {
//           newItem = {name: newItemName.value, UPC: newItemUPC.value, style: newItemStyle.value, size: newItemSize.value};
//           let response = await this.saveItem(newItem);
//           if (response.msg === "duplicate") {
//               var message = document.querySelector("#badItemInfoMessage");
//               message.textContent = "UPC code already used.";
//           } else {
//               addedItem = response.find((item) => item.UPC === newItem.UPC);
//               this.broadcastEvent(addedItem);
//               loadItems(response);
//               loadRecentlyAdded(response);
//               popup.classList.remove('open-popup');
//           }
//       }
//   } else { //cancel clicked
//       var message = document.querySelector("#badItemInfoMessage");
//       message.textContent = "";
//       popup.classList.remove('open-popup');
//   }
// }

// async function saveItem(newItem) {

//   const response = await fetch('/api/addItem', {
//       method: 'POST',
//       headers: {'content-type': 'application/json'},
//       body: JSON.stringify(newItem),
//   });

//   return await response.json();
// }


let weights = {
  'onesize' : 1,
  'xxs' : 2,
  'xs' : 3,
  's' : 4,
  'm' : 5,
  'l' : 6,
  'xl' : 7,
  'xxl' : 8,
  '2xl' : 8,
  'xxxl' : 9,
  '3xl' : 9,
  'xxxxl' : 10,
  '4xl' : 10
}

function compareSizes(a, b) {
  if (!isNaN(a.size) && !isNaN(b.size)) {
      return compareNumbers(a.size, b.size);
  } else if (!isNaN(a.size) && isNaN(b.size)) {
      return -1;
  } else if (isNaN(a.size) && !isNaN(b.size)) {
      return 1;
  } else {
      a = a.size.toLowerCase();
      b = b.size.toLowerCase();
      return weights[a] - weights[b];
  }
}

function compareNumbers(a, b) {
  return a - b;
}

// Websocket //

let socket = null;

function configureWebSocket() {
  const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
  socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
  socket.onmessage = async (event) => {
      const msg = JSON.parse(await event.data.text());
      this.displayMsg(msg.item);
  };
}

function displayMsg(item) {
  const recentlyAddedListEl = document.querySelector('#recentlyAddedList');
  recentlyAddedListEl.innerHTML = `
      <li class="list-group-item">
          <div class="list-group-item-detail">
              <span class="list-group-item-type">${item.user}</span>
              <span>added &nbsp; &mdash;</span>
          </div>
          <div class="list-group-item-detail">
              <span class="list-group-item-type">Name: </span>
              <span>${item.name}</span>
          </div>
          <div class="list-group-item-detail">
              <span class="list-group-item-type">UPC: </span>
              <span>${item.UPC}</span>
          </div>
          <div class="list-group-item-detail">
              <span class="list-group-item-type">Style: </span>
              <span>${item.style}</span>
          </div>
          <div class="list-group-item-detail">
              <span class="list-group-item-type">Size: </span>
              <span>${item.size}</span>
          </div>
      </li>` + recentlyAddedListEl.innerHTML;
}

function broadcastEvent(item) {
  const event = {
    item: item
  };
  socket.send(JSON.stringify(event));
}

configureWebSocket();


export function InventoryList() {
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    fetch('/api/items')
      .then((response) => response.json())
      .then((itemsArray) => {
        setItems(itemsArray);
      });
  }, []);

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
        // loadRecentlyAdded(items);
  
    } else if (type === "delete") {
  
        const response = await fetch('/api/deleteItem', {
            method: 'PATCH',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(editedItem),
        });
  
        const updatedItems = await response.json();
  
        setItems(updatedItems);
        // loadRecentlyAdded(items);
  
    }
    editItemPopup.classList.remove('open-popup');
  }


  return (
    <main id="main-content">
        <div id="notification-content">
            <h5 style={{ marginBottom: '0', paddingRight: '.5rem' }}>Recently added items:</h5>
            {/* <i className="bi bi-card-list" onClick={openRecentlyAddedPopup()}></i> */}
        </div>
        <div id="add-item">
            {/* <button onClick={openAddItemPopup} style={{fontSize: '1.5rem', borderRadius: '.5rem'}} className="btn btn-primary">Add Inventory Item</button> */}
        </div>
        <Accordion items={items}></Accordion>
        {/* <!--Add Item popup--> */}
        <div className="popup" id="popup">
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
                {/* <button onClick={closeAddItemPopup('add')} className="btn btn-primary login-content">Add</button> */}
                {/* <button onClick={closeAddItemPopup('cancel')} className="btn btn-outline-dark login-content">Cancel</button> */}
            </div>
        </div>
        {/* <!--Recently Added Popup--> */}
        <div className="popup" id="recentlyAddedPopup">
            <h4 style={{paddingTop: ".5rem"}}>Recently added items</h4>
            <ul className="list-group list-group-flush" id="recentlyAddedList">
            </ul>
            {/* <button onClick={closeRecentlyAddedPopup('cancel')} className="btn btn-outline-dark login-content">Close</button> */}
        </div>

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