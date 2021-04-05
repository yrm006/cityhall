//% deno run --allow-net --allow-read --allow-write server-city.js
import { Application, Router} from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";


const router = new Router();{
    router.get("/", async function(ctx){
        ctx.response.body = { message: "cityhall ver 0.2.0" };
    });

    router.get("/message", async function(ctx){
        let r = null;
        console.log( "/message" );
        const db = new DB("cityhall.db");{
            r = [...db.query("SELECT * FROM TMessage order by dtCreated desc").asObjects()];
            db.close();
        }
        ctx.response.body = r;
    });
    router.get("/report", async function(ctx){
        let r = null;
        console.log( "/report" );
        const db = new DB("cityhall.db");{
            r = [...db.query("SELECT * FROM TReport order by dtCreated desc").asObjects()];
            db.close();
        }
        ctx.response.body = r;
    });
    router.get("/report_one", async function(ctx){
        let r = null;
        let p = Number.parseInt(ctx.request.url.searchParams.get("p"));
        console.log( "/report_one:" + p );
        const db = new DB("cityhall.db");{
            r = [...db.query("SELECT * FROM TReport where id=?", [p]).asObjects()];
            db.close();
        }
        ctx.response.body = r[0];
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
    router.get("/message_edit", async function(ctx,res){
        let r = null;
        console.log( "/message_edit" );
        let id = Number.parseInt(ctx.request.url.searchParams.get("id"));
        const db = new DB("cityhall.db");{
            r = [...db.query("SELECT * FROM TMessage WHERE id=?",[id]).asObjects()];
            db.close();
        }
        ctx.response.body = r[0];
    });
    router.post("/message_edit", async function(ctx,res){
        const v = await ctx.request.body().value;
        console.log( v );
        let id = Number.parseInt(ctx.request.url.searchParams.get("id"));
        const db = new DB("cityhall.db");{
            db.query("UPDATE TMessage SET sBody=?,sUrl=? WHERE id=?", [v.s,v.u,id]);
            db.close();
        }
        ctx.response.body = { message: "OK" };
    });
    router.get("/report_chat", async function(ctx){
        let r = null;
        let p = Number.parseInt(ctx.request.url.searchParams.get("p"));
        console.log( "/report_chat:" + p );
        const db = new DB("cityhall.db");{
            r = [...db.query("SELECT * FROM TReportChat where pReport=? order by dtCreated desc",[p]).asObjects()];
            db.close();
        }
        console.log(r);
        ctx.response.body = r;
    });
    router.post("/report_chat", async function(ctx,res){
        const v = await ctx.request.body().value;
        console.log( v );
        let p = Number.parseInt(ctx.request.url.searchParams.get("p"));
        const db = new DB("cityhall.db");{
            db.query("INSERT INTO TReportChat (sBody,pReport,bCity) VALUES (?,?,?)", [v.s,p,1]);
            db.close();
        }
        ctx.response.body = { message: "OK" };
    });
}

const app = new Application();{
    const port = 8080;

    app.use(oakCors());
    app.use(router.routes());
    app.use(router.allowedMethods());
                                                                        console.log('running on port ', port);
    await app.listen({
        port: port,
        secure: false,//!!!
        certFile: "server_crt.pem",
        keyFile: "server_key.pem",
    });
}


