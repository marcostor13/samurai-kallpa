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
}
