import { Application, Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";



interface Person {
  id: number;
  firstName: string;
  lastName: string;
  avatar: string;
}

function getRandomName() {
  const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Hank", "Ivy", "Jack", "Karen", "Leo", "Mona", "Nina", "Oscar", "Paul", "Quinn", "Rita", "Sam", "Tina", "Uma", "Vince", "Wendy", "Xander", "Yara", "Zane"];
  const lastNames = ["Johnson", "Smith", "Brown", "Williams", "Jones", "Garcia", "Miller", "Davis", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark"];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return { firstName, lastName };
}

function generatePeople(count: number): Person[] {
  const people: Person[] = [];
  for (let i = 1; i <= count; i++) {
    const { firstName, lastName } = getRandomName();
    people.push({
      id: i,
      firstName,
      lastName,
      avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}` // pravatar has 70 images
    });
  }
  return people;
}

let people: Person[] = generatePeople(100);
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