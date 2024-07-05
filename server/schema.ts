import { pgTable, serial, text, varchar, integer, timestamp, primaryKey, unique, foreignKey, pgEnum } from 'drizzle-orm/pg-core';

export const Role = pgEnum('Role', ['USER', 'MOD', 'ADMIN']);
export const AccessLevel = pgEnum('AccessLevel', ['PUBLIC', 'PRIVATE', 'CLASSIFIED']);

export const User = pgTable('User', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  role: Role('role').notNull().default('USER'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const Tenant = pgTable('Tenant', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const TenantUser = pgTable('TenantUser', {
    id: serial('id').primaryKey(),
    userId: integer('userId').notNull().references(() => User.id),
    tenantId: integer('tenantId').notNull().references(() => Tenant.id),
    role: Role('role').notNull().default('USER'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  }, (table) => ({
    uniqueUserTenant: unique('unique_user_tenant').on(table.userId, table.tenantId).nullsNotDistinct(),
  }));

export const Resource = pgTable('Resource', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  url: text('url').notNull(),
  accessLevel: AccessLevel('accessLevel').notNull().default('PUBLIC'),
  userId: integer('userId').references(() => User.id),
  tenantId: integer('tenantId').references(() => Tenant.id),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});
