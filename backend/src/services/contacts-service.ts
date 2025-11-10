import type {
    ContactModel,
    ContactFindManyArgs,
    ContactCreateInput,
    ContactUncheckedCreateInput,
    ContactUpdateInput,
    ContactUncheckedUpdateInput,
    ContactWhereUniqueInput,
    ContactWhereInput,
} from "../generated/models/Contact";

import type { ContactsRepository } from "../repository/contacts-repository";
import { HttpError } from "../errors/HttpError.js";

export default class ContactsService {
    private repository: ContactsRepository;

    constructor(repository: ContactsRepository) {
        this.repository = repository;
    }

    async list(args?: ContactFindManyArgs): Promise<ContactModel[]> {
        try {
            return await this.repository.findMany(args);
        } catch (e) {
            throw e;
        }
    }

    async getById(id: number): Promise<ContactModel> {
        try {
            const contact = await this.repository.findUnique({ id } as any);
            if (!contact) throw new HttpError(404, "Contact not found");
            return contact;
        } catch (e) {
            throw e;
        }
    }

    async create(
        data: ContactCreateInput | ContactUncheckedCreateInput
    ): Promise<ContactModel> {
        try {
            return await this.repository.create(data as any);
        } catch (e) {
            throw e;
        }
    }

    async update(
        id: number,
        data: ContactUpdateInput | ContactUncheckedUpdateInput
    ): Promise<ContactModel> {
        try {
            const where: ContactWhereUniqueInput = { id } as ContactWhereUniqueInput;
            const existing = await this.repository.findUnique(where);
            if (!existing) throw new HttpError(404, "Contact not found");
            return await this.repository.update(where, data as any);
        } catch (e) {
            throw e;
        }
    }

    async remove(id: number): Promise<ContactModel> {
        try {
            const where: ContactWhereUniqueInput = { id } as ContactWhereUniqueInput;
            const existing = await this.repository.findUnique(where);
            if (!existing) throw new HttpError(404, "Contact not found");
            return await this.repository.delete(where);
        } catch (e) {
            throw e;
        }
    }

    async count(where?: ContactWhereInput): Promise<number> {
        try {
            return await this.repository.count(where);
        } catch (e) {
            throw e;
        }
    }
}
