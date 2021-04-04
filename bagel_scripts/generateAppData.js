// Script to generate data for the app


const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    client_encoding: "UTF8",
    database: 'BagelQB',
    password: 'postgres',
    port: 5432,
})

let fs = require('fs');




console.log("--- GENERATING APP DATA START ---");

/**
 * Function to generate category mapping and output it to a file
 */
function generateCategoryMapping() {
    console.log("CATEGORY MAPPING:\n")
    pool.query("SELECT * FROM categories", (err, res) => {
        if (err) throw err;

        let forwardMapping = res.rows.map(({id, name, ...rest}) => {return {[id]: name}}).reduce((acc,cur) => ({...acc,...cur}), {});
        let backwardsMapping = res.rows.map(({id, name, ...rest}) => {return {[name]: id}}).reduce((acc,cur) => ({...acc,...cur}), {});

        let mapping = {forwards: forwardMapping, backwards: backwardsMapping};

        fs.writeFile('./generated_data/categoryMapping.json', JSON.stringify(mapping), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    })
}

/**
 * Function to generate subcategory mapping and output it to a file
 */
function generateSubcategoryMapping() {
    console.log("SUBCATEGORY MAPPING:\n")
    pool.query("SELECT * FROM subcategories", (err, res) => {
        if (err) throw err;
        let forwardMapping = res.rows.map(({id, name, category_id, ...rest}) => {return {[id]: {name: name, category_id: category_id}}}).reduce((acc,cur) => ({...acc,...cur}), {});
        let backwardsMapping = res.rows.map(({id, name, category_id, ...rest}) => {return {[name]: {id: id, category_id: category_id}}}).reduce((acc,cur) => ({...acc,...cur}), {});

        let mapping = {forwards: forwardMapping, backwards: backwardsMapping};

        fs.writeFile('./generated_data/subcategoryMapping.json', JSON.stringify(mapping), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    })
}

/**
 * Function to generate a mapping from category to a list of subcategories
 */
function generateCategoryTranslation() {
    console.log("CAT -> SUBCAT MAPPING:\n")
    pool.query("SELECT * FROM categories", (err, res) => {
        if (err) throw err;


        let mappingArr = [];

        res.rows.forEach((cat) => {
            pool.query("SELECT * FROM subcategories WHERE category_id = " + cat.id, (err, res) => {
                mappingArr.push({[cat.id]: res.rows});
            })
        })

        // This is utterly stupid but I can't think of a better way to do this at the moment.
        setTimeout(() => {

            fs.writeFile('./generated_data/categoryTranslation.json', JSON.stringify(mappingArr.reduce((acc,cur) => ({...acc,...cur}), {})), function (err) {
                if (err) throw err;
                console.log('Saved!');
            });

        }, 5000);



    })
}

generateCategoryMapping();
generateSubcategoryMapping();
generateCategoryTranslation();