import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../common/schemas/user.schema';

@Injectable()
export class IdentityManagerSkill {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async register(createUserDto: any): Promise<User> {
        const existingUser = await this.userModel.findOne({ email: createUserDto.email });
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const createdUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });
        return createdUser.save();
    }

    async getProfile(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId).select('-password');
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async updateProfile(userId: string, updateDto: any): Promise<User> {
        const user = await this.userModel
            .findByIdAndUpdate(userId, updateDto, { new: true })
            .select('-password');
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async getAllUsers(): Promise<User[]> {
        return this.userModel.find().select('_id username fullName role avatarUrl').sort({ username: 1 });
    }

    async adminUpdatePassword(adminId: string, targetUserId: string, newPassword: string): Promise<User> {
        const adminUser = await this.userModel.findById(adminId);
        if (!adminUser || adminUser.role !== 'SENSEI') {
            throw new ConflictException('Unauthorized. Only SENSEI can perform this action.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await this.userModel
            .findByIdAndUpdate(targetUserId, { password: hashedPassword }, { new: true })
            .select('-password');

        if (!user) {
            throw new NotFoundException('Target user not found');
        }
        return user;
    }
}
