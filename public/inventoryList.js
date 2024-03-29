async function getItems() {
    const response = await fetch('/api/items');
    items = await response.json();
    return items;
}

// Recently added //

let recentlyAddedPopup = document.getElementById('recentlyAddedPopup');

function openRecentlyAddedPopup () {
    recentlyAddedPopup.classList.add('open-popup');
}

function closeRecentlyAddedPopup () {
    recentlyAddedPopup.classList.remove('open-popup');
}

async function loadRecentlyAdded(items) {
    if (!items) {
        items = await getItems();
    }
    
    let recentlyAddedItems = items.slice(items.length >= 10 ? items.length - 10 : 0,  items.length).toReversed();

    const recentlyAddedListEl = document.querySelector('#recentlyAddedList');
    recentlyAddedListEl.innerHTML = "";
    recentlyAddedItems.forEach((item) => {
        recentlyAddedListEl.innerHTML = recentlyAddedListEl.innerHTML + `
        <li class="list-group-item">
            <div class="list-group-item-detail">
                <span class="list-group-item-type">`+ item.user+`</span>
                <span>added &nbsp; &mdash;</span>
            </div>
            <div class="list-group-item-detail">
                <span class="list-group-item-type">Name: </span>
                <span>`+item.name+`</span>
            </div>
            <div class="list-group-item-detail">
                <span class="list-group-item-type">UPC: </span>
                <span>`+item.UPC+`</span>
            </div>
            <div class="list-group-item-detail">
                <span class="list-group-item-type">Style: </span>
                <span>`+item.style+`</span>
            </div>
            <div class="list-group-item-detail">
                <span class="list-group-item-type">Size: </span>
                <span>`+item.size+`</span>
            </div>
        </li>`;
    });
}

// Add item //

let popup = document.getElementById('popup');

function openAddItemPopup() {
    popup.classList.add('open-popup');
}

async function closeAddItemPopup(type){
    if (type == "add") {
        
        const newItemName = document.querySelector("#newItemName");
        const newItemUPC = document.querySelector("#newItemUPC");
        const newItemStyle = document.querySelector("#newItemStyle");
        const newItemSize = document.querySelector("#newItemSize");

        if (!newItemName.value || !newItemUPC.value || !newItemStyle.value || !newItemSize.value) { //one field isn't filled out
            var message = document.querySelector("#badItemInfoMessage");
            message.textContent = "Please enter valid information";
        } else {
            newItem = {name: newItemName.value, UPC: newItemUPC.value, style: newItemStyle.value, size: newItemSize.value};
            let response = await this.saveItem(newItem);
            if (response.msg === "duplicate") {
                var message = document.querySelector("#badItemInfoMessage");
                message.textContent = "UPC code already used.";
            } else {
                addedItem = response.find((item) => item.UPC === newItem.UPC);
                this.broadcastEvent(addedItem);
                loadItems(response);
                loadRecentlyAdded(response);
                popup.classList.remove('open-popup');
            }
        }
    } else { //cancel clicked
        var message = document.querySelector("#badItemInfoMessage");
        message.textContent = "";
        popup.classList.remove('open-popup');
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

// Accordian //

async function loadItems(items) {
    if (!items) {
        items = await getItems();
    }
  
    let styles = {}
    items.forEach(item => {
        if (!styles[item.style]) {
            styles[item.style] = [item];
        } else {
            styles[item.style] = [...styles[item.style], item];
        }
    });

    const accordionEl = document.querySelector('#accordion');
    accordionEl.innerHTML = "";
    for (i = 0; i < Object.keys(styles).length; i++) {
        key = Object.keys(styles)[i];
        accordionEl.innerHTML = accordionEl.innerHTML + `<div class='card' id='card`+i+`'>
        <div class='card-header collapsed' id='heading`+ i +`' data-toggle='collapse' data-target='#collapse`+i+`' aria-expanded='true' aria-controls='collapse`+i+`'>
            <div class='card-title'>
              `+ key +` &mdash; `+ styles[key][0].name +`
            </div>
        </div>
        <div id="collapse`+i+`" class="collapse" aria-labelledby="heading`+i+`" data-parent="#accordion">
            <div class="card-body">
                <div class="card-items">
                    <ul class="list-group list-group-flush">
                        `+ addAccordianItem(styles, key) +`    
                    </ul>
                </div>
            </div>
        </div>`;

    }
}

function addAccordianItem(styles, key) {
    itemsHTML = "";
    styles[key].sort(compareSizes);
    styles[key].forEach(item => {
        itemsHTML = itemsHTML + 
        `<li class="list-group-item inventoryItem">
            <div class="inventoryItem-details">
                <div class="list-group-item-detail" >
                    <span class="list-group-item-type">Name: </span>
                    <span>`+ item.name +`</span>
                </div>
                <div class="list-group-item-detail">
                    <span class="list-group-item-type">UPC: </span>
                    <span>`+ item.UPC +`</span>
                </div>
                <div class="list-group-item-detail">
                    <span class="list-group-item-type">Style: </span>
                    <span>`+ item.style +`</span>
                </div>
                <div class="list-group-item-detail">
                    <span class="list-group-item-type">Size: </span>
                    <span>`+ item.size +`</span>
                </div>
            </div>
            <button onclick="openEditItemPopup(`+item.UPC+`)" type="submit" class="btn btn-primary edit-button" style="display: inline-block">Edit</button>
        </li>`;
    });

    return itemsHTML;
}

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

// Edit Item //

let editItemPopup = document.getElementById('editItemPopup');
const editItemName = document.querySelector("#editItemName");
const editItemUPC = document.querySelector("#editItemUPC");
const editItemStyle = document.querySelector("#editItemStyle");
const editItemSize = document.querySelector("#editItemSize");

let editItem = {};
let items = [];

async function openEditItemPopup(UPC) {
    items = await getItems();

    editItem = items.find((item) => item.UPC === UPC.toString());


    editItemName.value = editItem.name;
    editItemUPC.value = editItem.UPC;
    editItemStyle.value = editItem.style;
    editItemSize.value = editItem.size;
    editItemPopup.classList.add('open-popup');
}

async function closeEditItemPopup(type) {

    if (type === "confirm") {
        let editedItem = {name: editItemName.value, UPC: editItemUPC.value, style: editItemStyle.value, size: editItemSize.value};

        const response = await fetch('/api/editItem', {
            method: 'PATCH',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({item: editedItem, oldUPC: editItem.UPC}),
        });

        items = await response.json();

        if (items.msg === "duplicate") {
            var message = document.querySelector("#badEditInfoMessage");
            message.textContent = "UPC code already used.";
            return;
        }
        
        //reload inventory
        loadItems(items);
        //reload recently added
        loadRecentlyAdded(items);

    } else if (type === "delete") {

        const response = await fetch('/api/deleteItem', {
            method: 'PATCH',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(editItem),
        });

        items = await response.json();

        loadItems(items);
        loadRecentlyAdded(items);

    }
    editItemPopup.classList.remove('open-popup');
}

async function getCount() {
    const response = await fetch('/api/count');
    countArray = await response.json();
    count = new Map();
    countArray.forEach((item) => {
        count.set(item.UPC, item);
    });
    return count;
}

async function setCount(count) {
    await fetch('/api/updateCount', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(Object.fromEntries(count)),
    });
}

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

loadRecentlyAdded();
loadItems();
configureWebSocket();