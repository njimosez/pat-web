const git = require('isomorphic-git');
const fs = require('fs');
const os = require('os');
const path = require('path');
const globby = require('globby');
const dirTree = require('directory-tree');
git.plugins.set('fs', fs)

// Make asynchronous temporary directory
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'));
console.log(dir);
// Behold - it is empty!
fs.readdirSync(dir);

var data = [];


module.exports = function(app) {

    // Index page controller
    app.get('/', function(req, res) {

        res.render('index.html');

    });

    app.post('/project', function(req, res) {
        console.log(req.body.giturl);

        void async function cloneRepo() {
            await git.clone({
                fs,
                dir,
                url: req.body.giturl,
                ref: 'master',
                singleBranch: true,
                depth: 1
            });
        }();

        function getTree() {
            // Some logic to retrieve, or generate tree structure
            data = dirTree(dir, { extensions: /\.yml$/ }, null, (item, PATH, stats) => {
                console.log(data.toString);

            });
            return data;
        }


        (async() => {
            const paths = await globby('images', {
                expandDirectories: {
                    files: ['cat', 'unicorn', '*.jpg'],
                    extensions: ['png']
                }
            });

            console.log(paths);
            //=> ['cat.png', 'unicorn.png', 'cow.jpg', 'rainbow.jpg']
        })();
        // All the files in the previous commit


        /*  if (process.argv.length <= 2) {
             console.log("Usage: " + dir + " path/to/directory");
             process.exit(-1);
         }
          
         var path = process.argv[2];
          
         fs.readdir(path, function(err, items) {
             for (var i=0; i<items.length; i++) {
                 var file = path + '/' + items[i];
                 console.log("Start: " + file);
          
                 fs.stat(file, function(err, stats) {
                     console.log(file);
                     console.log(stats["size"]);
                 });
             }
         }); */

        fs.readdirSync(dir).forEach(file => {
            console.log(file);
        });
        res.render(JSON.stringify(getTree()));
        // res.render('project', { data: getTree() });

        //  $('#tree').treeview({data: getTree()});
        // console.log(dir.path)
        // data.forEach(file => {
        //  console.log(file);
        //});
    });

}; // end module.