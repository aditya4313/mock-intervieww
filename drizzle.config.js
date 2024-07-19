/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:RW1IbXAxM5td@ep-hidden-waterfall-a5tjuh1g.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require',
  }
};
