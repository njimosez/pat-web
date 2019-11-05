// Initialize isomorphic-git with a file system
window.fs = new LightningFS('fs')
git.plugins.set('fs', window.fs)

// make a Promisified version for convenience
window.pfs = window.fs.promises

window.dir = '/tutorial'

console.log(dir);

//let response = await pfs.mkdir(dir);
// Behold - it is empty!
//let data = await pfs.readdir(dir);



async function getFolder()
{
 let folder = await git.clone({
    fs,
    dir,
    corsProxy: 'https://cors.isomorphic-git.org',
    url: 'https://gitlab.com/xOPERATIONS/sts-134',
    ref: 'master',
    singleBranch: true,
    depth: 10
});
  return folder;

}
getFolder()
.then(folder => console.log(folder));

// Now it should not be empty...
//fs.readdirSync(dir);