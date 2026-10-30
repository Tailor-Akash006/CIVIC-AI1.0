import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthoritiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.authority.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const auth = await this.prisma.authority.findUnique({
      where: { id },
    });
    if (!auth) throw new NotFoundException(`Authority ${id} not found`);
    return auth;
  }

  async create(data: { name: string; department: string; email: string; phone?: string }) {
    return this.prisma.authority.create({
      data: {
        name: data.name,
        department: data.department,
        email: data.email.toLowerCase(),
        phone: data.phone,
      },
    });
  }
}
