import { Metadata } from 'next';

import prismadb from '@/lib/prismadb';
import { SizeForm } from '../components/size-form';

export const metadata: Metadata = {
    title: 'Admin | Size',
    description: "Admin Individual Size Form Page"
};

interface SizePageProps {
    params: {
        sizeId: string;
    }
};

const SizePage: React.FC<SizePageProps> = async ({
    params
}) => {

    const size = await prismadb.size.findUnique({
        where: {
            id: params.sizeId
        }
    });


  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <SizeForm initialData={size}/>
        </div>
    </div>
  )
}

export default SizePage;
