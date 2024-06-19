export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    address: string;
    isActive: boolean;
    isDeleted: boolean;
    updatedAt: Date;
    createdAt: Date;
}
