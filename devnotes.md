 # Dev Notes
1.  Implemented  a web application arhitecture using NodeJS Express/Nujuncks
2.  Implemented PAT web Use cases 1 and 2 -10/27/2018
3.  - Fix the missing local project folder issue preventing the app to store a retrieved PAT Project
    - Update the Readme file with installation notes - 10-28-2019

# 10-29-19 -Edwin Ngwa
1. Implemented an light database layer using Sqlite3 to persist user sessions variables
2. Implemented ORM to model a user object using the session id as the uniqueid
3. Implemented templates and functions to render links to various features if a PAT project was previously retrieved in a session :
   -  User will now see navigation buttons on the home page if a valid PAT project is retrieved and available in the local repo
4. Added a function call to create the project directory if it does not exist
5. Updated gitignore to untrack the sqlite db and the project directory
7. Implemented more validation and  exception handling
8. Implemented the home page hyperlinks : Selecting the logo or the Home menu link  will redirect the user to the home page
6. Added comments and some code cleanup


# Dev Status 10-29-19
- PAT SRS Use cases 1 and 2 completed and awaiting unit and integration testing for feedbacks
- Tested to verify that db:migrate will create and migrate the sqlite db files if none exist

# 11-06-19 -Edwin Ngwa

- Replaced Sqlite3 with an embedded/lightweight NoSQL database (NeDB) similar to MongoDB
- Refactored the controller, services and utility functions files to be more representative of an MVC design pattern
- Fix the main menu navigation. User can now navigate between features when a valid project is loaded
- Model the project data into JSON for an ease of marshalling when consumming objects
- Implemented the delete project feature to enable the user to remove a project from the local repo before retrieving a new PAT
- Implemented additional validation rules to curb known runtimne errors
- Refactored the HTML code in the Project Files page to enable the view of procedure and tasks files details
- Dry runs of various scenarios to over use cases 1 and 2

# 11-09-19 -Edwin Ngwa

- Decoupled and modularized the various layers of the application   
- Implemented 3 separate embedded document db (project, procedure and task) 
- Implemented viewing of the PAT procedures and tasks raw details in the project files page
- More cleanup ,code formatting and comments  
# TODO : Test Team

1. [] Validate Use Case 1 and 2
2. [] Create unit tests for code coverage
