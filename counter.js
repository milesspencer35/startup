let itemsText = localStorage.getItem("items");
let itemsList = JSON.parse(itemsText);

const itemsMap = new Map();
itemsList.forEach((item) => {
    itemsMap.set(item.UPC, item);
});



const inputUPC = document.querySelector("#inputUPC");
function countItem() {
    upcCode = inputUPC.value;

    let count = new Map();
    const countText = localStorage.getItem('count');
    if (countText) {
        count = new Map(Object.entries(JSON.parse(countText)));
    }

    let countItem = null;
    if (!count.get(upcCode)) {
        countItem = itemsMap.get(upcCode);
        countItem.count = 1;
    } else {
        countItem = count.get(upcCode);
        countItem.count += 1;
    }

    count.set(upcCode, countItem);
    localStorage.setItem("count", JSON.stringify(Object.fromEntries(count)));
    inputUPC.value = "";
    displayCounts();
}

function displayCounts() {
    countItems = document.querySelector("#count-items");
    countItems.innerHTML = "";

    let count = new Map();
    const countText = localStorage.getItem('count');
    if (countText) {
        count = new Map(Object.entries(JSON.parse(countText)));
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

displayCounts();