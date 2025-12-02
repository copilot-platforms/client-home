import DBClient from "@/lib/db";

const db = DBClient.getInstance();

const run = async () => {
  const faultyContent = await db.setting.findMany({
    where: {
      content: {
        contains: " {workspace.brandName} ",
      },
    },
  });

  console.info(
    `Found ${faultyContent.length} faulty rows with hardcoded {workspace.brandName}`,
  );

  let counter = 0;

  for (const row of faultyContent) {
    // Replace static placeholder with data that was supposed to be rendered
    const newContent = row.content?.replaceAll(
      " {workspace.brandName} ",
      ' <span data-type="mention" class="autofill-pill" data-id="{{workspace.brandName}}">{{workspace.brandName}}</span> ',
    );
    try {
      // This technically can be done with an updateMany -> regex replace matcher but, meh
      console.info("    > Fixing data for setting with id", row.id);
      await db.setting.update({
        where: { id: row.id },
        data: {
          content: newContent,
        },
      });
      counter++;
    } catch (e) {
      console.error(e);
    }
  }
  console.info("Fixed static rows for", counter, "entries");
};

run();
