const { exec } = require("node:child_process");
const { log } = require("node:console");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      console.log("🔴 Ainda não está pronto...");
      checkPostgres();
      //setTimeout(checkPostgres, 1500);
      return;
    }

    console.log("🟢 Banco de dados pronto!");
  }
}

console.log("🔴 Aguardando conexão com o banco de dados...");
checkPostgres();
