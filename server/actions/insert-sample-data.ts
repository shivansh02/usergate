// "use server"

// import { db, } from '..';
// import { users, tenants } from '../schema';

// export async function insertSampleData() {
//     try {
//         const user1 = await db.insert(users).values({
//             id: crypto.randomUUID(),
//             name: 'John Doe',
//             email: 'john.doe@example.com',
//             emailVerified: new Date(),
//             password: 'securepassword',
//             image: 'https://example.com/john.jpg',
//             twoFactorEnabled: false,
//         }).returning();

//         const user2 = await db.insert(users).values({
//             id: crypto.randomUUID(),
//             name: 'Jane Smith',
//             email: 'jane.smith@example.com',
//             emailVerified: new Date(),
//             password: 'anothersecurepassword',
//             image: 'https://example.com/jane.jpg',
//             twoFactorEnabled: false,
//         }).returning();

//         const tenant1 = await db.insert(tenants).values({
//             name: 'Acme Corporation',
//             description: 'A fictional company',
//             created_at: new Date(),
//             created_by: user1[0].id,
//         }).returning();

//         const tenant2 = await db.insert(tenants).values({
//             name: 'Globex Corporation',
//             description: 'Another fictional company',
//             created_at: new Date(),
//             created_by: user2[0].id,
//         }).returning();

//         return {
//             success: true,
//             users: [user1, user2],
//             tenants: [tenant1, tenant2],
//         };
//     } catch (error: any) {
//         console.error('Error inserting sample data:', error);
//         return {
//             success: false,
//             error: error.message,
//         };
//     }
// }


"use server"

import {db} from '..';

import { users, userRoles } from '../schema';

export async function insertUserAndAssignToTenant(userId: string, tenantId: number): Promise<void> {
    try {
        const insertedUser = await db
            .insert(users)
            .values({
                id: userId,
                name: 'John Doe',
                email: 'john.doe@example.com',
                emailVerified: new Date(),
                password: 'securepassword',
                image: 'https://example.com/john.jpg',
                twoFactorEnabled: false,
            })
            .returning();

        await db
            .insert(userRoles)
            .values({
                user_id: insertedUser[0].id,
                role_id: 1,
                tenant_id: tenantId,
            })
            .execute();

        console.log(`User ${insertedUser[0].id} inserted and assigned to tenant ${tenantId}`);
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
}
