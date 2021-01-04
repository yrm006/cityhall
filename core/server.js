//% deno run --allow-net --allow-read --allow-write server.js
import { Application, Router ,send} from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";


const router = new Router();{
    router.get("/", async function(ctx){
        ctx.response.body = { message: "cityhall ver 0.1.0" };
    });
    router.post("/message", async function(ctx,res){
        const v = await ctx.request.body().value;                                                    
        console.log( v );
        const db = new DB("cityhall.db");{
            db.query("INSERT INTO TMessage (sBody,sUrl) VALUES (?,?)", [v.s,v.u]);
            db.close();
        }
        ctx.response.body = { message: "OK" };
    });
    router.get("/message", async function(ctx){
        let r = null;

        const db = new DB("cityhall.db");{
            r = [...db.query("SELECT * FROM TMessage order by dtCreated desc").asObjects()];
            db.close();
        }

        ctx.response.body = r;
    });
}

const app = new Application();{
    const port = 8080;
    app.use(oakCors());
    app.use(router.routes());
    app.use(router.allowedMethods());
                                                                        console.log('running on port ', port);
    await app.listen({ port });
}