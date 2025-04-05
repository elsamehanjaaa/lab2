import { Injectable } from '@nestjs/common';
import { Model, Document, Types } from 'mongoose';

@Injectable()
export class MongooseService {
  async getAllData<T extends Document>(model: Model<T>): Promise<T[]> {
    try {
      return await model.find().exec();
    } catch (error) {
      console.error('Error fetching all data:', error.message);
      throw error;
    }
  }

  // Get data by ID from a model

  async getDataById<T extends Document>(
    model: Model<T>,
    id: string,
  ): Promise<T> {
    try {
      const data = await model.findById(id).exec();
      if (!data) throw new Error('Data not found');
      return data;
    } catch (error) {
      console.error(`Error fetching data by ID ${id}:`, error.message);
      throw error;
    }
  }

  async getDataByName<T extends Document>(model: Model<T>, slug: string) {
    try {
      const data = await model.findOne({ slug }).exec();
      if (!data) {
        return {};
      }
      return data;
    } catch (error) {
      console.error(`Error fetching data by name ${slug}:`, error.message);
      throw error;
    }
  }
  async getDataBySQLId<T extends Document>(
    model: Model<T>,
    categoryId: number,
  ) {
    try {
      const data = await model.findOne({ categoryId }).exec();
      if (!data) {
        return {};
      }
      return data;
    } catch (error) {
      console.error(
        `Error fetching data by name ${categoryId}:`,
        error.message,
      );
      throw error;
    }
  }

  // Insert data into a model
  async insertData<T extends Document>(
    model: Model<T>,
    data: Partial<T>,
  ): Promise<T> {
    try {
      const newData = new model(data);
      console.log(newData);

      return await newData.save();
    } catch (error) {
      console.error('Error inserting data:', error.message);
      throw error;
    }
  }

  // Update data by ID in a model
  async updateData<T extends Document>(
    model: Model<T>,
    id: Object,
    update: Partial<T>,
  ): Promise<T> {
    try {
      const updatedData = await model
        .findOneAndUpdate(id, update, { new: true })
        .exec();
      if (!updatedData) throw new Error('Data not found for update');
      return updatedData;
    } catch (error) {
      console.error(`Error updating data by ID ${id}:`, error.message);
      throw error;
    }
  }

  // Delete data by ID from a model
  async deleteData<T extends Document>(
    model: Model<T>,
    id: Object,
  ): Promise<void> {
    try {
      const result = await model.findOneAndDelete(id).exec();
      if (!result) throw new Error('Data not found for deletion');
    } catch (error) {
      console.error(`Error deleting data by ID ${id}:`, error.message);
      throw error;
    }
  }
  convertToObjectId(id: string): Types.ObjectId {
    return new Types.ObjectId(id);
  }
}
