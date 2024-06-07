import * as dotenv from "dotenv";
dotenv.config();
import server from "./server";
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
