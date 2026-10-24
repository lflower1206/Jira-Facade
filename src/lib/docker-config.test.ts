/**
 * @jest-environment node
 */
import fs from "fs";
import path from "path";
import YAML from "yaml";

const rootDir = path.resolve(__dirname, "../../");

describe("Docker Local Development Configuration", () => {
  it("configures .dockerignore with required exclusions", () => {
    const dockerignorePath = path.join(rootDir, ".dockerignore");
    expect(fs.existsSync(dockerignorePath)).toBe(true);

    const content = fs.readFileSync(dockerignorePath, "utf-8");
    const lines = content.split("\n").map((line) => line.trim());

    expect(lines).toContain("node_modules");
    expect(lines).toContain(".next");
    expect(lines).toContain(".git");
    expect(lines).toContain("coverage");
    expect(lines).toContain(".env");
    expect(lines).toContain(".env*.local");
    expect(lines).toContain("data/*.db*");
  });

  it("configures Dockerfile with Node 24 bookworm-slim, required system packages, and exec startup", () => {
    const dockerfilePath = path.join(rootDir, "Dockerfile");
    expect(fs.existsSync(dockerfilePath)).toBe(true);

    const content = fs.readFileSync(dockerfilePath, "utf-8");
    expect(content).toContain("FROM node:24-bookworm-slim");
    expect(content).toContain("openssl");
    expect(content).toContain("python3");
    expect(content).toContain("make");
    expect(content).toContain("g++");
    expect(content).toContain("COPY package.json package-lock.json ./");
    expect(content).toContain("COPY prisma ./prisma");
    expect(content).toContain("COPY prisma.config.ts ./");
    expect(content).toContain("RUN npm ci");
    expect(content).toContain(
      'CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && exec npx next dev -H 0.0.0.0"]'
    );
  });

  it("configures docker-compose.yml with structural validity, volumes, healthcheck, and exec startup", () => {
    const composePath = path.join(rootDir, "docker-compose.yml");
    expect(fs.existsSync(composePath)).toBe(true);

    const content = fs.readFileSync(composePath, "utf-8");
    const parsed = YAML.parse(content);

    expect(parsed.services).toBeDefined();
    expect(parsed.services.app).toBeDefined();

    const app = parsed.services.app;
    expect(app.build).toBe(".");
    expect(app.ports).toContain("3000:3000");
    expect(app.environment).toContain("DATABASE_URL=file:./data/jira-facade.db");
    expect(app.volumes).toEqual(
      expect.arrayContaining([
        ".:/app",
        "node_modules:/app/node_modules",
        "next_cache:/app/.next",
        "sqlite_data:/app/data",
      ])
    );
    expect(app.command).toBe(
      'sh -c "npx prisma generate && npx prisma migrate deploy && exec npx next dev -H 0.0.0.0"'
    );
    expect(app.healthcheck).toBeDefined();
    expect(app.healthcheck.test).toEqual(expect.arrayContaining(["CMD", "node", "-e"]));

    expect(parsed.volumes).toBeDefined();
    expect(parsed.volumes.node_modules).toBeDefined();
    expect(parsed.volumes.next_cache).toBeDefined();
    expect(parsed.volumes.sqlite_data).toBeDefined();
  });

  it("defines docker convenience scripts in package.json", () => {
    const pkgPath = path.join(rootDir, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

    expect(pkg.scripts["docker:dev"]).toBe("docker compose up --build");
    expect(pkg.scripts["docker:down"]).toBe("docker compose down");
    expect(pkg.scripts["docker:reset"]).toBe("docker compose down -v");
  });
});
