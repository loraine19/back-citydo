import { Injectable } from '@nestjs/common';
import { CreateRefreshDto } from './dto/create-refresh.dto';
import { UpdateRefreshDto } from './dto/update-refresh.dto';

@Injectable()
export class RefreshService {
  create(createRefreshDto: CreateRefreshDto) {
    return 'This action adds a new refresh';
  }

  findAll() {
    return `This action returns all refresh`;
  }

  findOne(id: number) {
    return `This action returns a #${id} refresh`;
  }

  update(id: number, updateRefreshDto: UpdateRefreshDto) {
    return `This action updates a #${id} refresh`;
  }

  remove(id: number) {
    return `This action removes a #${id} refresh`;
  }
}
