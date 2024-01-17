# UPC Counter

## Specifications

### Evaluator Pitch
Counting inventory manually is a pain, especially at BYU Football. With a wide array of different styles, sizes, and colors it is taxing to keep track of all the different items and not miscount items. The UPC Counter app makes this process easy by utilizing the UPC codes that are on the item's tags. The app takes in a UPC code and then adds that to the count of that item. After entering the desired items the user will then be able to view a list of all the total counts confident that each item was accounted for properly.

### Design

![Mock](upcCounterDesign.jpeg)

### Key Features
* Secure login over HTTPS
* Input UPC code for the item that is to be added to the count
* Add item information including name, style code, color code, and size
* View of counted items in the list
* Ability to clear count and start a new one
* Notifications when another user adds an item information
* Item info is persistently stored

### Technologies
I am going to use the required technologies in the following ways.

* HTML - This will be the layout of the 3 webpages. It will include text, input files, and buttons. 
* CSS - Make sure the website formats well on desktop and phone sizes. This will also create correct padding, colors, and font. 
* JavaScript - Provides login, adding a UPC item, adding a brand new item, and editing item information.
* Service - Backend service for login, adding new items, and retrieving item info.
* DB/Login - Input box and submit box for login. The database will hold items and their information. Once a user inputs a UPC code that is stored in the database that info will be sent to the client. 
* WebSocket - Sends a notification when someone enters a brand new item with info. 
* React - Application ported to use the React web framework.
