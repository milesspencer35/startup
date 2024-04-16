import React from "react";

export function Accordion({ items }) {

    let styles = {}
    items.forEach(item => {
        if (!styles[item.style]) {
            styles[item.style] = [item];
        } else {
            styles[item.style] = [...styles[item.style], item];
        }
    });

    const accordionCards = []
    if (Object.keys(styles).length !== 0) {
        let i = 1;
        for(const [key, styleItems] of Object.entries(styles)) {
            accordionCards.push(accordionCard(i, key, styleItems));
            i++;
        }
    }

    return (
        <div id="inventoryList-content">
            <div id="accordion">
                { accordionCards }
            </div>
        </div>
    );
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

function accordionCard(i, key, styleItems) {
    const items = []
    styleItems.sort(compareSizes);
    styleItems.forEach((item) => items.push(accordionItems(item)));

    return (
        <div className='card' id={"card" + i} key={i}>
            <div className='card-header collapsed' id={"heading"+ i} data-toggle='collapse' data-target={"#collapse" + i} aria-expanded='true' aria-controls={"collapse" + i}>
                <div className='card-title'>
                    {key + "—" + styleItems[0].name}
                </div>
            </div>
            <div id={"collapse" + i} className="collapse" aria-labelledby={"heading" + i} data-parent="#accordion">
                <div className="card-body">
                    <div className="card-items">
                        <ul className="list-group list-group-flush">
                            {items}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function accordionItems(item) {
    let editItemPopup = document.getElementById('editItemPopup');
    const editItemName = document.querySelector("#editItemName");
    const editItemUPC = document.querySelector("#editItemUPC");
    const editItemStyle = document.querySelector("#editItemStyle");
    const editItemSize = document.querySelector("#editItemSize");

    async function openEditItemPopup(editItem) {
        editItemName.value = editItem.name;
        editItemUPC.value = editItem.UPC;
        editItemStyle.value = editItem.style;
        editItemSize.value = editItem.size;
        editItemPopup.classList.add('open-popup');
      }


    return (
        <li key={item.UPC} className="list-group-item inventoryItem">
          <div className="inventoryItem-details">
              <div className="list-group-item-detail" >
                  <span className="list-group-item-type">Name: </span>
                  <span>{ item.name }</span>
              </div>
              <div className="list-group-item-detail">
                  <span className="list-group-item-type">UPC: </span>
                  <span>{ item.UPC }</span>
              </div>
              <div className="list-group-item-detail">
                  <span className="list-group-item-type">Style: </span>
                  <span>{ item.style }</span>
              </div>
              <div className="list-group-item-detail">
                  <span className="list-group-item-type">Size: </span>
                  <span>{ item.size }</span>
              </div>
          </div>
          <button onClick={() => openEditItemPopup(item)} type="submit" className="btn btn-primary edit-button" style={{display: "inline-block"}}>Edit</button>
      </li>
    );
}