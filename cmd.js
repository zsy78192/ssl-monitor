// require commander
const { program } = require('commander');

// require db
const { Database } = require('./db');

// read cli
program
    // option name
    .option('-n, --name <name>', 'website name')
    // option desc
    .option('-d, --desc <desc>', 'website description')

program.parse();
const options = program.opts();
// params
const [control, host] = program.args;

// control must be add,remove,update or list
if (!['add', 'remove', 'update', 'list'].includes(control)) {
    console.log('control must be add, remove, update or list');
    return;
}

let db = new Database();
// control is list
if (control === 'list') {

    db.queryAllWebsite().then((list) => {
        // read list and table it
        console.table(list.map((e) => {
            return e.dataValues
        }));

        setTimeout(() => {

            db.close()
        }, 500);
    })


    return;
}

// if host is null, return
if (!host) {
    console.log('host cannot be empty');
    return;
}

let cli = async () => {
    // control is add
    if (control === 'add') {

        // queryWebsiteByHost
        let website = await db.queryWebsiteByHost(host)
        if (website) {
            console.log('website already exists');
            return;
        }

        let res = await db.addWebsite(options.name, host, new Date(), options.desc)
        console.log('add website success');
    }

    // control is remove
    else if (control === 'remove') {
        // queryWebsiteByHost
        let website = await db.queryWebsiteByHost(host)
        if (!website) {
            console.log('website not exists');
            return;
        }
        // deleteWebsite by id
        let res = await db.deleteWebsite(website.id);
        console.log('remove website success');
    }

    // control is update
    else if (control === 'update') {
        // queryWebsiteByHost
        let website = await db.queryWebsiteByHost(host)
        if (!website) {
            console.log('website not exists');
            return;
        }

        let data = {};
        if (options.name) {
            data.name = options.name;
        }
        if (options.desc) {
            data.desc = options.desc;
        }
        // updateWebsite by id
        let res = await db.updateWebsite(website.id, data);
        console.log('update website success');
    }
}

cli()
    .then(() => {
        console.log('done');

        setTimeout(() => {

            db.close()
        }, 500);
    })
    .catch(e => {
        // console.log(e);
    })

