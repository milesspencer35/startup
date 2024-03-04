// get items
let items = [];
const itemsText = localStorage.getItem('items');
if (itemsText) {
    items = JSON.parse(itemsText);
}

// Recently added

let recentlyAddedPopup = document.getElementById('recentlyAddedPopup');

function openRecentlyAddedPopup () {
    recentlyAddedPopup.classList.add('open-popup');
}

function closeRecentlyAddedPopup () {
    recentlyAddedPopup.classList.remove('open-popup');
}

function mockWebsocket () {
    setInterval(() => {
        const recentlyAddedListEl = document.querySelector('#recentlyAddedList');
        
        recentlyAddedListEl.innerHTML = `
        <li class="list-group-item">
            <div class="list-group-item-detail">
                <span class="list-group-item-type">Josh</span>
                <span>added &nbsp; &mdash;</span>
            </div>
            <div class="list-group-item-detail">
                <span class="list-group-item-type">Name: </span>
                <span>BYU Jacket</span>
            </div>
            <div class="list-group-item-detail">
                <span class="list-group-item-type">UPC: </span>
                <span>123</span>
            </div>
            <div class="list-group-item-detail">
                <span class="list-group-item-type">Style: </span>
                <span>ABCD-321</span>
            </div>
            <div class="list-group-item-detail">
                <span class="list-group-item-type">Size: </span>
                <span>M</span>
            </div>
        </li>` + recentlyAddedListEl.innerHTML;
      }, 10000);
}

mockWebsocket();

function loadRecentlyAdded() {
    let items = [];
    const itemsText = localStorage.getItem('items');
    if (itemsText) {
        items = JSON.parse(itemsText);
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

// Add item
let popup = document.getElementById('popup');

function openAddItemPopup() {
    popup.classList.add('open-popup');
}

function closeAddItemPopup(type){
    if (type == "add") {
        let items = [];
        const itemsText = localStorage.getItem('items');
        if (itemsText) {
            items = JSON.parse(itemsText);
        }
        
        const newItemName = document.querySelector("#newItemName");
        const newItemUPC = document.querySelector("#newItemUPC");
        const newItemStyle = document.querySelector("#newItemStyle");
        const newItemSize = document.querySelector("#newItemSize");

        if (!newItemName.value || !newItemUPC.value || !newItemStyle.value || !newItemSize.value) { //one filled isn't filled out
            var message = document.querySelector("#badItemInfoMessage");
            message.textContent = "Please enter valid information";
        } else if (items && items.some(item =>  item.UPC === newItemUPC.value)) { //username taken
            var message = document.querySelector("#badItemInfoMessage");
            message.textContent = "UPC code already used.";
        } else {
            let username = localStorage.getItem("currentUsername");
            this.saveItem({name: newItemName.value, UPC: newItemUPC.value, style: newItemStyle.value, size: newItemSize.value, user: username});
            loadItems();
            loadRecentlyAdded();
            popup.classList.remove('open-popup');
        }
    } else { //cancel clicked
        var message = document.querySelector("#badItemInfoMessage");
        message.textContent = "";
        popup.classList.remove('open-popup');
    }
}

function saveItem(newItem) {
    let currentItems = [];
    const currentItemsText = localStorage.getItem('items');
    if (currentItemsText) {
        currentItems = JSON.parse(currentItemsText);
    }
    currentItems.push(newItem);
    localStorage.setItem('items', JSON.stringify(currentItems));
}

// Accordian
function loadItems() {
    let items = [];
    const itemsText = localStorage.getItem('items');
    if (itemsText) {
        items = JSON.parse(itemsText);
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
                        `+ addItem(styles, key) +`    
                    </ul>
                </div>
            </div>
        </div>`;

    }
}

function addItem(styles, key) {
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

let editItemPopup = document.getElementById('editItemPopup');
const editItemName = document.querySelector("#editItemName");
const editItemUPC = document.querySelector("#editItemUPC");
const editItemStyle = document.querySelector("#editItemStyle");
const editItemSize = document.querySelector("#editItemSize");

let editItem = {};

function openEditItemPopup(UPC) {
    let items = [];
    const itemsText = localStorage.getItem('items');
    if (itemsText) {
        items = JSON.parse(itemsText);
    }

    editItem = items.find((item) => item.UPC === UPC.toString());


    editItemName.value = editItem.name;
    editItemUPC.value = editItem.UPC;
    editItemStyle.value = editItem.style;
    editItemSize.value = editItem.size;
    editItemPopup.classList.add('open-popup');
}

function closeEditItemPopup(type) {
    let items = [];
    const itemsText = localStorage.getItem('items');
    if (itemsText) {
        items = JSON.parse(itemsText);
    }

    let editItemIndex = items.findIndex((item) => item.UPC == editItem.UPC);

    if (type === "confirm") {
        let editedItem = {name: editItemName.value, UPC: editItemUPC.value, style: editItemStyle.value, size: editItemSize.value, user: localStorage.getItem('currentUsername')};
        items.splice(editItemIndex, 1, editedItem);
        localStorage.setItem('items', JSON.stringify(items));
        
        //reload inventory
        loadItems();
        //reload recently added
        loadRecentlyAdded();
        //Update count object
        let countText = localStorage.getItem("count");
        let count = null;
        if (countText) {
            count = new Map(Object.entries(JSON.parse(countText)));
            oldCountItem = count.get(editItem.UPC);
            count.delete(editItem.UPC);
            editedItem.count = oldCountItem.count;
            count.set(editedItem.UPC, editedItem);
            localStorage.setItem("count", JSON.stringify(Object.fromEntries(count)));
        }
    } else if (type === "delete") {

    }
    editItemPopup.classList.remove('open-popup');
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

loadRecentlyAdded();
loadItems();