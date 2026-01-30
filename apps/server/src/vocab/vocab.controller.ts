import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { VocabService, CreateVocabDto } from './vocab.service';
import { SupabaseGuard } from '../auth/supabase.guard';
import { InvitedGuard } from '../auth/invited.guard';

@Controller('vocab')
@UseGuards(SupabaseGuard, InvitedGuard)
export class VocabController {
  constructor(private readonly vocabService: VocabService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateVocabDto) {
    return this.vocabService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req, @Query() query) {
    return this.vocabService.findAll(req.user.id, query);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.vocabService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: Partial<CreateVocabDto>) {
    return this.vocabService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.vocabService.remove(req.user.id, id);
  }
}
