
let itemsMap = null;
getItemsMap().then(() => displayCounts());

async function getItemsMap() {
    const response = await fetch('/api/items');
    items = await response.json();
    itemsMap = new Map();
    items.forEach((item) => {
        itemsMap.set(item.UPC, item);
    });
}

const inputUPC = document.querySelector("#inputUPC");
async function countItem() {
    upcCode = inputUPC.value;

    if (!itemsMap.get(upcCode)) {
        showMessage('error');
        return null;
    }

    let count = await getCount();

    let countItem = null;
    if (!count.get(upcCode)) {
        countItem = itemsMap.get(upcCode);
        countItem.count = 1;
    } else {
        countItem = count.get(upcCode);
        countItem.count += 1;
    }

    count.set(upcCode, countItem);

    await fetch('/api/updateCount', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(Object.fromEntries(count)),
    });

    showMessage('success');
    inputUPC.value = "";
    displayCounts(count);
}

function showMessage(type) {
    let inputMessage = document.querySelector('#InputMessage');
    if (type === 'success') {
        
        inputMessage.style.color = '#4cbb17';
        inputMessage.textContent = "Counted";
    } else {
        inputMessage.style.color = '#ff0800';
        inputMessage.textContent = "UPC not found in Inventory";
    }
    setTimeout(() => {inputMessage.textContent = ""}, "3000");
}

async function displayCounts(count) {
    countItems = document.querySelector("#count-items");
    countItems.innerHTML = "";

    if (!count) {
        count = await getCount();
    }

    count.forEach((item) => {
        countItems.innerHTML = countItems.innerHTML + `
        <div class="count-item">
            <div class="item-name">`+item.name + " &ndash; " + item.size +`</div>
            <div class="item-content">
                <div class="item-details">
                    <div>
                        <span class="item-type">UPC: </span>
                        <span class="item-data">`+item.UPC+`</span>
                    </div>
                    <div>
                        <span class="item-type">Style Code:</span>
                        <span class="item-data">`+item.style+`</span>
                    </div>
                    <div>
                        <span class="item-type">Size:</span>
                        <span class="item-data">`+item.size+`</span>
                    </div>
                </div>
                <div class="item-count">
                    <span class="count-title">Count</span>
                    <span class="count-number">`+item.count+`</span>
                </div>
            </div>
        </div>`;
    });
}

async function resetCount () {
    await fetch('/api/deleteCount', {
        method: 'DELETE',
    });
    count = new Map();
    displayCounts(count);
}

async function getCount() {
    const response = await fetch('/api/count');
    count = await response.json();
    return new Map(Object.entries(count));
}