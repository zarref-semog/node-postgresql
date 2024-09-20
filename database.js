async function connect() {

    if(global.connection)
        return global.connection.connect();

    const { Pool } = require("pg");
    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING
    });

    const client = await pool.connect();
    console.log("Criou o pool de conexão");

    const res = await client.query("select now()");
    console.log(res.rows[0]);
    client.release();

    global.connection = pool;
    return pool.connect();
}

connect();

async function selectCustomers(){
    const client = await connect();
    const res = await client.query("SELECT * FROM clientes");
    return res.rows;
}

async function selectCustomer(id){
    const client = await connect();
    const res = await client.query("SELECT * FROM clientes WHERE id=$1", [id]);
    return res.rows;
}

async function insertCustomer(customer){
    const client = await connect();
    const sql = "INSERT INTO clientes(nome, idade, uf) VALUES ($1, $2, $3)";
    const values = [customer.nome, customer.idade, customer.uf];
    await client.query(sql, values);
}

async function updateCustomer(id, customer){
    const client = await connect();
    const sql = "UPDATE clientes SET nome=$1, idade=$2, uf=$3 WHERE id = $4";
    const values = [customer.nome, customer.idade, customer.uf, id];
    await client.query(sql, values);
}

async function deleteCustomer(id){
    const client = await connect();
    const sql = "DELETE FROM clientes WHERE id = $1";
    const values = [id];
    await client.query(sql, values);
}

module.exports = {
    selectCustomers,
    selectCustomer,
    insertCustomer,
    updateCustomer,
    deleteCustomer
}