var Sequelize = require('sequelize');
var path = require('path')


var sequelize = new Sequelize(undefined, undefined, undefined, {
    host: 'localhost',
    dialect: 'sqlite',

    storage: path.join(__dirname, '../database/database.sqlite')
});

/*sequelize.authenticate().then(function () {
    console.log('Connection has been established successfully.');
}).catch(function (err) {
    console.error('Unable to connect to the database:', err);
});*/

var Note = sequelize.define('note', {
    text: {
        type: Sequelize.STRING
    },
    uid: {
        type: Sequelize.STRING
    },
    time: {
        type: Sequelize.STRING
    },
    index: {
        type: Sequelize.STRING
    },
    complete: {
        type: Sequelize.STRING
    }
}, {timestamps: false})

//Note.sync({force: true})
/*Note.sync().then(function () {
    return Note.create({
        text: 'hello world'
    });
}).then(function(){
    Note.findAll({raw: true}).then(function (notes) {
        console.log(notes)
    })
})
*/

/*Note.findAll({ raw: true, where:{id: 3}}).then(function (notes) {
    console.log(notes)
})

Note.findAll({ raw: true }).then(function (notes) {
    console.log(notes)
})
*/
module.exports.Note = Note