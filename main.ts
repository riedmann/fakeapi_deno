import { Application, Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";



interface Person {
  id: number;
  firstName: string;
  lastName: string;
  avatar: string;
}

let people: Person[] = [
  { id: 1, firstName: "Alice", lastName: "Johnson", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, firstName: "Bob", lastName: "Smith", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, firstName: "Charlie", lastName: "Brown", avatar: "URL_ADDRESS.pravatar.cc/150?"}
];

const router = new Router();

router
  .get("/people", (ctx) => {
    ctx.response.body = people;
  })
  .post("/people", async (ctx) => {
    const body = ctx.request.body({ type: "json" });
    const newPerson = await body.value;

    const person: Person = {
      id: people.length + 1,
      firstName: newPerson.firstName,
      lastName: newPerson.lastName,
      avatar: newPerson.avatar || `https://i.pravatar.cc/150?img=${people.length + 1}`,
    };

    people.push(person);
    ctx.response.status = 201;
    ctx.response.body = person;
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });