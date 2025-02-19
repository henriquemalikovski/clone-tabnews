import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();

  return responseBody;
}
export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <Database />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 10000,
  });
  const updatedAtText = isLoading
    ? "Carregando..."
    : new Date(data.updated_at).toLocaleString("pt-BR");

  return <div>Última atualização: {updatedAtText}</div>;
}

function Database() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 10000,
  });

  const databaseVersion = isLoading
    ? "Carregando..."
    : data.dependencies.database.version;
  const maxConnections = isLoading
    ? "Carregando..."
    : data.dependencies.database.max_connections;
  const currentConnections = isLoading
    ? "Carregando..."
    : data.dependencies.database.current_connections;

  return (
    <div>
      <h2>Database</h2>
      <div>Versão: {databaseVersion}</div>
      <div>Conexões atuais: {currentConnections}</div>
      <div>Conexões máximas: {maxConnections}</div>
    </div>
  );
}
