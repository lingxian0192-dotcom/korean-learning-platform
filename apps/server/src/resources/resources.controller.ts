import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto, UpdateResourceDto } from './dto/resource.dto';

// Placeholder for Auth Guard (will implement later)
// For now, assume we extract userId from headers or a mock
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  create(@Body() createResourceDto: CreateResourceDto) {
    // TODO: Get real user ID from AuthGuard
    const mockUserId = 'user_id_placeholder'; 
    return this.resourcesService.create(createResourceDto, mockUserId);
  }

  @Get()
  findAll() {
    return this.resourcesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResourceDto: UpdateResourceDto) {
    // TODO: Get real user ID from AuthGuard
    const mockUserId = 'user_id_placeholder';
    return this.resourcesService.update(id, updateResourceDto, mockUserId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourcesService.remove(id);
  }
}
