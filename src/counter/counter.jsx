import React from 'react';
import './counter.css';

export function Counter() {
  const [count, setCount] = React.useState([]);
  const [itemsMap, setItems] = React.useState(new Map());

  React.useEffect(() => {
    fetch('/api/items')
      .then((response) => response.json())
      .then(async (items) => {
        setItems(await getItemsMap(items));
      });
  }, []);

  async function getItemsMap(items) {
    let itemsMap = new Map();
    items.forEach((item) => {
        itemsMap.set(item.UPC, item);
    });
    return itemsMap;
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
        countItem = {UPC: upcCode, count: 1, item: itemsMap.get(upcCode)};
    } else {
        countItem = count.get(upcCode);
        countItem.count += 1;
    }

    count.set(upcCode, countItem);

    fetch('/api/updateCount', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(countItem),
    });

    showMessage('success');
    inputUPC.value = "";
    displayCounts(count);
  }

  async function resetCount () {
    await fetch('/api/deleteCount', {
        method: 'DELETE',
    });
    count = new Map();
    displayCounts(count);
  }

  return (
    <main id="center-content">
        <div className="upc-form">
            <span className="upc-form-item">Input UPC Code</span>
            <form className="form-group upc-form-item" action="javascript:countItem()">
              <input type="text" id="inputUPC" className="form-control" placeholder="UPC code" style={{fontSize: '1.25rem'}}></input>
            </form>
            <button onClick={countItem} className="btn btn-primary upc-form-item" style={{ borderRadius: '.5rem', fontSize: '1.5rem'}}>Add</button>
            <div id="InputMessage" style={{ height: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}></div>
        </div>
        <div id="count-content">
            <span id="count-title">Count</span>
            <div id="count-items"> </div>
            <button onClick={resetCount} id="reset-button" className="btn btn-danger">Reset Count</button>
        </div>
    </main>
  );
}