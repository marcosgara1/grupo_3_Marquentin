module.exports = (sequelize, dataTypes) => {

    let alias = "Cliente";

    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firts_name: {
            type: dataTypes.STRING
        },
        last_name: {
            type: dataTypes.STRING
        },
        email: {
            type: dataTypes.STRING        
        },
        password: {
            type: dataTypes.STRING
        },
        foto: {
            type: dataTypes.STRING
        }
    }

    let config = {
        tableName: "client",
        timestamps: false
    }

    const Client = sequelize.define(alias, cols, config);

    Client.associate = function(models) {
        Client.belongsToMany(models.Productos, {
            as: "productos",
            through: "client_product",
            foreignKey: "client_id",
            otherKey: "product_id",
            timestamps: false
        });
    }

    return Client;
}