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

export interface ContactsRepository {
    /**
     * List contacts with optional filters/pagination
     */
    findMany(args?: ContactFindManyArgs): Promise<ContactModel[]>;

    /**
     * Find a single contact by unique identifier
     */
    findUnique(where: ContactWhereUniqueInput): Promise<ContactModel | null>;

    /**
     * Create a new contact
     */
    create(data: ContactCreateInput | ContactUncheckedCreateInput): Promise<ContactModel>;

    /**
     * Update an existing contact
     */
    update(
        where: ContactWhereUniqueInput,
        data: ContactUpdateInput | ContactUncheckedUpdateInput
    ): Promise<ContactModel>;

    /**
     * Delete a contact
     */
    delete(where: ContactWhereUniqueInput): Promise<ContactModel>;

    /**
     * Count contacts matching a filter
     */
    count(where?: ContactWhereInput): Promise<number>;
}

