import * as dotenv from "dotenv";
dotenv.config();
import server from "./server";
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
