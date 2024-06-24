import { Metadata } from 'next';

import prismadb from '@/lib/prismadb';
import { BillboardForm } from '@/app/(dashboard)/[store]/(routes)/billboards/components/billboard-form';

export const metadata: Metadata = {
    title: 'Admin | Billboard',
    description: "Admin Individual Billboard Form Page"
};

interface BillboardPageProps {
    params: {
        billboardId: string;
    }
};

const BillboardPage: React.FC<BillboardPageProps> = async ({
    params
}) => {

    const billboard = await prismadb.billboard.findUnique({
        where: {
            id: params.billboardId
        }
    });


  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <BillboardForm initialData={billboard}/>
        </div>
    </div>
  )
}

export default BillboardPage;
