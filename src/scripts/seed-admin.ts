import { auth } from "@/server/auth";
import { text, password, intro, outro, isCancel, cancel } from "@clack/prompts";
import { z } from "zod";
import colors from "picocolors";
import { db } from "@/server/db";

async function main() {
  intro(colors.cyan("🌱 Welcome to the ClashOfApps Admin User Seeder 🌱"));

  const email = await text({
    message: "Enter admin email:",
    validate(value: string) {
      const result = z.string().email().safeParse(value);
      if (!result.success) return "Please enter a valid email address";
      return;
    },
  });

  if (isCancel(email)) {
    cancel("Operation cancelled");
    process.exit(0);
  }

  const pwd = await password({
    message: "Enter admin password:",
    validate(value: string) {
      if (value.length < 8)
        return "Password must be at least 8 characters long";
      return;
    },
  });

  if (isCancel(pwd)) {
    cancel("Operation cancelled");
    process.exit(0);
  }

  try {
    try {
      await auth.api.signUpEmail({
        headers: new Headers(),
        body: {
          email: email,
          password: pwd,
          name: "Admin User",
        },
      });
    } catch (_) {
      // it's ok if the user already exists
    }

    // we update the role to admin
    await db.user.update({
      where: { email },
      data: { role: "admin", credits: 100000 },
    });

    outro(colors.green("✨ Admin user created successfully!\n\n"));
  } catch (error) {
    cancel(
      colors.red("Error creating admin user:\n") +
        colors.dim(error instanceof Error ? error.message : "Unknown error"),
    );
    process.exit(1);
  }
}

main().catch((error) => {
  cancel(
    colors.red("Fatal error:\n") +
      colors.dim(error instanceof Error ? error.message : "Unknown error"),
  );
  process.exit(1);
});
