import { createAutoreplies } from "./autoreplies";
import { seedProducts } from "./products";
import { userSeeders } from "./user";



async function main() {
    await userSeeders();
    await createAutoreplies();
}

main();