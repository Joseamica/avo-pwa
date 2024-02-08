const dbConfig = {
  user: process.env.MSSQLUSER,
  password: process.env.MSSQLPASSWORD,
  server: process.env.MSSQLSERVER,
  database: process.env.MSSQLDATABASE,
  port: process.env.MSSQLPORT ? parseInt(process.env.MSSQLPORT) : 1433,
  requestTimeout: 30000, // Tiempo de espera en milisegundos,

  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
}

module.exports = dbConfig
