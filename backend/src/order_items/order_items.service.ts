import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderItems } from 'src/schemas/order_items.schema';

@Injectable()
export class OrderItemsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mongooseService: MongooseService,
    @InjectModel(OrderItems.name)
    private readonly OrderItemsModel: Model<OrderItems>,
  ) {}
  async create(createOrderItemDto: CreateOrderItemDto) {
    const { data, error } = await this.supabaseService.insertData(
      'order_items',
      createOrderItemDto,
    );

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    const mongo = await this.mongooseService.insertData(this.OrderItemsModel, {
      ...createOrderItemDto,
      _id: data[0].id,
    });

    if (!mongo) {
      throw new Error('Error inserting data into MongoDB');
    }

    return data;
  }

  async findAll() {
    return await this.mongooseService.getAllData(this.OrderItemsModel);
  }

  async findOne(id: string) {
    return await this.mongooseService.getDataById(this.OrderItemsModel, id);
  }
  async getOrderItemsByOrderId(orderId: string) {
    return await this.mongooseService.getDataBySQL(this.OrderItemsModel, {
      order_id: orderId,
    });
  }

  update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    return `This action updates a #${id} orderItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderItem`;
  }
}
