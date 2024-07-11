import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  varchar,
} from "drizzle-orm/pg-core"
import { relations } from 'drizzle-orm';
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import type { AdapterAccountType } from "next-auth/adapters"
import { createId } from "@paralleldrive/cuid2"
 
const connectionString = "postgres://postgres:postgres@localhost:5432/drizzle"
const pool = postgres(connectionString, { max: 1 })
 
export const db = drizzle(pool)

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  password: text("password"),
  image: text("image"),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)
 
export const emailTokens = pgTable(
  "email_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
)

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
)

 
export const twoFactorTokens = pgTable(
  "two_factor_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
    userID: text("userID").references(() => users.id, { onDelete: "cascade" }),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
)

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull().unique(),  // 'user', 'mod', 'admin'
  description: text('description'),
});

export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull().unique(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  created_by: text('created_by').references(() => users.id),
});

export const userRoles = pgTable('user_roles', {
  user_id: text('user_id').notNull().references(() => users.id),
  role_id: integer('role_id').notNull().references(() => roles.id),
  tenant_id: integer('tenant_id').notNull().references(() => tenants.id),
}, (table) => ({
  pk: primaryKey(table.user_id, table.role_id, table.tenant_id),
}));

export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  tenant_id: integer('tenant_id').notNull().references(() => tenants.id),
  name: varchar('name').notNull(),
  type: varchar('type').notNull(), // e.g., 'image', 'document'
  access_level: varchar('access_level').notNull(), // 'public', 'private', 'classified'
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const userRelations = relations(users, ({ one, many }) => ({
  createdTenants: many(tenants),
  roles: many(userRoles),
}));

export const roleRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
}));

export const tenantRelations = relations(tenants, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [tenants.created_by],
    references: [users.id],
  }),
  resources: many(resources),
  userRoles: many(userRoles),
}));

export const userRoleRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.user_id],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.role_id],
    references: [roles.id],
  }),
  tenant: one(tenants, {
    fields: [userRoles.tenant_id],
    references: [tenants.id],
  }),
}));

export const resourceRelations = relations(resources, ({ one }) => ({
  tenant: one(tenants, {
    fields: [resources.tenant_id],
    references: [tenants.id],
  }),
}));
