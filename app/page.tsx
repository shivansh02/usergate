"use client"
import { useEffect, useState } from 'react';
import { fetchUsersByTenants } from '@/server/actions/fetch-users-by-tenants';
import Image from 'next/image';

type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  roles: string[];
};

type TenantUserMap = Record<string, User[]>;

export default function Home() {
  const [tenantUserMap, setTenantUserMap] = useState<TenantUserMap>({});
  const [error, setError] = useState<string | null>(null);
  const defaultAvatar = '/../public/default-avatar.jpg';

  useEffect(() => {
    async function fetchData() {
      try {
        const usersByTenants = await fetchUsersByTenants();
        setTenantUserMap(usersByTenants);
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching users by tenants:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className='w-60 border'>
      <h1 className='text-xl font-bold mb-4'>Members</h1>
      {error && <p className="text-red-500">{error}</p>}
      {Object.keys(tenantUserMap).map((tenantName) => (
        <div key={tenantName}>
          <h2 className='.dark'>{tenantName}</h2>
          <ul>
            {tenantUserMap[tenantName].map((user) => (
              <li key={user.id}>
              <div className='flex flex-row'>
                <div>
                  <Image
                    src={user.image || defaultAvatar}
                    alt={''}
                    className="rounded-full w-8 h-8 object-cover border-2 border-gray-300"
                    width={12}
                    height={12}
                  />
                </div>
                <div>
                  <p>{user.name || 'No Name'}</p>
                  {/* <p>Roles: {user.roles.join(', ')}</p> */}
                </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
