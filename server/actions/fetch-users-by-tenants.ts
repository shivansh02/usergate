"use server"

import { users, tenants, userRoles, userRoleRelations } from "@/server/schema";
import { db } from ".."

export async function fetchUsersByTenants() {
  try {
    const usersWithRoles = await db.query.users.findMany({
      with: {
        roles: true,
        createdTenants: true,
      },
    });

    const usersByTenants: Record<string, any[]> = {};

    usersWithRoles.forEach((user:any) => {
      user.createdTenants.forEach((tenant: any) => {
        const tenantName = tenant.name;
        if (!usersByTenants[tenantName]) {
          usersByTenants[tenantName] = [];
        }
        usersByTenants[tenantName].push({
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles.map((role: any) => role.name),
        });
      });
    });

    return usersByTenants;
  } catch (error) {
    console.error("Error fetching users by tenants:", error);
    throw error;
  }
}
