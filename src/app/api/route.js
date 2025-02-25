import db from "@/db/db"; // Import SQLite connection

export async function GET(req) {
  if (req.method === "GET") {
    const sections = db
      .prepare(
        `
            SELECT sections.name, logs.last_run, logs.tests_passed, logs.tests_failed, logs.tests_skipped
            FROM logs
            LEFT JOIN sections
            ON logs.id = sections.id
        `,
      )
      .all();
    // const sections = db.prepare("SELECT name from sqlite_master where type='table'").all();
    // db.serialize(function () {
    //   db.all(
    //     "select name from sqlite_master where type='table'",
    //     function (err, tables) {
    //       console.log(tables);
    //     },
    //   );
    // });
    return Response.json(sections);
  } else {
    return Response.json({ error: "Method Not Allowed" });
  }
}
