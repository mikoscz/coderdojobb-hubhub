import { build } from "../app";

const dbUrl = process.env.DB_URL || ":memory:";

const app = build({
  dbUrl,
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`HubHub is listening on port ${port} http://localhost:${port}`);
});
