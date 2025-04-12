import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { In } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, User as UserM } from './schemas/user.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name) // Inject the User repository
    private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  // hash password
  getHashedPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto) {
    const { email, name, password, phone, address, gender } = createUserDto;
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = this.getHashedPassword(password);

    const newUSer = await this.userModel.create({
      email,
      name,
      password: hashedPassword,
      phone,
      address: address || null,
      gender,
    });

    return {
      _id: newUSer?._id,
      email: newUSer?.email,
      createdAt: newUSer?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    // Check if the id is a valid ObjectId
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async update(updateUserDto: UpdateUserDto) {
    // Check if the id is a valid ObjectId
    const { _id } = updateUserDto;
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('Invalid user ID format');
    }
    const exists = await this.userModel.findById(_id);
    if (!exists) {
      throw new BadRequestException('User not found');
    }

    const updated = await this.userModel.updateOne(
      { _id: _id },
      {
        ...updateUserDto,
      },
    );
    return updated;
  }

  async remove(id: string) {
    // Check if the id is a valid ObjectId
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID format');
    }
    const exists = await this.userModel.findById(id);
    if (!exists) {
      throw new BadRequestException('User not found');
    }

    // await this.userModel.updateOne(
    //   { _id: id },
    //   // {
    //   //   deletedBy: {
    //   //     _id: user._id,
    //   //     email: user.email,
    //   //   },
    //   // },
    // );
    return this.userModel.softDelete({ _id: id });
  }
}
