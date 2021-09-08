const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');


class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password)
    }
}

//define user table columns and config
User.init(
    {
        //define User columns
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement:true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            // this means the password must be at least four characters long
            len: [4]
            }
        }
    },
    {
        //table column configurations
        hooks: {
            async beforeCreate(newUserData) {
                try {
                    newUserData.password = await bcrypt.hash(newUserData.password, 10);
                    return newUserData; 
                } catch (error) {
                    console.log(error);
                }
            },
            async beforeUpdate(updatedUserData) {
                try {
                    updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                    return updatedUserData;         
                } catch (error) {
                    console.log(error);
                }
            }
        },
        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        //don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        underscored:true,
        // make it so our model name stays lowercase in the database
        modelName:'user'

    }
);

module.exports = User;