import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: User): Promise<User> {
    console.log(user)
    const createdUser = await this.userModel.create(user);
    return createdUser;
  }

  getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(_id: string) {
    const user = await this.userModel.findOne({ _id: _id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  find(email: string) {
    return this.userModel.find({ email });
  }

  async update(_id: string, attrs: Partial<User>) {
    const updatedUser = await this.userModel.findOneAndUpdate({ _id }, attrs, {
      new: true,
    });
    
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async remove(_id: string) {
    const user = await this.userModel.findOneAndDelete({ _id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
