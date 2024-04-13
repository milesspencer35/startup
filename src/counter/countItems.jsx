import React from "react";

export function CountItems({ countMap }) {
    const countItems = [];
    if (countMap.length) {
        for (item of countMap.entries()) {
            countItems.push(countItem(item));
        }
    }

    return (
        <div id="count-items">
            {countItems}
        </div>
    );
}

function countItem({ countItem }) {

    return (
        <div class="count-item">
            <div class="item-name">`+ {countItem.item.name} + " &ndash; " + {countItem.item.size} +`</div>
            <div class="item-content">
                <div class="item-details">
                    <div>
                        <span class="item-type">UPC: </span>
                        <span class="item-data">`+{countItem.UPC}+`</span>
                    </div>
                    <div>
                        <span class="item-type">Style Code:</span>
                        <span class="item-data">`+{countItem.item.style}+`</span>
                    </div>
                    <div>
                        <span class="item-type">Size:</span>
                        <span class="item-data">`+{countItem.item.size}+`</span>
                    </div>
                </div>
                <div class="item-count">
                    <span class="count-title">Count</span>
                    <span class="count-number">`+{countItem.count}+`</span>
                </div>
            </div>
        </div>
    );
}