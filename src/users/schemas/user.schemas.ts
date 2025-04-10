import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { gender } from 'src/enums/gender.enum';
import { Role } from 'src/enums/role.enum';

@Schema({
  timestamps: true, // Tự động thêm createdAt và updatedAt
})
export class User {
  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, unique: true })
  phone: string;

  @Prop({ type: String })
  address: string;

  @Prop({
    type: String,
    enum: Role,
    default: Role.USER, // Giá trị mặc định là USER
  })
  role: string;

  @Prop({
    type: String,
    enum: gender,
    default: gender.OTHER, // Giá trị mặc định là OTHER
  })
  gender: string;

  //   @Prop({ type: Object })
  //   createdBy: {
  //     _id: mongoose.Schema.Types.ObjectId;
  //     email: string;
  //   };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
