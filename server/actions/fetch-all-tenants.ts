"use server"


import { db} from "..";

export const fetchAllTenants = async () => {
  try {
    const data = await db.query.tenants.findMany();
    return { data };
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return { serverError: "Error fetching tenants" };
  }
};
