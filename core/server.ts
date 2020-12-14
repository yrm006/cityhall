import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const port: number = 8080;

const router = new Router();
router.get("/", ({ response }: { response: any }) => {
  response.body = {
    message: "cityhall ver 0.1.0",
  };
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log('running on port ', port);
await app.listen({ port });


