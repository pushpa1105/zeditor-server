import { ICurrentUser } from "@/common/context/requestContext";

export abstract class BaseRepository<T> {
    constructor(
        protected readonly model: any,
        protected readonly currentUser: ICurrentUser
    ) { }

    async createOne(data: Partial<T>) {
        const now = new Date();

        const doc = {
            ...data,
            created_by: this.currentUser.getUserId?.(),
            updated_by: this.currentUser.getUserId?.(),
            created_at: now,
            updated_at: now
        };

        return await this.model.insertOne(doc)
    }

    async findAll() {
        return await this.model.find({})
    }

    async findById(id: string): Promise<T> {
        return await this.model.findOne({ _id: id })
    }

    async deleteById(id: string) {
        return await this.model.deleteOne({ _id: id })
    }

    async deleteManyByIds(ids: string[]) {
        return await this.model.deleteMany({ _id: { $in: ids } })
    }

    async updateById(id: string, data: Partial<T>) {
        await this.model.updateOne({ _id: id }, data)

        return await this.findById(id)
    }
}