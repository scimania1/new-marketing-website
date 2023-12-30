import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options: MongoClientOptions = { maxPoolSize: 10 };

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "production") {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
} else {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
  } else {
    clientPromise = global._mongoClientPromise;
    console.log("global was defined");
  }
}

export default clientPromise;
// class Singleton {
//   private static _instance: Singleton;
//   private client: MongoClient;
//   private clientPromise: Promise<MongoClient>;
//   private constructor() {
//     this.client = new MongoClient(uri, options);
//     this.clientPromise = this.client.connect();
//     if (process.env.NODE_ENV === "development") {
//       global._mongoClientPromise = this.clientPromise;
//     }
//   }
//   public static get instance() {
//     if (!this._instance) {
//       this._instance = new Singleton();
//     }
//     return this._instance.clientPromise;
//   }
// }
//
// const clientPromise = Singleton.instance;
//
// export default clientPromise;
