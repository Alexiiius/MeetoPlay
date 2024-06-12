# MeetoPlay

DAW 2024 course final project

README still under construction...

## Contents

- [Developers](#developers)
- [Draft](#draft)

## Developers

- [Daniel Ramírez Vaquero](https://github.com/DaniRamirezVaquero)
- [Alejandro Sánchez Fernández](https://github.com/Alexiiius)

## Draft

[Notion Link](https://abrasive-hero-fc5.notion.site/Ante-Proyecto-38e379f81d054bee9f4d5a9adf676640?pvs=4)

## Versions
- 0.0.1 🗓️ (30/04/2024) 
  - API - BackEnd - Front Structure commited (Base laravel 11 and angular 17 proyects)
    
- 0.0.2 🗓️ (04/05/2024) 
  - Backend: Added security and auth features (personal access token, email verification, unauthorized msgs...)
  - Frontend: Added main form to create events with validations using json as database
    
- 0.1.2 🗓️ (07/05/2024) 
  - Backend: Now we can save created events on database
  - Frontend: Connected to Backend API Rest to save created events
    
- 0.1.3 🗓️ (08/05/2024) 
  - Backend: Minnor changes
  - Frontend: Added security tokes on API requests

- 0.2.3 🗓️ (09/05/2024) 
  - Backend: Preparing backend to users relations (followers)
  - Frontend: Session control and login/register added
  
- 0.2.4 🗓️ (10/05/2024)
    - Backend: Finished users relations and events
    - Frontend: Added EventCardComponent
 
- 0.2.5 🗓️ (13/05/2024)
    - Backend: Added 404 error handle and some validations on user realtions
    - Frontend: Restyled evewntFeedComponent

- 0.2.6 🗓️ (13/05/2024)
    - Backend: Work on events CRUD
    - Frontend: Update profile card layout and add dropdown menu for user actions
 
- 0.2.7 🗓️ (10/05/2024)
    - Backend: Finished users relations and events
    - Frontend: Added EventCardComponent

- 0.2.8 🗓️ (14/05/2024)
    - Backend: Refactor event endpoints to return participants and requirements inside every filter
    - Frontend: ProfileCardComponent now connected with backend
 
- 0.2.9 🗓️ (16/05/2024)
    - Backend: Work on events CRUD, user relations and some refactors on factories
    - Frontend: Added auth and unauth interceptors and navbar component

- 0.2.10 🗓️ (20/05/2024)
    - Backend: Added automatic deletion of ended events
    - Frontend: Work on eventsFeedComponent
 
- 0.2.11 🗓️ (22/05/2024)
    - Backend: Finished chat online with websocket server and hystory endpoints.
    - Frontend: Work on editEventsForm
 
- 0.2.12 🗓️ (24/05/2024)
  - Backend: Some refactorization around events endpoints 
  - Frontend: Refactoriced eventFormComponent to be reusable on event Update
 
- 0.3.12/0.3.13/0.3.14 🗓️ (25/05/2024)
  - Backend: Added search endpoint for events and refactorized routes for create, detele and update events
  - Frontend: Now we can create and update events!
 
- 0.4.14 🗓️ (26/05/2024)
  - Backend: Minnor changes
  - Frontend: Work in GameStatsComponent
 
- 0.4.20/0.4.21 🗓️ (27/05/2024)
  - Backend: Work on GameStats CRUD
  - Frontend: Minnor changes and bug fixes on searchEventComponent

- 0.5.21/0.5.22 🗓️ (28/05/2024)
  - Backend: Added GamemodeStats
  - Frontend: Added followers followed and friends data to user profile.
 
- 0.6.22 🗓️ (31/05/2024)
  - Backend: Some bug fixes and refactorization
  - Frontend: Work on GameStats

- 0.6.23 🗓️ (01/06/2024)
  - Backend: Added global chat
  - Frontend: Added check token on autoLogin and refactorized authGuard

- 0.7.23 🗓️ (02/06/2024)
  - Backend: Delete user method refactorized
  - Frontend: Update setting component to handle credentials updates

- 0.8.23/0.8.24/0.8.25 🗓️ (03/06/2024)
  - Backend: Preparing admin views
  - Frontend: Added userSearchComponent and user status managment

- 0.8.26 🗓️ (04/06/2024)
  - Backend: Preparing admin views
  - Frontend: Added guard to profile private routes, fixed minnor bug on edition of Socials, refactorized       
              profileCardComponent and added loged user to the event participants list

- 0.8.27/0.8.28/0.8.29 🗓️ (07/06/2024)
  - Backend: CORS Handle and middlewaes for production
  - Frontend: Work con private Chats feature

- 0.8.30 🗓️ (11/06/2024)
  - Backend: Added handler for web unauthorized and post public route for avatars and default avatar
  - Frontend: Work on admin views on Laravel
 
- 0.8.31 🗓️ (11/06/2024)
  - Backend: Start API documentation with Swagger
  - Frontend: Global chat and emoji picker added
    
- 0.9.31 🗓️ (11/06/2024)
  - Backend: Advises feature
  - Frontend: Multiple bugs fixed
 
- 1.0.0 🗓️ (11/06/2024)
 - WE ARE DONE!!
  
## Bibliography
- Frontend
  - [Angular 17 Documentation](https://angular.dev/overview)
  - [Angular 17 Interceptors](https://medium.com/@mohsinogen/angular-17-http-interceptors-guide-417e7c8ffada)
  - [Tailwind 3 Documentation](https://tailwindcss.com/docs)
  - [Daisy UI Documentation](https://daisyui.com/docs)
  
- BackEnd
  - [Laravel 10](https://docs.google.com/document/d/11o66V_6gooL5eodWQqh5A8usfJYtiiO_u6D4t4kuhWc/edit#heading=h.lq8wkgqychh3) Author: Antonio J. Sánchez Bujaldón
  - [Laravel 11 Documentation](https://laravel.com/docs/11.x/releases)
  - [Email Verification](https://laravel.com/docs/11.x/verification)
  - [Events](https://laravel.com/docs/11.x/events)
  - [Error Handling](https://laravel.com/docs/11.x/errors)
  - [Render Exceptios](https://laravel.com/docs/11.x/errors#renderable-exceptions)
  - [Middleware](https://laravel.com/docs/11.x/middleware)
  - [Unauthorized request JSON response](https://laracasts.com/discuss/channels/laravel/laravel-11-api-unauthorized-requests-redirects-to-login-page?page=1&replyId=930192)

## Checkpoint Video
  [Video🎬](https://drive.google.com/file/d/1F81V0F58sIDZHxnyY5XTL2U2HFycFt-Y/view?usp=sharing)
