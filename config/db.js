import mongoose from "mongoose";
import dns from "dns";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is not defined");
    }

    if (uri.startsWith("mongodb+srv://")) {
      const match = uri.match(/^mongodb\+srv:\/\/(?:[^@]+@)?([^/?]+)/i);
      const hostname = match?.[1];

      if (hostname) {
        const srvName = `_mongodb._tcp.${hostname}`;

        try {
          await dns.promises.resolveSrv(srvName);
        } catch (err) {
          if (
            ["ECONNREFUSED", "EAI_AGAIN", "ENOTFOUND", "ETIMEOUT"].includes(
              err.code,
            )
          ) {
            dns.setServers(["8.8.8.8", "1.1.1.1"]);
            console.log(
              "Primary DNS lookup failed; retrying MongoDB SRV resolution using public DNS servers.",
            );
            await dns.promises.resolveSrv(srvName);
          } else {
            throw err;
          }
        }
      }
    }

    await mongoose.connect(uri);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
