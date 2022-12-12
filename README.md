# Uber like service

This application contains 2 roles: **driver** and **shipper**. It was created to help regular people to deliver their stuff and help drivers to find loads and earn some money.

Any user can register and then login into the system. Drivers operate with trucks (view, create, update, delete them) and shippers mainly interact with loads.

Basically, a driver creates a truck which can be one of three types: **Sprinter**, **Small Straight** or **Large Straight**. Then this driver should assign one created truck to himself/herself to inform the system that he/she is able to deliver loads. 

Shipper creates a load by specifying its name, payload, delivery/pickup address and dimensions (width, length and height). Then he/she should post this load so the system can find an appropriate driver with assigned truck (also, the status of this truck must be 'IS' - in status and its dimensions along with the payload should be greater or equal than the load`s characteristics).

When the driver with truck was found, this truck`s status changes from **'IS'** to **'OL'** (On Load),
load status changes from **'POSTED'** to **'ASSIGNED'** and load state changes to **'En route to Pick Up'**.

Driver can see assigned to him/her load info and interact with this load by changing its state.
Load state transitions: 
1. En Route to Pick Up
2. Arrived to Pick Up
3. En Route to delivery
4. Arrived to delivery

Once load state is **'Arrived to delivery'**, its status changes to **'SHIPPED'** - the driver successfully delivered this load and now can pick up a new one. 

# Architecture
The app was written using **Node.js** and **Angular** (**MongoDB** was used as a database). The project structure was written according to the **MVC** pattern. Also, to make the controllers more 'lightweight', 2 additional layers were created - **Service Layer** and **DAO Layer**. Service Layer contains the business logic and calls methods from the DAO layer which, in turn, contains methods to operate with **MongoDB**. 

For the backend tests, **Mocha** and **Chai** were used.

# Implemented optional criteria
1. Any system user can easily reset his password using 'forgot password' option.
A user can click 'forgot password' in the login form and the new password will be sent to his/her email.
2. User is able to attach photo to his profile.
Any user can specify a profile photo during the registration process. This photo will be displayed in the header section.
3. User can generate reports about shipped loads, in pdf format and download them.
A shipper can generate a pdf file with reports about shipped loads and then download it.
4. Ability to filter loads by status.
Loads are displayed in different sections in the UI, according to their status. 
5. Pagination for loads.
Pagination for loads was implemented. A user can click 'Load more' button to load more loads.
6. User can interact with application through simple UI application.
Angular was chosen as a framework for this application. UI is splitted into different components. Each feature (trucks, loads, authentication) is grouped into its own module which will be loaded lazily. All requests to the backend are contained inside the services. Also, the custom directive (BasicHighlightDirective) was created to identify which step in the StepperComponent will be marked (Stepper Component displayes all load state transitions along with the current state).
To protect the routes from being accessed while the user is not authenticated, the AuthGuard was created. 
7. Shipper/Driver is able to see his load info(pick-up address, delivery address) on the map on UI.
This app is connected to the Google Maps services so the user (driver or shipper) can see the delivery/pickup address and the route on the map (LoadDetailsComponent).   
8. Any system user is able to interact with the system UI using a mobile phone without any issues.
This app is responsive (bootstrap 5 was used).

# Implemented rockstar criteria
1. Driver and Shipper can contact each other through simple chat related to load. 
Driver and shipper can join the chat if the load status is **'ASSIGNED'** or **'SHIPPED'** (otherwise, the driver was not found yet). This feature was implemented using websockets. 
2. Driver and Shipper can receive real time shipments updates through WS. 
Driver and shipper can see real time load state updates (no need to refresh the page). This feature was also implemented using websockets.
3. The most important functionality covered with unit and acceptance tests. 
The tests were written for the backend. **Mocha** and **Chai** were used for this. 
4. [UI] Ability for any system user to choose language on UI(localization). 
There are 2 languages that the application supports: **Ukrainian** and **English**. The user can switch the language in the header section. 
5. Any system user can get notifications through the email about shipment updates. 
Shipper and driver receives an email when: 1) the load was successfully assigned to the driver; 2) the driver shipped a load.

 

