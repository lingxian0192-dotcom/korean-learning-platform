import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto, UpdateResourceDto } from './dto/resource.dto';
import { SupabaseGuard } from '../auth/supabase.guard';
import { InvitedGuard } from '../auth/invited.guard';

@Controller('resources')
@UseGuards(SupabaseGuard, InvitedGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  create(@Request() req, @Body() createResourceDto: CreateResourceDto) {
    const userId = req.user.id;
    const token = req.token;
    return this.resourcesService.create(createResourceDto, userId, token);
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
  @UseGuards(SupabaseGuard)
  update(@Request() req, @Param('id') id: string, @Body() updateResourceDto: UpdateResourceDto) {
    const userId = req.user.id;
    const token = req.token;
    return this.resourcesService.update(id, updateResourceDto, userId, token);
  }

  @Delete(':id')
  @UseGuards(SupabaseGuard)
  remove(@Request() req, @Param('id') id: string) {
    const token = req.token;
    return this.resourcesService.remove(id, token);
  }
}
