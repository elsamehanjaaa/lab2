import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Orders } from 'src/schemas/orders.schema';
import { OrderItemsService } from 'src/order_items/order_items.service';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mongooseService: MongooseService,
    private readonly orderItemsService: OrderItemsService,
    private readonly coursesService: CoursesService,
    @InjectModel(Orders.name)
    private readonly OrdersModel: Model<Orders>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const { data, error } = await this.supabaseService.insertData(
      'orders',
      createOrderDto,
    );
    console.log('Supabase data:', data);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    const mongo = await this.mongooseService.insertData(this.OrdersModel, {
      ...createOrderDto,
      _id: data[0].id,
    });
    console.log('mongo data:', mongo);

    if (!mongo) {
      throw new Error('Error inserting data into MongoDB');
    }

    return data[0];
  }

  async findAll() {
    return await this.mongooseService.getAllData(this.OrdersModel);
  }

  async findOne(id: string) {
    return await this.mongooseService.getDataById(this.OrdersModel, id);
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }
  async updateOrderStatus(id: string, status: string) {
    const { data, error } = await this.supabaseService.updateData(
      'orders',
      { status },
      id,
    );

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    const mongo = await this.mongooseService.updateData(this.OrdersModel, id, {
      status,
    });

    if (!mongo) {
      throw new Error('Error updating data in MongoDB');
    }

    return data;
  }
  remove(id: number) {
    return `This action removes a #${id} order`;
  }
  async getOrderBySession(session_id: string) {
    const order = await this.mongooseService.getDataBySQL(this.OrdersModel, {
      session_id,
    });

    const orderItems = await this.orderItemsService.getOrderItemsByOrderId(
      order[0]._id,
    );
    const itemsArray = Array.isArray(orderItems) ? orderItems : [];
    const courseIds = itemsArray.map((item) => item.course_id);

    if (courseIds.length === 0) {
      return null; // No items found for this order
    }
    const coursesPromises = courseIds.map(async (id) => {
      const course = await this.coursesService.findOne(id);
      return {
        id: course._id,
        title: course.title,
        price: course.price,
        thumbnail_url: course.thumbnail_url,
      };
    });
    const courses = await Promise.all(coursesPromises);
    return {
      id: order[0]._id,
      status: order[0].status,
      total_amount: order[0].total_amount,
      currency: order[0].currency,
      items: courses,
    };
  }
}
