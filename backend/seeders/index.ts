import { createAutoreplies } from "./autoreplies";
import { userSeeders } from "./user";



async function main() {
    await userSeeders();
    await createAutoreplies();
}

main();