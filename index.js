const fs = require('fs');
const directoryPath = './';
const host = "https://raw.githubusercontent.com/pirumu/stickers/master/";

const output = {};
fs.readdir(directoryPath, { withFileTypes: true }, async (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    for(const file of files) {

        if(!file.isDirectory() || ['.git','.idea'].includes(file.name)) {
            continue;
        }

        const fpath= process.cwd()+'/'+file.name;

        const allFiles = (host,folder,path) => new Promise((rs,rj) => {
            fs.readdir(path, { withFileTypes: true }, (err, files) => {
                if(err) {
                    return rj(err)
                }

                return rs(files.map(f => {
                    return {
                        id: f.name.split('.')[0],
                        imgUrl: host+ folder+'/'+ f.name,
                        names: [ f.name.split('.')[0]]
                    }
                }))
            });
        });

        output[file.name] = await allFiles(host,file.name,fpath);
    }
    console.log(JSON.stringify(output,null,4))

});

