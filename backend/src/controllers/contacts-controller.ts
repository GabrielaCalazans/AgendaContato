import { Router, Request, Response, NextFunction } from "express";
import ContactsService from "../services/contacts-service";
import { HttpError } from "../errors/HttpError.js";
import { CreateContactSchemaStrict, UpdateContactSchema } from "../validators/contacts.validator";

export class ContactsController {
    public router: Router;
    private service: ContactsService;

    constructor(service: ContactsService) {
        this.service = service;
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.get("/", this.list.bind(this));
        this.router.get("/:id", this.getById.bind(this));
        this.router.post("/", this.create.bind(this));
        this.router.put("/:id", this.update.bind(this));
        this.router.delete("/:id", this.remove.bind(this));
    }

    // List contacts (optional pagination via ?skip&take)
    private async list(req: Request, res: Response, next: NextFunction) {
        try {
            const { skip, take } = req.query;
            const args: any = {};
            if (skip !== undefined) args.skip = Number(skip);
            if (take !== undefined) args.take = Number(take);
            const data = await this.service.list(Object.keys(args).length ? args : undefined);
            return res.status(200).json(data);
        } catch (e) {
            throw e;
        }
    }

    // Get single contact by id
    private async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) throw new HttpError(400, "Invalid id parameter");
            const contact = await this.service.getById(id);
            return res.status(200).json(contact);
        } catch (e) {
            throw e;
        }
    }

    // Create contact
    private async create(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = req.body;
            const validated = CreateContactSchemaStrict.parse(payload);
            const created = await this.service.create(validated as any);
            return res.status(201).json(created);
        } catch (e) {
            throw e;
        }
    }

    // Update contact
    private async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) throw new HttpError(400, "Invalid id parameter");
            const payload = req.body;
            const validated = UpdateContactSchema.parse(payload);
            const updated = await this.service.update(id, validated as any);
            return res.status(200).json(updated);
        } catch (e) {
            throw e;
        }
    }

    // Delete contact
    private async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) throw new HttpError(400, "Invalid id parameter");
            const deleted = await this.service.remove(id);
            return res.status(200).json(deleted);
        } catch (e) {
            throw e;
        }
    }
}

