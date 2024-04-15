import React from "react";

export function CountItems({ countMap }) {
    const countItems = [];
    if (countMap.size) {
        countMap.values().forEach((item) => countItems.push(CountItem(item)));
    }

    return (
        <div id="count-items">
            {countItems}
        </div>
    );
}

function CountItem(countItem) {

    return (
        <div key={countItem.item._id} className="count-item">
            <div className="item-name">{countItem.item.name} &ndash; {countItem.item.size}</div>
            <div className="item-content">
                <div className="item-details">
                    <div>
                        <span className="item-type">UPC: </span>
                        <span className="item-data"> {countItem.UPC}</span>
                    </div>
                    <div>
                        <span className="item-type">Style Code:</span>
                        <span className="item-data"> {countItem.item.style}</span>
                    </div>
                    <div>
                        <span className="item-type">Size:</span>
                        <span className="item-data"> {countItem.item.size}</span>
                    </div>
                </div>
                <div className="item-count">
                    <span className="count-title">Count</span>
                    <span className="count-number"> {countItem.count}</span>
                </div>
            </div>
        </div>
    );
}