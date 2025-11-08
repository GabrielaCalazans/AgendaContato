import { PrismaClient } from "../../generated/client";
import type {
    ContactModel,
    ContactFindManyArgs,
    ContactCreateInput,
    ContactUncheckedCreateInput,
    ContactUpdateInput,
    ContactUncheckedUpdateInput,
    ContactWhereUniqueInput,
    ContactWhereInput,
} from "../../generated/models/Contact";

import type { ContactsRepository } from "../contacts-repository";

export default class PrismaContactsRepository implements ContactsRepository {
    private prisma: InstanceType<typeof PrismaClient>;

    constructor(prismaClient?: InstanceType<typeof PrismaClient>) {
        this.prisma = prismaClient ?? new PrismaClient();
    }

    async findMany(args?: ContactFindManyArgs): Promise<ContactModel[]> {
        return this.prisma.contact.findMany(args as any) as Promise<ContactModel[]>;
    }

    async findUnique(where: ContactWhereUniqueInput): Promise<ContactModel | null> {
        return this.prisma.contact.findUnique({ where } as any) as Promise<ContactModel | null>;
    }

    async create(
        data: ContactCreateInput | ContactUncheckedCreateInput
    ): Promise<ContactModel> {
        return this.prisma.contact.create({ data } as any) as Promise<ContactModel>;
    }

    async update(
        where: ContactWhereUniqueInput,
        data: ContactUpdateInput | ContactUncheckedUpdateInput
    ): Promise<ContactModel> {
        return this.prisma.contact.update({ where, data } as any) as Promise<ContactModel>;
    }

    async delete(where: ContactWhereUniqueInput): Promise<ContactModel> {
        return this.prisma.contact.delete({ where } as any) as Promise<ContactModel>;
    }

    async count(where?: ContactWhereInput): Promise<number> {
        return this.prisma.contact.count({ where } as any) as Promise<number>;
    }
}


