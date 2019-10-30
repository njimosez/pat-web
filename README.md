# pat-web-app (Project is under active development)

The purpose of this web app(under development) is to facilitate large structural changes and bootstrapping of task 
files used in automating the creation of NASA Extravehicular Activities (EVAs, AKA &quot;spacewalks&quot;)
 procedures when using the [Procedure Authoring Thing](https://github.com/xOPERATIONS/pat).

 # Dev Notes
   Read devnotes.md for development status
 
# Install for testing dev purposes
1. Install [node LTS version](https://nodejs.org/en/download/).
2. Install [Visual Studio Code](https://code.visualstudio.com/download).
3. Clone this repository from GitHub
 ```git clone https://github.com/njimosez/pat-web.git```
4. Navigate into the project directory, using command `cd pat-web`
5. Use NPM to install the module, using command `npm install`
6. Issue cmd `npx sequelize db:migrate` to autogenerate embedded db(sqlite3) migration
7. Issue cmd `node app` to start the application
8. Open  `http://localhost:3000` in your browser
9. Test and provide feedback

# Pulling updates
1. Navigate into the project directory
5. Issue cmd `git pull` to pull latest
3. Use NPM to update the module, using command `npm install`
4. Issue cmd `npx sequelize db:migrate` to autogenerate embedded db(sqlite3) migration
5. Issue cmd `node app` to start the application
6. Open  `http://localhost:3000` in your browser
7. Test and provide feedback

## Credits

### Project Sponsor

James Montalvo

### UMUC Phase III Development Team, Fall 2019

Goerling Walter
Jalloh Ibrahim 
Magoola Ibrahim
Ngwa Edwin 
Senshaw Araya
