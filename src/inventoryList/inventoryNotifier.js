
class InventoryNotifier {
    constructor() {
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
        this.socket.onmessage = async (event) => {
            const msg = await JSON.parse(await event.data.text());
            displayMsg(msg.item);
        };
    }

    broadcastEvent(item) {
        const event = {
          item: item
        };
        this.socket.send(JSON.stringify(event));
    }

    displayMsg(item) {
        const recentlyAddedListEl = document.querySelector('#recentlyAddedList');
        recentlyAddedListEl.innerHTML = `
            <li class="list-group-item">
                <div class="list-group-item-detail">
                    <span class="list-group-item-type">${item.user}</span>
                    <span>added &nbsp; &mdash;</span>
                </div>
                <div class="list-group-item-detail">
                    <span class="list-group-item-type">Name: </span>
                    <span>${item.name}</span>
                </div>
                <div class="list-group-item-detail">
                    <span class="list-group-item-type">UPC: </span>
                    <span>${item.UPC}</span>
                </div>
                <div class="list-group-item-detail">
                    <span class="list-group-item-type">Style: </span>
                    <span>${item.style}</span>
                </div>
                <div class="list-group-item-detail">
                    <span class="list-group-item-type">Size: </span>
                    <span>${item.size}</span>
                </div>
            </li>` + recentlyAddedListEl.innerHTML;
    }
}

const Notifier = new InventoryNotifier();
export { Notifier };
