import { build } from "../app";
import 'dotenv/config'

const dbUrl = process.env.DB_URL || ":memory:";

const app = build({
  dbUrl,
});

const port = parseInt(process.env.PORT || "3000");

app.listen(port, '0.0.0.0', () => {
  console.log(`HubHub is listening on port ${port} http://hubhub.local:${port}`);
});
