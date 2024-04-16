import React from "react";

export function RecentlyAddedItems({items}) {
    let recentItems = [];
    items.forEach((item) => recentItems.push(addedItems(item)));

    return (
        <ul className="list-group list-group-flush" id="recentlyAddedList">
             {recentItems} 
        </ul>
    );
}

function addedItems(item) {
    return (
        <li key={item._id} className="list-group-item">
          <div className="list-group-item-detail">
              <span className="list-group-item-type">{ item.user }</span>
              <span> added &nbsp; &mdash;</span>
          </div>
          <div className="list-group-item-detail">
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
      </li>
    );
}