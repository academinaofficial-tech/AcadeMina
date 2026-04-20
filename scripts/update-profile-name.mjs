import pg from "pg";

const { Client } = pg;

// DIRECT_URLを直接指定
const client = new Client({
  connectionString: process.env.DIRECT_URL,
  ssl: { rejectUnauthorized: false },
});

const USER_ID = process.env.USER_ID;
const FIRST_NAME = process.env.FIRST_NAME || "academina official";
const LAST_NAME = process.env.LAST_NAME || "";

await client.connect();

const result = await client.query(
  `UPDATE "Profile" SET "firstName" = $1, "lastName" = $2 WHERE id = $3 RETURNING id, "firstName", "lastName"`,
  [FIRST_NAME, LAST_NAME, USER_ID]
);

if (result.rowCount === 0) {
  console.log("❌ ユーザーが見つかりませんでした。USER_IDを確認してください。");
} else {
  console.log("✅ 更新しました:", result.rows[0]);
}

await client.end();
