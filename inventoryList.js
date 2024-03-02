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
            let username = localStorage.getItem("currentUsername");
            this.saveItem({name: newItemName.value, UPC: newItemUPC.value, style: newItemStyle.value, size: newItemSize.value, time: Date.now(), user: username});
            loadItems();
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
            <button onclick="editItem(item)" type="submit" class="btn btn-primary edit-button" style="display: inline-block">Edit</button>
        </li>`;
    });

    return itemsHTML;
  }

  function editItem(item) {
    console.log(item);
    popup.classList.add('open-popup');
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
    console.log(!isNaN(a.size));
    console.log(!isNaN(b.size));
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

  loadItems();