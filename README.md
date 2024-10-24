# Shobu : Your place for the FGC

This progressive web app is the continuation of https://github.com/FlowXII/LFW-App which was my first passion project. I've decided to aim for something higher, and put in more work, especially in the UX/UI department.
The goal of this is to make everybody in the FGC have a better experience with creating, handling, spectating, and competing in tournaments.

This is why i've started this project ; As a member of this community myself, as a former pro player, i've been through every step of the way. And start.gg has its faults, especially in the usability and UX/UI departments; This solution aims to help.

## The stack
It is build in react.js with Material Tailwind, and the backend is supported by Node.js and GraphQL. Querying start.gg's API is handled using graphQL and in-app communication is handled with RESTFUL APIs. Finally, start.gg has an oauth feature currently supported in the application.

## The features
### Station Viewer

![Shobu Station Viewer](https://github.com/user-attachments/assets/bf7672a4-25c1-435f-ad8e-ba5b6895ad91)

Allows the user to check what matches are ongoing/called in your bracket, in real time. This is very useful for tournament organisers as they don't have to yell for players to play in a given station anymore. This solves a big problem tournament organisers almost always have. Right now, just by projecting this screen with your own bracket in your event, you'll be able to let players go themselves to the station to play out their set, and only write the report.

### Upcoming Tournaments

![Shobu Upcoming Tournaments](https://github.com/user-attachments/assets/1f88726d-8e58-4517-8e44-8fa04ed0eb7d)

This is very nice to help you see where you'll compete. Mostly aimed at players that want to have a good time, no matter your game of choice.

### The Dashboard

![Shobu Dashboard](https://github.com/user-attachments/assets/6dd6d2e1-69ba-44fc-b7f6-10a6a30a9ce9)

The main component. This has all the info you need as a competitor : Your last tournaments, your profile, and there's a set watcher that will send you a PUSH notification if your match is called. No more organisers screaming their lungs out !

### Mobile compatible and installation-ready !

![Mobile View](https://github.com/user-attachments/assets/36181492-e054-4944-bfba-9a6be6508958)

More features are on the way ! Including the capacity to report the set once connected through the station viewer, the ability to check what are some good places to eat near the venue of your choice, the ability to check if your favorite player is playing... and much more !

Thank you for reading !
