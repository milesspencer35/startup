import React from 'react';
import { CountItems } from './countItems';
import './counter.css';

export function Counter() {
  const [count, setCount] = React.useState([]);
  const [itemsMap, setItems] = React.useState(new Map());

  React.useEffect(() => {
    let loadedItems = null;

    const fetchItems = async () => {
      let mapOfItems = null;
      await fetch('/api/items')
      .then((response) => response.json())
      .then(async (items) => {
        mapOfItems = await getItemsMap(items);
      });
      return mapOfItems;
    }
    const fetchCount = async () => {
      let countMap = null;
      await fetch('/api/count')
      .then((response) => response.json())
      .then(async (countArray) => {
        countMap = await getCountMap(countArray, loadedItems);
      });
      return countMap;
    }

    const fetchBoth = async () => {
      loadedItems = await fetchItems()
      await setItems(loadedItems);
      const loadedCount = await fetchCount();
      await setCount(loadedCount);
    };

    fetchBoth();
    
  }, []);

  // turns items array into map
  async function getItemsMap(items) {
    let mapOfItems = new Map();
    items.forEach((item) => {
       mapOfItems.set(item.UPC, item);
    });
    return mapOfItems;
  }

  // Count Items //

  async function getCountMap(countArray, loadedItems) {
    let countMap = new Map();
    countArray.forEach((item) => {
        countMap.set(item.UPC, item);
    });
    let joinCount = await joinItemsAndCount(countMap, loadedItems);
    return joinCount;
  }

  async function joinItemsAndCount(countMap, loadedItems) {
    let joinMap = new Map();
    await countMap.forEach(async (countItem) => {
        let joinItem = {
            UPC: countItem.UPC,
            item: await loadedItems.get(countItem.UPC),
            count: countItem.count
        }
        await joinMap.set(joinItem.UPC, joinItem);
    });

    return joinMap;
  }

  const updateCounts = (key, newCount, newItem) => {
    // need to create a totally new map for this to work
    const updatedCountMap = new Map(count);
    const itemToUpdate = updatedCountMap.get(key);
    if (itemToUpdate) {
      itemToUpdate.count = newCount;
    } else {
      updatedCountMap.set(key, newItem);
    }
    setCount(updatedCountMap);
  };

  async function countItem() {
    const inputUPC = document.querySelector("#inputUPC");
    let upcCode = inputUPC.value;

    if (!itemsMap.get(upcCode)) {
        showMessage('error');
        return null;
    }

    let countItem = null;
    let newItemCount = 0;
    if (!count.get(upcCode)) {
        countItem = {UPC: upcCode, count: 1, item: itemsMap.get(upcCode)};
        updateCounts(countItem.UPC, null, countItem);
    } else {
        countItem = count.get(upcCode);
        newItemCount = countItem.count + 1;
        updateCounts(countItem.UPC, newItemCount, null);
    }

    fetch('/api/updateCount', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(countItem),
    });

    showMessage('success');
    inputUPC.value = "";
  }

  let timeoutID = 1;
  function showMessage(type) {
      let inputMessage = document.querySelector('#InputMessage');
      if (type === 'success') {
          
          inputMessage.style.color = '#4cbb17';
          inputMessage.textContent = "Counted";
      } else {
          inputMessage.style.color = '#ff0800';
          inputMessage.textContent = "UPC not found in Inventory";
      }
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {inputMessage.textContent = ""}, "2000");
  }

  async function resetCount () {
    await fetch('/api/deleteCount', {
        method: 'DELETE',
    });
    setCount(new Map());
  }
  
  const onKeyDown = event => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      countItem();
    }
  }

  return (
    <main id="center-content">
        <div className="upc-form">
            <span className="upc-form-item">Input UPC Code</span>
            <div className="form-group upc-form-item" >
              <input type="text" onKeyDown={onKeyDown} id="inputUPC" className="form-control" placeholder="UPC code" style={{fontSize: '1.25rem'}}></input>
            </div>
            <button onClick={countItem} className="btn btn-primary upc-form-item" style={{ borderRadius: '.5rem', fontSize: '1.5rem'}}>Add</button>
            <div id="InputMessage" style={{ height: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}></div>
        </div>
        <div id="count-content">
            <span id="count-title">Count</span>
            <CountItems countMap={ count }></CountItems>
            <button onClick={resetCount} id="reset-button" className="btn btn-danger">Reset Count</button>
        </div>
    </main>
  );
}