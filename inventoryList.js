let popup = document.getElementById('popup');

function openAddItemPopup() {
    popup.classList.add('open-popup');
}

let itemsText = localStorage.getItem('items');
let items = JSON.parse(itemsText);

function closeAddItemPopup(type){
    if (type == "add") {
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
            this.saveItem({name: newItemName.value, UPC: newItemUPC.value, style: newItemStyle.value, size: newItemSize.value});
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