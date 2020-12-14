//% deno run --allow-net --allow-read --allow-write server.js
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";



const router = new Router();{
    router.get("/", async function(ctx){
        ctx.response.body = { message: "cityhall ver 0.1.0" };
    });
    router.post("/", async function(ctx){
        const v = await ctx.request.body().value;
                                                                        console.log( v.s );
        const db = new DB("cityhall.db");{
            db.query("INSERT INTO TMessage (sBody) VALUES (?)", [v.s]);
            db.close();
        }

        ctx.response.body = "OK";
    });
}

const app = new Application();{
    const port = 8080;

    app.use(router.routes());
    app.use(router.allowedMethods());
                                                                        console.log('running on port ', port);
    await app.listen({ port });
}


