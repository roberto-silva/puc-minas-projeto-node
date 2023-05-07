/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("animes", tbl => {
        tbl.increments ('id') ;
        tbl.text ("name", 100)
            .unique ()
            .notNullable();
        tbl.text ("description", 255);
        tbl.text ("creatorName", 255);
        tbl.text ("category", 100).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists ("animes")
};
