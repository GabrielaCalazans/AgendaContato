import { NextFunction, Request, Response, Router } from "express";
import { ContactsController } from "./controllers/contacts-controller";
import PrismaContactsRepository from "./repository/prisma/PrismaContactsRepository";
import ContactsService from "./services/contacts-service";

const router = Router();

router.get('/status', (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: "API is online!" });
});

// Instantiate repository, service and controller (simple DI)
const repo = new PrismaContactsRepository();
const service = new ContactsService(repo);
const contactsController = new ContactsController(service);

router.use('/contacts', contactsController.router);

export { router };
