
exports.up = (knex) => {
    return knex.schema
        .createTable("products", (table) => {
            table.increments("id");
            table.integer("timestamp").notNullable();
            table.integer("currentQuantity").notNullable();
            table.string("nombre").notNullable();
            table.decimal("precio", 5, 2).notNullable();
            table.string("descripcion").notNullable();
            table.string("codigo").notNullable();
            table.string("foto").notNullable();
            table.integer("totalStock").notNullable();
        })
};

exports.down = (knex) => {
    return knex.schema.dropTable("productos");
};
